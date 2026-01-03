<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Teacher;
use App\Models\InvigilationSchedule;
use App\Services\InvigilationService;
use Barryvdh\DomPDF\Facade\Pdf; // ← Add this for PDF
use Illuminate\Support\Facades\Mail; // ← Add this for Mail
use App\Mail\InvigilationScheduleMail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;


class InvigilationController extends Controller
{
  public function index(Request $request)
{
    $exams = Exam::with([
        'module', 
        'rooms', 
        'group',
        'invigilators.user',  // Change this line!
        'invigilationSchedules.teacher.user' // Keep this if you use both
    ])
    ->when($request->date, function($query, $date) {
        $query->where('exam_date', $date);
    })
    ->when($request->room_id, function($query, $roomId) {
        $query->whereHas('rooms', function($q) use ($roomId) {
            $q->where('room_id', $roomId);
        });
    })
    ->orderBy('exam_date')
    ->orderBy('exam_time')
    ->get();

    // Debug: Log the first exam's data
    if ($exams->count() > 0) {
        $firstExam = $exams->first();
        Log::info("First exam ID: {$firstExam->id}");
        Log::info("Invigilators count: " . $firstExam->invigilators->count());
        Log::info("Invigilation Schedules count: " . $firstExam->invigilationSchedules->count());
        
        foreach ($firstExam->invigilators as $invigilator) {
            Log::info("Invigilator: {$invigilator->first_name} {$invigilator->last_name}");
        }
    }

    $teachers = Teacher::with(['user'])->get();

    return Inertia::render('Responsable/Invigilation/Index', [
        'exams' => $exams,
        'teachers' => $teachers,
        'filters' => $request->only(['date', 'room_id', 'teacher_id'])
    ]);
}

    public function autoAssign(Request $request)
    {
        $request->validate([
            'exam_ids' => 'required|array',
            'exam_ids.*' => 'exists:exams,id'
        ]);

        $invigilationService = new InvigilationService();
        $results = $invigilationService->autoAssignInvigilators($request->exam_ids);

        return redirect()->back()->with([
            'success' => 'Auto-assignment completed!',
            'results' => $results
        ]);
    }

    public function manualAssign(Request $request)
    {
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'teacher_id' => 'required|exists:teachers,id',
            'role' => 'nullable|in:main,assistant,backup',
            'notes' => 'nullable|string'
        ]);

        // Check for conflicts
        $conflicts = $this->checkTeacherConflict(
            $request->teacher_id,
            Exam::find($request->exam_id)
        );

        if (!empty($conflicts)) {
            return redirect()->back()->with([
                'warning' => 'Assignment created with conflicts: ' . implode(', ', $conflicts)
            ]);
        }

        InvigilationSchedule::updateOrCreate(
            [
                'exam_id' => $request->exam_id,
                'teacher_id' => $request->teacher_id
            ],
            [
                'role' => $request->role ?? 'assistant',
                'notes' => $request->notes
            ]
        );

        return redirect()->back()->with('success', 'Invigilator assigned successfully.');
    }

    public function destroy($id)
    {
        InvigilationSchedule::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Assignment removed.');
    }

   public function notifyTeacher(Request $request)
{
    $request->validate([
        'teacher_id' => 'required|exists:teachers,id'
    ]);

    $teacher = Teacher::with(['user', 'invigilationSchedules.exam'])->find($request->teacher_id);
    
    if (!$teacher->user || !$teacher->user->email) {
        return redirect()->back()->with('error', 'Teacher does not have an email address configured.');
    }
    
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
            $conflicts[] = 'Teacher has another exam at the same time';
        }
        
        return $conflicts;
    }
    


    
}