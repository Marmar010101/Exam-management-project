<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Module;
use App\Models\Room;
use App\Models\Teacher;
use App\Models\Exam;
use App\Services\ExamConflictService;
use App\Services\InvigilationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class SessionPlanningController extends Controller
{
    public function create(Group $group)
    {
        $modules = Module::where('group_id', $group->id)
            ->with('teacher')
            ->get();

        $rooms = Room::where('availability', true)->get();
        $teachers = Teacher::all();

        $examTypes = [
            'Continuous assessment',
            'Final exam', 
            'Make-up exam',
            'Replacement exam',
            'Practical test'
        ];

        return Inertia::render('Responsable/SessionPlanning', [
            'group' => $group,
            'modules' => $modules,
            'rooms' => $rooms,
            'teachers' => $teachers,
            'examTypes' => $examTypes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'exam_type' => 'required|string|in:Continuous assessment,Final exam,Make-up exam,Replacement exam,Practical test',
            'modules' => 'required|array',
            'modules.*.id' => 'required|exists:modules,id',
            'modules.*.duration' => 'required|integer|min:60|max:240',
        ]);

        $group = Group::withCount('students')->findOrFail($request->group_id);
        $sessionName = $request->exam_type . ' Session ' . now()->format('Y-m-d');
        $createdExams = collect();
        $detailedConflicts = [];
        
        // Get weekdays between dates
        $start = Carbon::parse($request->start_date);
        $end = Carbon::parse($request->end_date);
        $availableDates = [];
        
        for ($date = $start; $date->lte($end); $date->addDay()) {
            if (!$date->isWeekend()) {
                $availableDates[] = $date->format('Y-m-d');
            }
        }
        
        // Flexible time slots based on typical exam durations
        $timeSlots = [
            ['08:30', '12:30'],  // 4-hour slot for longer exams
            ['09:00', '11:00'],  // 2-hour slot
            ['11:15', '13:15'],  // 2-hour slot
            ['14:00', '16:00'],  // 2-hour slot
            ['16:15', '18:15']   // 2-hour slot
        ];
        
        // Check if we have enough slots
        $totalSlots = count($availableDates) * count($timeSlots);
        if ($totalSlots < count($request->modules)) {
            return response()->json([
                'success' => false,
                'message' => 'Not enough time slots. You selected ' . count($request->modules) . ' modules but only have ' . $totalSlots . ' available slots.',
                'conflicts' => [],
                'scheduled_count' => 0,
                'failed_count' => count($request->modules),
                'can_partial_save' => false
            ], 400);
        }
        
        // Start transaction
        DB::beginTransaction();
        
        try {
            $slotIndex = 0;
            $failedExams = [];
            
            foreach ($request->modules as $moduleData) {
                $module = Module::with('teacher')->find($moduleData['id']);
                $moduleName = $module ? ($module->module_name ?? 'Module ' . $module->id) : 'Unknown Module';
                
                // Find suitable time slot with available room and teachers
                $bestSlot = $this->findBestTimeSlotWithConflicts(
                    $availableDates,
                    $timeSlots,
                    $moduleData,
                    $group,
                    $slotIndex,
                    $detailedConflicts
                );
                
                if (!$bestSlot['success']) {
                    $failedExams[] = [
                        'module_id' => $moduleData['id'],
                        'module_name' => $moduleName,
                        'duration' => $moduleData['duration']
                    ];
                    continue;
                }
                
                // Create the exam
                $exam = Exam::create([
                    'exam_type' => $request->exam_type,
                    'exam_date' => $bestSlot['date'],
                    'exam_time' => $bestSlot['start_time'],
                    'duration' => $moduleData['duration'],
                    'end_time' => $bestSlot['end_time'],
                    'group_id' => $group->id,
                    'module_id' => $moduleData['id'],
                    'session_name' => $sessionName,
                    'is_batch_created' => true,
                ]);
                
                // Assign room
                if ($bestSlot['room']) {
                    $exam->rooms()->attach($bestSlot['room']->id);
                }
                
                // Assign teachers (exactly 2 per exam)
                foreach ($bestSlot['teachers'] as $teacher) {
                    $exam->invigilators()->attach($teacher->id);
                }
                
                // Auto-assign additional teachers if needed (should already have 2)
                $invigilationService = new InvigilationService();
                $invigilationService->autoAssignInvigilators([$exam->id]);
                
                $createdExams->push($exam->load(['module', 'rooms', 'invigilators']));
                $slotIndex++;
            }
            
            // Check if we successfully scheduled all exams
            if ($createdExams->count() !== count($request->modules)) {
                DB::rollBack();
                
                $failedCount = count($request->modules) - $createdExams->count();
                
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to schedule exams: Only ' . $createdExams->count() . ' of ' . count($request->modules) . ' exams could be scheduled due to conflicts.',
                    'conflicts' => $detailedConflicts,
                    'scheduled_count' => $createdExams->count(),
                    'failed_count' => $failedCount,
                    'failed_exams' => $failedExams,
                    'can_partial_save' => false,
                    'available_dates' => $availableDates,
                    'time_slots' => $timeSlots
                ], 400);
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => count($createdExams) . ' exams scheduled successfully',
                'exams' => $createdExams->map(function($exam) {
                    return [
                        'id' => $exam->id,
                        'exam_date' => $exam->exam_date,
                        'exam_time' => $exam->exam_time,
                        'end_time' => $exam->end_time,
                        'duration' => $exam->duration,
                        'exam_type' => $exam->exam_type,
                        'module_name' => $exam->module ? $exam->module->module_name : 'Unknown',
                        'group_name' => $exam->group ? $exam->group->name : 'Unknown',
                        'room_name' => $exam->rooms->isNotEmpty() ? $exam->rooms->first()->name : 'No Room',
                        'teachers' => $exam->invigilators->map(function($teacher) {
                            return $teacher->full_name ?? $teacher->first_name . ' ' . $teacher->last_name;
                        })->join(', '),
                    ];
                }),
                'conflicts' => [],
                'scheduled_count' => $createdExams->count(),
                'failed_count' => 0
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to schedule exams: ' . $e->getMessage(),
                'conflicts' => $detailedConflicts,
                'scheduled_count' => 0,
                'failed_count' => count($request->modules),
                'can_partial_save' => false
            ], 400);
        }
    }
    
    private function findBestTimeSlotWithConflicts($availableDates, $timeSlots, $moduleData, $group, &$slotIndex, &$conflicts)
{
    $module = Module::with('teacher')->find($moduleData['id']);
    $duration = $moduleData['duration'];
    $moduleName = $module->module_name ?? 'Module ' . $module->id;
    $moduleTeacher = $module->teacher;
    
    // Store detailed conflicts for this module
    $moduleConflicts = [
        'module_name' => $moduleName,
        'module_id' => $moduleData['id'],
        'duration' => $duration,
        'teacher_name' => $moduleTeacher ? $moduleTeacher->first_name . ' ' . $moduleTeacher->last_name : 'No Teacher Assigned',
        'conflicts' => []
    ];
    
    // Try each date and time slot
    for ($i = $slotIndex; $i < count($availableDates) * count($timeSlots); $i++) {
        $dateIndex = floor($i / count($timeSlots));
        $timeIndex = $i % count($timeSlots);
        
        $date = $availableDates[$dateIndex];
        $timeSlot = $timeSlots[$timeIndex];
        $startTime = $timeSlot[0];
        $endTime = Carbon::parse($startTime)->addMinutes($duration)->format('H:i');
        
        // Check if end time exceeds slot end time
        if (Carbon::parse($endTime)->greaterThan(Carbon::parse($timeSlot[1]))) {
            $moduleConflicts['conflicts'][] = [
                'type' => 'time_slot',
                'type_label' => $this->getConflictTypeLabel('time_slot'),
                'date' => $date,
                'time' => $startTime,
                'message' => "Duration ({$duration}min) exceeds available time slot ({$timeSlot[0]} - {$timeSlot[1]})"
            ];
            continue;
        }
        
        // 1. Check group availability
        $groupAvailability = ExamConflictService::checkGroupAvailability(
            $group->id, 
            $date, 
            $startTime, 
            $duration
        );
        
        if (!$groupAvailability['available']) {
            $moduleConflicts['conflicts'][] = [
                'type' => 'group_conflict',
                'type_label' => $this->getConflictTypeLabel('group_conflict'),
                'date' => $date,
                'time' => $startTime,
                'message' => "Group already has an exam scheduled at this time",
                'existing_exams' => $groupAvailability['conflicts']->map(function($exam) {
                    return [
                        'module' => $exam->module->module_name ?? 'Unknown',
                        'time' => $exam->exam_time . ' - ' . $exam->end_time
                    ];
                })->toArray()
            ];
            continue;
        }
        
        // 2. Find available room
        $availableRooms = ExamConflictService::getAvailableRooms(
            $date, 
            $startTime, 
            $duration,
            $group->students_count ?? 30
        );
        
        if ($availableRooms->isEmpty()) {
            $moduleConflicts['conflicts'][] = [
                'type' => 'room_unavailable',
                'type_label' => $this->getConflictTypeLabel('room_unavailable'),
                'date' => $date,
                'time' => $startTime,
                'message' => "No available rooms with sufficient capacity at this time"
            ];
            continue;
        }
        
        $selectedRoom = $availableRooms->first();
        
        // 3. Find available teachers (exactly 2 per exam)
        $excludeTeacherIds = [];
        
        $availableTeachers = ExamConflictService::getAvailableTeachers(
            $date, 
            $startTime, 
            $duration, 
            $excludeTeacherIds
        );
        
        // Try to include module teacher if available
        $selectedTeachers = collect();
        $moduleTeacherConflict = null;
        
        if ($module->teacher_id && $moduleTeacher) {
            $teacherAvailability = ExamConflictService::checkTeacherAvailability(
                $moduleTeacher->id,
                $date,
                $startTime,
                $duration
            );
            
            if (!$teacherAvailability['available']) {
                $moduleTeacherConflict = [
                    'type' => 'teacher_unavailable',
                    'type_label' => $this->getConflictTypeLabel('teacher_unavailable'),
                    'date' => $date,
                    'time' => $startTime,
                    'message' => "Module teacher ({$moduleTeacher->first_name} {$moduleTeacher->last_name}) is not available at this time",
                    'existing_assignments' => $teacherAvailability['conflicts']->map(function($exam) {
                        return [
                            'module' => $exam->module->module_name ?? 'Unknown',
                            'time' => $exam->exam_time . ' - ' . $exam->end_time
                        ];
                    })->toArray()
                ];
            } else {
                $selectedTeachers->push($moduleTeacher);
            }
        }
        
        // Add additional teachers to reach exactly 2
        $neededTeachers = 2;
        $additionalTeachers = $availableTeachers
            ->whereNotIn('id', $selectedTeachers->pluck('id')->toArray())
            ->take($neededTeachers - $selectedTeachers->count());
        
        $selectedTeachers = $selectedTeachers->merge($additionalTeachers);
        
        if ($selectedTeachers->count() < $neededTeachers) {
            // If we already have a teacher conflict, add it
            if ($moduleTeacherConflict) {
                $moduleConflicts['conflicts'][] = $moduleTeacherConflict;
            }
            
            $availableCount = $selectedTeachers->count();
            $moduleConflicts['conflicts'][] = [
                'type' => 'insufficient_teachers',
                'type_label' => $this->getConflictTypeLabel('insufficient_teachers'),
                'date' => $date,
                'time' => $startTime,
                'message' => "Only {$availableCount} teachers available (need {$neededTeachers})"
            ];
            continue;
        }
        
        // If we had a module teacher conflict but still found other teachers, record it
        if ($moduleTeacherConflict && $selectedTeachers->count() >= $neededTeachers) {
            $moduleConflicts['conflicts'][] = $moduleTeacherConflict;
            continue;
        }
        
        // Update slot index for next exam
        $slotIndex = $i + 1;
        
        return [
            'success' => true,
            'date' => $date,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'room' => $selectedRoom,
            'teachers' => $selectedTeachers
        ];
    }
    
    // After the for loop, if no slot was found:
    if (empty($moduleConflicts['conflicts'])) {
        // Add a generic conflict if none were recorded
        $moduleConflicts['conflicts'] = [[
            'type' => 'no_suitable_slot',
            'type_label' => $this->getConflictTypeLabel('no_suitable_slot'),
            'date' => '',
            'time' => '',
            'message' => 'No suitable time slot found within the selected date range. Try extending the date range or reducing exam durations.'
        ]];
    }
    
    // Store the module conflicts in the main conflicts array
    $conflicts[$moduleData['id']] = $moduleConflicts;
    
    return [
        'success' => false,
        'conflicts' => $moduleConflicts['conflicts']
    ];
}
    
    public function showCalendar(Group $group)
    {
        $exams = Exam::where('group_id', $group->id)
            ->with(['module', 'rooms', 'invigilators'])
            ->latest()
            ->get();

        $planning = $exams->map(function ($exam) {
            return [
                'id' => $exam->id,
                'exam_date' => $exam->exam_date,
                'exam_time' => $exam->exam_time,
                'end_time' => $exam->end_time,
                'duration' => $exam->duration,
                'exam_type' => $exam->exam_type,
                'module_name' => $exam->module ? $exam->module->module_name : ($exam->module?->name ?? 'Unknown'),
                'group_name' => $exam->group ? $exam->group->name : 'Unknown',
                'room_name' => $exam->rooms->isNotEmpty() ? $exam->rooms->first()->name : 'No Room',
                'rooms_list' => $exam->rooms->pluck('name')->toArray(),
                'teachers' => $exam->invigilators->map(function($teacher) {
                    return $teacher->full_name ?? $teacher->first_name . ' ' . $teacher->last_name;
                })->join(', '),
                'teachers_list' => $exam->invigilators->map(function($teacher) {
                    return $teacher->full_name ?? $teacher->first_name . ' ' . $teacher->last_name;
                })->toArray(),
            ];
        });

        return Inertia::render('Responsable/PlanningCalendar', [
            'planning' => $planning,
            'group' => $group,
        ]);
    }

   private function getConflictTypeLabel($type)
{
    $labels = [
        'time_slot' => 'Time Slot Issue',
        'group_conflict' => 'Group Conflict',
        'room_unavailable' => 'Room Unavailable',
        'teacher_unavailable' => 'Teacher Unavailable',
        'insufficient_teachers' => 'Insufficient Teachers',
        'no_suitable_slot' => 'No Suitable Time Slot',
    ];
    
    return $labels[$type] ?? $type;
}
}