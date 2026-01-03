<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Module;
use App\Models\Group;
use App\Models\Room;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Services\ExamConflictService;
use Illuminate\Support\Facades\DB;
use App\Notifications\ExamCreatedNotification;
use App\Models\User;

class ExamController extends Controller
{
    public function index()
    {
        try {
            Log::info('=== START EXAM INDEX DEBUG ===');
            
            // First, let's check what's in the database
            $examCount = Exam::count();
            Log::info("Total exams in exams table: {$examCount}");
            
            if ($examCount === 0) {
                Log::warning('No exams found in database');
                return inertia('Responsable/Exams/Index', [
                    'exams' => [],
                    'stats' => ['total' => 0, 'upcoming' => 0, 'today' => 0, 'past' => 0],
                    'error' => 'No exams found in database. Create your first exam.'
                ]);
            }
            
            // Let's see the raw exam data first
            $rawExams = Exam::all();
            Log::info("Raw exam data:");
            foreach ($rawExams as $exam) {
                Log::info("Exam ID: {$exam->id}, Module ID: {$exam->module_id}, Group ID: {$exam->group_id}, Date: {$exam->exam_date}, Type: {$exam->exam_type}");
            }
            
            // Check exam_teachers pivot table
            $pivotCount = DB::table('exam_teachers')->count();
            Log::info("Records in exam_teachers pivot table: {$pivotCount}");
            
            // Now load with relationships
            $exams = Exam::with([
                'module',
                'group.level',
                'group.speciality',
                'group.semester',
                'group.cycle',
                'rooms',
                'invigilators'  // This uses exam_teachers table
            ])->get();
            
            Log::info("Loaded {$exams->count()} exams with relationships");
            
            // Debug first exam's relationships
            $firstExam = $exams->first();
            if ($firstExam) {
                Log::info("First exam ID: {$firstExam->id}");
                Log::info("Module: " . ($firstExam->module ? $firstExam->module->name : 'NULL'));
                Log::info("Group: " . ($firstExam->group ? $firstExam->group->name : 'NULL'));
                Log::info("Rooms count: " . $firstExam->rooms->count());
                Log::info("Invigilators count: " . $firstExam->invigilators->count());
                
                // Check exam_teachers for this exam
                $pivotTeachers = DB::table('exam_teachers')->where('exam_id', $firstExam->id)->get();
                Log::info("Pivot table entries for exam {$firstExam->id}: " . $pivotTeachers->count());
            }
            
            $today = Carbon::today();
            
            $formattedExams = $exams->map(function ($exam) use ($today) {
                try {
                    $examDate = Carbon::parse($exam->exam_date);
                    
                    return [
                        'id' => $exam->id,
                        'module_id' => $exam->module_id,
                        'module_name' => $exam->module?->module_name ?? $exam->module?->name ?? 'Unknown Module',
                        'group_id' => $exam->group_id,
                        'group_name' => $exam->group?->name ?? 'Unknown Group',
                        'exam_date' => $exam->exam_date,
                        'formatted_date' => $examDate->format('D, M d, Y'),
                        'exam_time' => $exam->exam_time,
                        'end_time' => $exam->end_time,
                        'time_range' => $exam->exam_time 
                            ? Carbon::parse($exam->exam_time)->format('H:i') . ' - ' . 
                              Carbon::parse($exam->end_time)->format('H:i') 
                            : 'N/A',
                        'duration' => $exam->duration,
                        'exam_type' => $exam->exam_type,
                        'rooms' => $exam->rooms->map(function ($room) {
                            return [
                                'id' => $room->id,
                                'name' => $room->room_name,
                                'type' => $room->room_type,
                                'capacity' => $room->capacity,
                                'availability' => $room->availability,
                            ];
                        })->toArray(),
                        'total_rooms' => $exam->rooms->count(),
                        'teachers' => $exam->invigilators->map(function ($teacher) {
                            return [
                                'id' => $teacher->id,
                                'name' => $teacher->first_name . ' ' . $teacher->last_name,
                                'email' => $teacher->email,
                            ];
                        })->toArray(),
                        'total_invigilators' => $exam->invigilators->count(),
                        'is_upcoming' => $examDate->isFuture(),
                        'is_past' => $examDate->isPast(),
                        'is_today' => $examDate->isSameDay($today),
                        'system' => $exam->group?->cycle?->name ?? 'N/A',
                        'level' => $exam->group?->level?->name ?? 'N/A',
                        'speciality' => $exam->group?->speciality?->name ?? 'N/A',
                        'semester' => $exam->group?->semester?->name ?? 'N/A',
                    ];
                } catch (\Exception $e) {
                    Log::error("Error formatting exam ID {$exam->id}: " . $e->getMessage());
                    return null;
                }
            })->filter()->values();
            
            // Calculate stats
            $stats = [
                'total' => $formattedExams->count(),
                'upcoming' => $formattedExams->where('is_upcoming', true)->count(),
                'today' => $formattedExams->where('is_today', true)->count(),
                'past' => $formattedExams->where('is_past', true)->count(),
            ];
            
            Log::info("Formatted exams: " . $formattedExams->count());
            Log::info("Stats: " . json_encode($stats));
            Log::info('=== END EXAM INDEX DEBUG ===');
            
            return inertia('Responsable/Exams/Index', [
                'exams' => $formattedExams->toArray(),
                'stats' => $stats,
            ]);
            
        } catch (\Exception $e) {
            Log::error('CRITICAL ERROR in ExamController@index: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return inertia('Responsable/Exams/Index', [
                'exams' => [],
                'stats' => ['total' => 0, 'upcoming' => 0, 'today' => 0, 'past' => 0],
                'error' => 'Error loading exams: ' . $e->getMessage()
            ]);
        }
    }

    public function create()
    {
        $modules = Module::with(['teacher', 'group'])->get();
        $groups = Group::with(['level', 'speciality'])->get();
        $teachers = Teacher::all();
        $rooms = Room::where('availability', true)->get();
        $examTypes = ['Final', 'Midterm', 'Quiz', 'Practical', 'Oral'];

        return Inertia::render('Responsable/Exams/Create', [
            'modules' => $modules,
            'groups' => $groups,
            'teachers' => $teachers,
            'rooms' => $rooms,
            'examTypes' => $examTypes,
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'module_id' => 'required|exists:modules,id',
        'group_id' => 'required|exists:groups,id',
        'exam_date' => 'required|date',
        'exam_time' => 'required|date_format:H:i',
        'duration' => 'required|integer|min:30|max:240',
        'exam_type' => 'required|string',
        'room_ids' => 'required|array|min:1',
        'room_ids.*' => 'exists:rooms,id',
        'teacher_ids' => 'required|array|min:1',
        'teacher_ids.*' => 'exists:teachers,id',
    ]);

    $exam = Exam::create([
        'module_id' => $request->module_id,
        'group_id' => $request->group_id,
        'exam_date' => $request->exam_date,
        'exam_time' => $request->exam_time,
        'duration' => $request->duration,
        'exam_type' => $request->exam_type,
        'conflict_warnings' => !empty($conflictWarnings) ? implode('; ', $conflictWarnings) : null,
        'has_conflicts' => !empty($conflictWarnings),
        'status' => 'pending_approval', // New status
        'created_by' => auth()->id(), // Set the creator
    ]);

    // Attach rooms and teachers
    $exam->rooms()->attach($request->room_ids);
    $exam->invigilators()->attach($request->teacher_ids);

    // Notify head department
    $headDepartments = User::where('role', 'headdepartment')->get();
    foreach ($headDepartments as $headDepartment) {
       $headDepartment->notify(new ExamCreatedNotification($exam));
    }

    Log::info('Creating new exam with data:', $request->all());

    $conflictWarnings = [];
    
    // Check room conflicts (rooms cannot be shared)
    foreach ($request->room_ids as $roomId) {
        $roomCheck = ExamConflictService::checkRoomAvailability(
            $roomId,
            $request->exam_date,
            $request->exam_time,
            $request->duration
        );
        
        if (!$roomCheck['available']) {
            $room = Room::find($roomId);
            $conflictWarnings[] = "Room '{$room->room_name}' is occupied";
        }
    }

    // Check teacher conflicts (teachers cannot be in two exams at same time)
    foreach ($request->teacher_ids as $teacherId) {
        $teacherCheck = ExamConflictService::checkTeacherAvailability(
            $teacherId,
            $request->exam_date,
            $request->exam_time,
            $request->duration
        );
        
        if (!$teacherCheck['available']) {
            $teacher = Teacher::find($teacherId);
            $conflictWarnings[] = "Teacher '{$teacher->first_name} {$teacher->last_name}' has another assignment";
        }
    }

    // REMOVED: Group conflict check - groups can have exams at same time
    // if (!$groupCheck['available']) {
    //     $conflictWarnings[] = "Group has another exam at the same time";
    // }

    // Create the exam
    $exam = Exam::create([
        'module_id' => $request->module_id,
        'group_id' => $request->group_id,
        'exam_date' => $request->exam_date,
        'exam_time' => $request->exam_time,
        'duration' => $request->duration,
        'exam_type' => $request->exam_type,
        'conflict_warnings' => !empty($conflictWarnings) ? implode('; ', $conflictWarnings) : null,
        'has_conflicts' => !empty($conflictWarnings),
    ]);

    Log::info("Created exam ID: {$exam->id}");

    // Attach rooms and teachers (uses exam_teachers table)
    $exam->rooms()->attach($request->room_ids);
    $exam->invigilators()->attach($request->teacher_ids);

    Log::info("Attached " . count($request->room_ids) . " rooms and " . count($request->teacher_ids) . " teachers to exam {$exam->id}");

    // If conflicts exist, return with warning
    if (!empty($conflictWarnings)) {
        return redirect()->route('exams.create')
            ->with('warning', 'Exam created with conflicts: ' . implode(', ', $conflictWarnings))
            ->with('exam', $exam);
    }

    return redirect()->route('exams.create')
        ->with('success', 'Exam created successfully.')
        ->with('exam', $exam);
        
}
    public function checkAvailability(Request $request)
{
    try {
        $validated = $request->validate([
            'exam_date' => 'required|date',
            'exam_time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:30|max:300',
            'group_id' => 'required|exists:groups,id',
            'room_ids' => 'nullable|array',
            'room_ids.*' => 'exists:rooms,id',
            'teacher_ids' => 'nullable|array',
            'teacher_ids.*' => 'exists:teachers,id',
        ]);

        // Get all necessary data for the view
        $modules = Module::with(['teacher', 'group'])->get();
        $groups = Group::with(['level', 'speciality'])->get();
        $teachers = Teacher::all();
        $rooms = Room::where('availability', true)->get();
        $examTypes = ['Continuous assessment', 'Final exam', 'Make-up exam', 'Replacement exam', 'Practical test'];

        $conflicts = [
            'room_conflicts' => [],
            'teacher_conflicts' => [],
            'resource_conflicts' => [], // New: for insufficient resources
            'available_rooms' => [],
            'available_teachers' => [],
            'conflict_details' => [],
            'summary_conflicts' => []
        ];

        // REMOVED: Group conflict check - groups can have exams at same time
        // if (!$groupCheck['available']) { ... }

        // Check room availability (rooms cannot be shared at same time)
        foreach ($validated['room_ids'] ?? [] as $roomId) {
            $roomCheck = ExamConflictService::checkRoomAvailability(
                $roomId,
                $validated['exam_date'],
                $validated['exam_time'],
                $validated['duration']
            );
            
            if (!$roomCheck['available']) {
                $room = Room::find($roomId);
                $conflicts['room_conflicts'][$roomId] = [
                    'message' => "Room '{$room->room_name}' is occupied during this time",
                    'room_name' => $room->room_name,
                    'existing_exams' => $roomCheck['conflicts']->map(function($exam) {
                        return [
                            'module' => $exam->module?->name ?? 'Unknown',
                            'group' => $exam->group?->name ?? 'Unknown Group',
                            'time' => $exam->exam_time,
                            'date' => $exam->exam_date
                        ];
                    })->toArray()
                ];
                
                $conflicts['conflict_details'][] = [
                    'type' => 'room_conflict',
                    'type_label' => 'Room Conflict',
                    'message' => "Room '{$room->room_name}' is occupied",
                    'room_name' => $room->room_name,
                    'existing_exams' => $roomCheck['conflicts']->map(function($exam) {
                        return [
                            'module' => $exam->module?->name ?? 'Unknown',
                            'group' => $exam->group?->name ?? 'Unknown Group',
                            'time' => $exam->exam_time
                        ];
                    })->toArray(),
                    'date' => $validated['exam_date'],
                    'time' => $validated['exam_time']
                ];
            }
        }

        // Check teacher availability (teachers cannot be in two exams at same time)
        foreach ($validated['teacher_ids'] ?? [] as $teacherId) {
            $teacherCheck = ExamConflictService::checkTeacherAvailability(
                $teacherId,
                $validated['exam_date'],
                $validated['exam_time'],
                $validated['duration']
            );
            
            if (!$teacherCheck['available']) {
                $teacher = Teacher::find($teacherId);
                $conflicts['teacher_conflicts'][$teacherId] = [
                    'message' => "Teacher '{$teacher->first_name} {$teacher->last_name}' has another assignment",
                    'teacher_name' => $teacher->first_name . ' ' . $teacher->last_name,
                    'existing_assignments' => $teacherCheck['conflicts']->map(function($exam) {
                        return [
                            'module' => $exam->module?->name ?? 'Unknown',
                            'group' => $exam->group?->name ?? 'Unknown Group',
                            'time' => $exam->exam_time,
                            'date' => $exam->exam_date
                        ];
                    })->toArray()
                ];
                
                $conflicts['conflict_details'][] = [
                    'type' => 'teacher_conflict',
                    'type_label' => 'Teacher Conflict',
                    'message' => "Teacher '{$teacher->first_name} {$teacher->last_name}' is busy",
                    'teacher_name' => $teacher->first_name . ' ' . $teacher->last_name,
                    'existing_assignments' => $teacherCheck['conflicts']->map(function($exam) {
                        return [
                            'module' => $exam->module?->name ?? 'Unknown',
                            'group' => $exam->group?->name ?? 'Unknown Group',
                            'time' => $exam->exam_time
                        ];
                    })->toArray(),
                    'date' => $validated['exam_date'],
                    'time' => $validated['exam_time']
                ];
            }
        }

        // Check if enough resources are available overall
        $requiredRooms = count($validated['room_ids'] ?? []) > 0 ? count($validated['room_ids']) : 1;
        $requiredTeachers = count($validated['teacher_ids'] ?? []) > 0 ? count($validated['teacher_ids']) : 2;
        
        $resourceCheck = ExamConflictService::checkResourcesAvailability(
            $validated['exam_date'],
            $validated['exam_time'],
            $validated['duration'],
            $requiredRooms,
            $requiredTeachers
        );
        
        if (!$resourceCheck['rooms_available']) {
            $conflicts['resource_conflicts'][] = [
                'type' => 'insufficient_rooms',
                'message' => "Only {$resourceCheck['available_rooms_count']} room(s) available, but {$requiredRooms} needed"
            ];
            
            $conflicts['conflict_details'][] = [
                'type' => 'resource_conflict',
                'type_label' => 'Insufficient Resources',
                'message' => "Not enough available rooms. {$resourceCheck['available_rooms_count']} available, {$requiredRooms} needed.",
                'date' => $validated['exam_date'],
                'time' => $validated['exam_time']
            ];
        }
        
        if (!$resourceCheck['teachers_available']) {
            $conflicts['resource_conflicts'][] = [
                'type' => 'insufficient_teachers',
                'message' => "Only {$resourceCheck['available_teachers_count']} teacher(s) available, but {$requiredTeachers} needed"
            ];
            
            $conflicts['conflict_details'][] = [
                'type' => 'resource_conflict',
                'type_label' => 'Insufficient Resources',
                'message' => "Not enough available invigilators. {$resourceCheck['available_teachers_count']} available, {$requiredTeachers} needed.",
                'date' => $validated['exam_date'],
                'time' => $validated['exam_time']
            ];
        }

        // Get available rooms and teachers for suggestions
        $conflicts['available_rooms'] = $resourceCheck['available_rooms']->toArray();
        $conflicts['available_teachers'] = $resourceCheck['available_teachers']->toArray();

        // Return the view with all data
        return inertia('Responsable/Exams/Create', [
            'modules' => $modules,
            'groups' => $groups,
            'teachers' => $teachers,
            'rooms' => $rooms,
            'examTypes' => $examTypes,
            'availabilityResult' => $conflicts
        ]);
        
    } catch (\Exception $e) {
        Log::error('Error in checkAvailability: ' . $e->getMessage());
        
        // Return with error
        return inertia('Responsable/Exams/Create', [
            'modules' => Module::with(['teacher', 'group'])->get(),
            'groups' => Group::with(['level', 'speciality'])->get(),
            'teachers' => Teacher::all(),
            'rooms' => Room::where('availability', true)->get(),
            'examTypes' => ['Continuous assessment', 'Final exam', 'Make-up exam', 'Replacement exam', 'Practical test'],
            'availabilityResult' => [
                'room_conflicts' => [],
                'teacher_conflicts' => [],
                'resource_conflicts' => [],
                'conflict_details' => [[
                    'type' => 'error',
                    'type_label' => 'Error',
                    'message' => 'Error checking availability: ' . $e->getMessage()
                ]]
            ]
        ]);
    }
}

   public function suggestRooms(Request $request)
{
    try {
        $request->validate([
            'exam_date' => 'required|date',
            'exam_time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:30',
            'group_id' => 'required|exists:groups,id',
            'student_count' => 'nullable|integer',
        ]);

        // Get group to estimate capacity needed
        $group = Group::find($request->group_id);
        $capacity = $request->student_count ?? $group->student_count ?? 30;

        // Get available rooms using ExamConflictService
        $availableRooms = ExamConflictService::getAvailableRooms(
            $request->exam_date,
            $request->exam_time,
            $request->duration,
            $capacity // Pass capacity to filter rooms
        );

        // Sort by capacity (closest to needed capacity first)
        $availableRooms = $availableRooms->sortBy(function($room) use ($capacity) {
            return abs($room->capacity - $capacity);
        });

        // Also get rooms that are big enough if no exact matches
        $bigEnoughRooms = $availableRooms->filter(function($room) use ($capacity) {
            return $room->capacity >= $capacity;
        });

        // Combine results - big enough rooms first, then others
        $suggestedRooms = $bigEnoughRooms->merge(
            $availableRooms->whereNotIn('id', $bigEnoughRooms->pluck('id'))
        );

        return inertia('Responsable/Exams/Create', [
            'suggestedRooms' => $suggestedRooms->take(5)->values()
        ]);
        
    } catch (\Exception $e) {
        Log::error('Error in suggestRooms: ' . $e->getMessage());
        return inertia('Responsable/Exams/Create', [
            'suggestedRooms' => []
        ]);
    }
}

