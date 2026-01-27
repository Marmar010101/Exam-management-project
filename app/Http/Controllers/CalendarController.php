<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Exam;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index()
    {
        $groups = Group::with(['level', 'speciality', 'semester'])
            ->orderBy('name')
            ->get();

        $examsByGroup = [];
        foreach ($groups as $group) {
            $exams = Exam::where('group_id', $group->id)
                ->with(['module:id,module_name'])
                ->orderBy('exam_date_old')
                ->orderBy('exam_time_old')
                ->get()
                ->map(function($exam) {
                    $roomName = 'No Room';
                    
                    $examTime = $exam->exam_time_old;
                    if ($examTime) {
                        try {
                            $examTime = Carbon::parse($examTime)->format('H:i');
                        } catch (\Exception $e) {
                            $examTime = '08:00';
                        }
                    } else {
                        $examTime = '08:00';
                    }

                    return [
                        'id' => $exam->id,
                        'exam_date' => $exam->exam_date_old,
                        'exam_time' => $examTime,
                        'exam_type' => $exam->exam_type,
                        'module_id' => $exam->module_id,
                        'module_name' => $exam->module->module_name ?? 'Unknown Module',
                        'room_name' => $roomName,
                    ];
                })->toArray();

            $examsByGroup[$group['id']] = $exams;
        }

        return Inertia::render('Responsable/Calendars', [
            'groups' => $groups,
            'examsByGroup' => $examsByGroup,
        ]);
    }

    public function showPlanning($groupId)
    {
        $group = Group::with(['level', 'speciality', 'semester'])->findOrFail($groupId);
        
        $planning = Exam::where('group_id', $groupId)
            ->with([
                'module:id,module_name',
                'rooms:id,room_name',
                'invigilators:id,first_name,last_name'
            ])
            ->orderBy('exam_date')
            ->orderBy('exam_time')
            ->get()
            ->map(function($exam) {
                $roomName = 'No Room';
                if ($exam->rooms && $exam->rooms->isNotEmpty()) {
                    $firstRoom = $exam->rooms->first();
                    $roomName = $firstRoom->room_name ?? 'No Room';
                }

                $examTime = $exam->exam_time;
                if ($examTime) {
                    try {
                        $examTime = Carbon::parse($examTime)->format('H:i');
                    } catch (\Exception $e) {
                        $examTime = '08:00';
                    }
                } else {
                    $examTime = '08:00';
                }

                return [
                    'id' => $exam->id,
                    'exam_date' => $exam->exam_date,
                    'exam_time' => $examTime,
                    'end_time' => $exam->end_time,
                    'duration' => $exam->duration,
                    'exam_type' => $exam->exam_type,
                    'module_id' => $exam->module_id,
                    'module_name' => $exam->module->module_name ?? 'Unknown Module',
                    'room_name' => $roomName,
                    'teachers' => $exam->invigilators->isNotEmpty()
                        ? $exam->invigilators->map(fn($t) => $t->first_name . ' ' . $t->last_name)->join(', ')
                        : 'No Teachers',
                    'group_id' => $exam->group_id,
                ];
            });

        return Inertia::render('Responsable/PlanningCalendar', [
            'planning' => $planning,
            'group' => [
                'id' => $group->id,
                'name' => $group->name,
                'level' => $group->level->name ?? null,
                'speciality' => $group->speciality->name ?? null,
                'semester' => $group->semester->name ?? null,
                'student_count' => $group->students()->count(),
            ]
        ]);
    }

    public function exportPdf(Request $request)
    {
        try {
            // Get all exams for PDF export
            $exams = Exam::with(['group', 'module', 'rooms', 'invigilationSchedules.teacher'])
                ->whereHas('group')
                ->orderBy('exam_date')
                ->orderBy('exam_time')
                ->get();

            // Use your existing blade file (check exact name)
            $pdf = PDF::loadView('pdf.group-calendar-pdf', [
                'exams' => $exams,
                'group' => null, // No specific group for all exams
                'title' => 'All Exams Schedule Report'
            ]);

            // Set paper size and orientation
            $pdf->setPaper('A4', 'landscape');
            
            // Return with proper headers - THIS IS THE KEY FIX
            return $pdf->download('all-exams-schedule-' . now()->format('Y-m-d') . '.pdf');
            
        } catch (\Exception $e) {
            Log::error('PDF Export Error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to generate PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    public function exportGroupCalendarPdf($groupId)
    {
        try {
            $group = Group::findOrFail($groupId);
            
            $exams = Exam::with(['module', 'rooms', 'invigilationSchedules.teacher'])
                ->where('group_id', $groupId)
                ->get();

            // Use your existing blade file
            $pdf = PDF::loadView('pdf.group-calendar-pdf', [
                'exams' => $exams,
                'group' => $group,
                'title' => $group->name . ' - Exam Schedule'
            ]);

            // Set paper size
            $pdf->setPaper('A4', 'portrait');
            
            // Use stream() instead of download() for debugging
            return $pdf->download('exam-schedule-' . str_replace(' ', '-', $group->name) . '-' . now()->format('Y-m-d') . '.pdf');
            
        } catch (\Exception $e) {
            Log::error('Group PDF Export Error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to generate PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getExamColor($examType)
    {
        $colors = [
            'Continuous assessment' => '#10B981',
            'Final exam' => '#3B82F6',
            'Make-up exam' => '#F59E0B',
            'Replacement exam' => '#EF4444',
            'Practical test' => '#8B5CF6',
        ];

        return $colors[$examType] ?? '#6B7280';
    }
}
