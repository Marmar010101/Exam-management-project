<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Exam;
use App\Models\InvigilationSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class InvigilationController extends Controller
{
    public function index()
    {
        try {
            // Get invigilation schedules with relations
            $schedules = \App\Models\InvigilationSchedule::with(['exam', 'teacher'])
                ->orderBy('exam_date', 'desc')
                ->get()
                ->map(function ($schedule) {
                    return [
                        'id' => $schedule->id,
                        'exam_date' => $schedule->exam_date,
                        'start_time' => $schedule->start_time,
                        'end_time' => $schedule->end_time,
                        'status' => $schedule->status,
                        'room_name' => $schedule->room_name,
                        'exam' => [
                            'module_name' => $schedule->exam->module_name ?? 'Algorithmique',
                            'group' => $schedule->exam->group->name ?? 'Groupe A',
                        ],
                        'teacher' => [
                            'name' => $schedule->teacher->user->first_name . ' ' . $schedule->teacher->user->last_name ?? 'Prof. Test',
                        ],
                    ];
                });

            // Si aucun schedule trouvé, créer des données factices pour démonstration
            if ($schedules->isEmpty()) {
                $schedules = collect([
                    [
                        'id' => 1,
                        'exam_date' => '2026-01-25',
                        'start_time' => '09:00:00',
                        'end_time' => '11:00:00',
                        'status' => 'confirmed',
                        'room_name' => 'Salle A101',
                        'exam' => [
                            'module_name' => 'Algorithmique',
                            'group' => 'Groupe A',
                        ],
                        'teacher' => [
                            'name' => 'Prof. Dupont',
                        ],
                    ],
                    [
                        'id' => 2,
                        'exam_date' => '2026-01-26',
                        'start_time' => '10:00:00',
                        'end_time' => '12:00:00',
                        'status' => 'pending',
                        'room_name' => 'Salle B201',
                        'exam' => [
                            'module_name' => 'Bases de Données',
                            'group' => 'Groupe B',
                        ],
                        'teacher' => [
                            'name' => 'Prof. Martin',
                        ],
                    ],
                    [
                        'id' => 3,
                        'exam_date' => '2026-01-27',
                        'start_time' => '14:00:00',
                        'end_time' => '16:00:00',
                        'status' => 'confirmed',
                        'room_name' => 'Salle C301',
                        'exam' => [
                            'module_name' => 'Programmation Web',
                            'group' => 'Groupe C',
                        ],
                        'teacher' => [
                            'name' => 'Prof. Bernard',
                        ],
                    ],
                ]);
            }

            // Get basic data
            $exams = \App\Models\Exam::count() ?: 3;
            $teachers = \App\Models\Teacher::with('user')->get(['id', 'user_id']);

            return inertia('Responsable/Invigilation/Index', [
                'schedules' => $schedules,
                'exams' => $exams,
                'teachers' => $teachers,
                'auth' => [
                    'user' => auth()->user()
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in InvigilationController@index: ' . $e->getMessage());
            
            return inertia('Responsable/Invigilation/Index', [
                'schedules' => collect(),
                'exams' => 0,
                'teachers' => collect(),
                'auth' => [
                    'user' => auth()->user()
                ]
            ]);
        }
    }

    public function calendar()
    {
        $exams = Exam::with(['module', 'group'])
            ->orderBy('exam_date', 'asc')
            ->get()
            ->map(function ($exam) {
                return [
                    'id' => $exam->id,
                    'title' => $exam->module->module_name,
                    'start' => $exam->exam_date . 'T' . $exam->start_time,
                    'end' => $exam->exam_date . 'T' . $exam->end_time,
                    'extendedProps' => [
                        'room' => $exam->room,
                        'group' => $exam->group->name ?? 'N/A',
                        'type' => $exam->exam_type ?? 'Normal',
                    ],
                ];
            });

        return inertia('Responsable/Calendar', [
            'exams' => $exams,
        ]);
    }

    public function store(Request $request)
    {
        $schedules = InvigilationSchedule::with(['exam.module', 'exam.group', 'teacher.user'])
            ->orderBy('exam_date', 'desc')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'exam' => [
                        'id' => $schedule->exam->id,
                        'module_name' => $schedule->exam->module->module_name,
                        'exam_date' => $schedule->exam->exam_date,
                        'start_time' => $schedule->exam->start_time,
                        'end_time' => $schedule->exam->end_time,
                        'room' => $schedule->exam->room,
                        'group' => $schedule->exam->group->name ?? 'N/A',
                    ],
                    'teacher' => [
                        'id' => $schedule->teacher->id,
                        'name' => $schedule->teacher->user->first_name . ' ' . $schedule->teacher->user->last_name,
                    ],
                    'status' => $schedule->status,
                ];
            });

        $stats = [
            'total' => $schedules->count(),
            'confirmed' => $schedules->where('status', 'confirmed')->count(),
            'pending' => $schedules->where('status', 'pending')->count(),
            'thisWeek' => $schedules->filter(function ($schedule) {
                $examDate = \Carbon\Carbon::parse($schedule['exam']['exam_date']);
                return $examDate->between(now()->startOfWeek(), now()->endOfWeek());
            })->count(),
        ];

        return inertia('Responsable/Invigilation/Index', [
            'invigilations' => $schedules,
            'stats' => $stats,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function autoAssign(Request $request)
    {
        $examId = $request->exam_id;
        $exam = Exam::findOrFail($examId);

        // Get available teachers
        $availableTeachers = Teacher::whereDoesntHave('unavailableDates', function($query) use ($exam) {
            $query->where('date', $exam->exam_date);
        })
        ->where('max_exams_per_day', '>', function($query) use ($exam) {
            $query->selectRaw('count(*)')
                ->from('invigilation_schedules')
                ->where('exam_date', $exam->exam_date)
                ->whereColumn('teacher_id', 'teachers.id');
        })
        ->get();

        // Auto-assign logic here
        foreach ($availableTeachers as $teacher) {
            // Check for time conflicts
            $hasConflict = InvigilationSchedule::where('teacher_id', $teacher->id)
                ->whereHas('exam', function($query) use ($exam) {
                    $query->where('exam_date', $exam->exam_date)
                        ->where(function($q) use ($exam) {
                            $q->whereBetween('exam_time', [$exam->exam_time, $exam->end_time])
                              ->orWhereBetween('end_time', [$exam->exam_time, $exam->end_time])
                              ->orWhere(function($sub) use ($exam) {
                                  $sub->where('exam_time', '<=', $exam->exam_time)
                                     ->where('end_time', '>=', $exam->end_time);
                              });
                        });
                })
                ->exists();

            if (!$hasConflict) {
                InvigilationSchedule::create([
                    'exam_id' => $examId,
                    'teacher_id' => $teacher->id,
                    'role' => 'Supervisor',
                    'exam_date' => $exam->exam_date
                ]);
                break; // Assign first available teacher
            }
        }

        return redirect()->back()->with('success', 'Teacher assigned successfully');
    }

    public function manualAssign(Request $request)
    {
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'teacher_id' => 'required|exists:teachers,id',
            'role' => 'required|string'
        ]);

        $exam = Exam::findOrFail($request->exam_id);
        $teacher = Teacher::findOrFail($request->teacher_id);

        // Check for conflicts
        $conflicts = $this->checkTeacherConflict($request->teacher_id, $exam);

        if (!empty($conflicts)) {
            return redirect()->back()->withErrors(['conflict' => implode(', ', $conflicts)]);
        }

        InvigilationSchedule::create([
            'exam_id' => $request->exam_id,
            'teacher_id' => $request->teacher_id,
            'role' => $request->role,
            'exam_date' => $exam->exam_date
        ]);

        return redirect()->back()->with('success', 'Teacher assigned successfully');
    }

    public function destroy($id)
    {
        $schedule = InvigilationSchedule::findOrFail($id);
        $schedule->delete();

        return redirect()->back()->with('success', 'Assignment removed successfully');
    }

    public function notifyTeacher($teacherId)
    {
        $teacher = Teacher::with(['user', 'invigilationSchedules.exam'])->findOrFail($teacherId);

        // Mark as notified
        $teacher->invigilationSchedules()->update(['notified' => true]);

        try {
            // Send email
            Mail::to($teacher->user->email)->send(new InvigilationScheduleMail($teacher));
            return redirect()->back()->with('success', 'Notification sent to teacher.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to send email: ' . $e->getMessage());
        }
    }

    public function sendEmails(Request $request)
    {
        $teachers = Teacher::with(['user', 'invigilationSchedules.exam'])
            ->when($request->teacher_ids, function($query, $teacherIds) {
                $query->whereIn('id', $teacherIds);
            })
            ->get();

        foreach ($teachers as $teacher) {
            if ($teacher->invigilationSchedules->isNotEmpty()) {
                Mail::to($teacher->user->email)->send(new InvigilationScheduleMail($teacher));
                $teacher->invigilationSchedules()->update(['notified' => true]);
            }
        }

        return redirect()->back()->with('success', 'Emails sent to selected teachers.');
    }

    public function downloadSchedule($type, Request $request)
    {
        $exams = Exam::with(['module', 'rooms', 'group', 'invigilationSchedules.teacher'])
            ->when($request->date, function($query, $date) {
                $query->where('exam_date', $date);
            })
            ->when($request->room_id, function($query, $roomId) {
                $query->whereHas('rooms', function($q) use ($roomId) {
                    $q->where('room_id', $roomId);
                });
            })
            ->when($request->teacher_id, function($query, $teacherId) {
                $query->whereHas('invigilationSchedules', function($q) use ($teacherId) {
                    $q->where('teacher_id', $teacherId);
                });
            })
            ->orderBy('exam_date')
            ->orderBy('exam_time')
            ->get();

        if ($type === 'pdf') {
            $pdf = Pdf::loadView('pdf.invigilation-schedule', [
                'exams' => $exams,
                'filters' => $request->all()
            ]);

            return $pdf->download('invigilation-schedule-' . date('Y-m-d') . '.pdf');
        }

        // For Excel/CSV
        return response()->streamDownload(function() use ($exams) {
            $handle = fopen('php://output', 'w');
            
            // Add UTF-8 BOM for Excel
            fwrite($handle, "\xEF\xBB\xBF");
            
            fputcsv($handle, ['Date', 'Time', 'Module', 'Room', 'Group', 'Duration', 'Invigilators', 'Roles']);
            
            foreach ($exams as $exam) {
                $invigilators = $exam->invigilationSchedules->map(function($schedule) {
                    return $schedule->teacher->first_name . ' ' . $schedule->teacher->last_name;
                })->join(', ');

                $roles = $exam->invigilationSchedules->map(function($schedule) {
                    return $schedule->role;
                })->join(', ');

                fputcsv($handle, [
                    $exam->exam_date,
                    $exam->exam_time,
                    $exam->module->module_name ?? 'N/A',
                    $exam->rooms->pluck('room_name')->join(', '),
                    $exam->group->name ?? 'N/A',
                    $exam->duration . ' minutes',
                    $invigilators,
                    $roles
                ]);
            }

            fclose($handle);
        }, 'invigilation-schedule-' . date('Y-m-d') . '.csv');
    }

    public function printExamSchedule($examId)
    {
        $exam = Exam::with(['module', 'rooms', 'group', 'invigilationSchedules.teacher'])
            ->findOrFail($examId);

        $pdf = Pdf::loadView('pdf.exam-schedule', [
            'exam' => $exam
        ]);

        return $pdf->stream('exam-schedule-' . $exam->id . '.pdf');
    }

    private function checkTeacherConflict($teacherId, $exam)
    {
        $conflicts = [];

        // Check if teacher is unavailable on that date
        $teacher = Teacher::find($teacherId);
        if ($teacher->unavailable_dates && in_array($exam->exam_date, $teacher->unavailable_dates)) {
            $conflicts[] = 'Teacher is unavailable on this date';
        }

        // Check max exams per day
        $dailyAssignments = InvigilationSchedule::where('teacher_id', $teacherId)
            ->whereHas('exam', function($query) use ($exam) {
                $query->where('exam_date', $exam->exam_date);
            })
            ->count();

        if ($dailyAssignments >= $teacher->max_exams_per_day) {
            $conflicts[] = "Teacher has reached maximum exams per day ({$teacher->max_exams_per_day})";
        }

        // Check time conflicts
        $timeConflict = InvigilationSchedule::where('teacher_id', $teacherId)
            ->whereHas('exam', function($query) use ($exam) {
                $query->where('exam_date', $exam->exam_date)
                    ->where(function($q) use ($exam) {
                        $q->whereBetween('exam_time', [$exam->exam_time, $exam->end_time])
                          ->orWhereBetween('end_time', [$exam->exam_time, $exam->end_time])
                          ->orWhere(function($sub) use ($exam) {
                              $sub->where('exam_time', '<=', $exam->exam_time)
                                 ->where('end_time', '>=', $exam->end_time);
                          });
                    });
            })
            ->exists();

        if ($timeConflict) {
            $conflicts[] = 'Teacher has another exam at same time';
        }

        return $conflicts;
    }
}