public function suggestTeachers(Request $request)
{
    try {
        $request->validate([
            'exam_date' => 'required|date',
            'exam_time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:30',
            'group_id' => 'required|exists:groups,id',
            'module_id' => 'nullable|exists:modules,id',
            'exclude_teacher_ids' => 'nullable|array',
        ]);

        // Get available teachers excluding already selected ones
        $excludeTeacherIds = $request->exclude_teacher_ids ?? [];
        $availableTeachers = ExamConflictService::getAvailableTeachers(
            $request->exam_date,
            $request->exam_time,
            $request->duration,
            $excludeTeacherIds
        );

        $suggestedTeachers = collect();

        // First priority: module teacher if available
        if ($request->module_id) {
            $module = Module::find($request->module_id);
            if ($module && $module->teacher_id) {
                $moduleTeacher = $availableTeachers->firstWhere('id', $module->teacher_id);
                if ($moduleTeacher) {
                    $suggestedTeachers->push($moduleTeacher);
                }
            }
        }

        // Second priority: teachers who are responsables
        $responsableTeachers = $availableTeachers->where('is_responsable', true)
            ->whereNotIn('id', $suggestedTeachers->pluck('id'))
            ->take(2 - $suggestedTeachers->count());

        $suggestedTeachers = $suggestedTeachers->merge($responsableTeachers);

        // Third priority: other available teachers
        if ($suggestedTeachers->count() < 2) {
            $otherTeachers = $availableTeachers
                ->whereNotIn('id', $suggestedTeachers->pluck('id'))
                ->take(2 - $suggestedTeachers->count());
            
            $suggestedTeachers = $suggestedTeachers->merge($otherTeachers);
        }

        return inertia('Responsable/Exams/Create', [
            'suggestedTeachers' => $suggestedTeachers->take(2)->values()
        ]);
        
    } catch (\Exception $e) {
        Log::error('Error in suggestTeachers: ' . $e->getMessage());
        return inertia('Responsable/Exams/Create', [
            'suggestedTeachers' => []
        ]);
    }
}
public function show(Exam $exam)
{
    $exam->load(['module.teacher', 'group.level', 'group.speciality', 'rooms', 'invigilators', 'invigilationSchedules.teacher']);
    
    return Inertia::render('Responsable/Exams/Show', [
        'exam' => $exam,
        'modules' => Module::with(['teacher', 'group'])->get(),
        'groups' => Group::with(['level', 'speciality'])->get(),
        'teachers' => Teacher::all(),
        'rooms' => Room::where('availability', true)->get(),
        'examTypes' => [
            'Continuous assessment', 
            'Final exam', 
            'Make-up exam', 
            'Replacement exam',
            'Practical test'
        ]
    ]);
}

    public function edit(Exam $exam)
    {
        $exam->load(['module.teacher', 'group.level', 'group.speciality', 'rooms', 'invigilators']);
        
        return Inertia::render('Responsable/Exams/Edit', [
            'exam' => $exam,
            'modules' => Module::with(['teacher', 'group'])->get(),
            'groups' => Group::with(['level', 'speciality'])->get(),
            'teachers' => Teacher::all(),
            'rooms' => Room::where('availability', true)->get(),
            'examTypes' => ['Final', 'Midterm', 'Quiz', 'Practical', 'Oral']
        ]);
    }

    public function update(Request $request, Exam $exam)
    {
        $request->validate([
            'module_id' => 'required|exists:modules,id',
            'group_id' => 'required|exists:groups,id',
            'exam_date' => 'required|date',
            'exam_time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:30|max:240',
            'exam_type' => 'required|string',
            'room_ids' => 'required|array|min:1',
            'room_ids.*' => 'exists:rooms,id',
            'teacher_ids' => 'required|array|min:1',
            'teacher_ids.*' => 'exists:teachers,id',
        ]);

        // Update exam
        $exam->update([
            'module_id' => $request->module_id,
            'group_id' => $request->group_id,
            'exam_date' => $request->exam_date,
            'exam_time' => $request->exam_time,
            'duration' => $request->duration,
            'exam_type' => $request->exam_type,
        ]);

        // Sync rooms and teachers
        $exam->rooms()->sync($request->room_ids);
        $exam->invigilators()->sync($request->teacher_ids);

        return redirect()->route('exams.show', $exam->id)
            ->with('success', 'Exam updated successfully.');
    }

    public function destroy(Exam $exam)
    {
        $exam->rooms()->detach();
        $exam->invigilators()->detach();
        $exam->delete();

        return redirect()->route('exams.index')
            ->with('success', 'Exam deleted successfully.');
    }
    

    
}