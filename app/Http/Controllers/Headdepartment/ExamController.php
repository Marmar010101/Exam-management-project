<?php

namespace App\Http\Controllers\Headdepartment;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Room;
use App\Models\Exam;
use App\Services\ExamNotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of exams for validation.
     */
    public function index()
    {
        // Récupérer TOUS les examens avec toutes les relations
        $exams = Exam::with(['module.level', 'module.speciality', 'module.semester', 'group.level', 'group.speciality', 'teacher.user', 'room'])
            ->orderBy('exam_date_old', 'asc')
            ->orderBy('exam_time_old', 'asc')
            ->get();
            
        \Log::info('HeadDepartment: Total exams found:', ['count' => $exams->count()]);
        
        // Map the exam data with all necessary information
        $examData = $exams->map(function ($exam) {
            $examArray = [
                'id' => $exam->id,
                'module_id' => $exam->module_id,
                'group_id' => $exam->group_id,
                'exam_type' => $exam->exam_type,
                'exam_subtype' => $exam->exam_subtype ?? '',
                'title' => $exam->title ?? $exam->exam_type,
                'description' => $exam->description ?? '',
                'duration_minutes' => $exam->duration_minutes ?? $exam->duration ?? 120,
                'max_score' => $exam->max_score ?? 20.00,
                'exam_date' => $exam->exam_date_old,
                'exam_time' => $exam->exam_time_old,
                'teacher_id' => $exam->teacher_id,
                'room_id' => $exam->room_id,
                'status' => $exam->status ?? 'pending',
                'created_by' => $exam->created_by,
                'validated_by' => $exam->validated_by,
                'validation_notes' => $exam->validation_notes,
                'validated_at' => $exam->validated_at,
                'created_at' => $exam->created_at,
                'updated_at' => $exam->updated_at,
                'formatted_date' => $exam->exam_date_old ? \Carbon\Carbon::parse($exam->exam_date_old)->format('M d, Y') : 'N/A',
                'formatted_time' => $exam->exam_time_old ? \Carbon\Carbon::parse($exam->exam_time_old)->format('H:i') : 'N/A',
                'module' => [
                    'id' => $exam->module->id ?? null,
                    'module_name' => $exam->module->module_name ?? 'N/A',
                    'code' => $exam->module->code ?? '',
                    'semester' => $exam->module->semester ?? '',
                ],
                'group' => [
                    'id' => $exam->group->id ?? null,
                    'name' => $exam->group->name ?? 'Non assigné',
                    'level' => ($exam->group && $exam->group->level) ? $exam->group->level->name : 'N/A',
                    'speciality' => ($exam->group && $exam->group->speciality) ? $exam->group->speciality->name : 'N/A',
                ],
                'teacher' => [
                    'id' => $exam->teacher->id ?? null,
                    'user' => [
                        'first_name' => $exam->teacher->user->first_name ?? 'N/A',
                        'last_name' => $exam->teacher->user->last_name ?? '',
                    ],
                ],
                'room' => [
                    'id' => $exam->room->id ?? null,
                    'room_name' => $exam->room->room_name ?? 'Non assignée',
                    'capacity' => $exam->room->capacity ?? 0,
                    'type' => $exam->room->type ?? 'Standard',
                ],
            ];
            
            \Log::info('HeadDepartment: Exam processed:', ['id' => $exam->id, 'status' => $examArray['status'], 'module' => $examArray['module']['module_name']]);
            
            return $examArray;
        });

        \Log::info('HeadDepartment: Final exam data count:', ['count' => $examData->count()]);

        return Inertia::render('HeadDepartment/Exams/Index', [
            'exams' => $examData,
            'totalExams' => $examData->count(),
            'examStats' => [
                'total' => $examData->count(),
                'pending' => $examData->where('status', 'pending')->count(),
                'accepted' => $examData->where('status', 'accepted')->count(),
                'rejected' => $examData->where('status', 'rejected')->count(),
                'by_type' => $examData->groupBy('exam_type')->map->count(),
            ],
        ]);
    }

    public function validateExam($id)
    {
        try {
            $exam = Exam::findOrFail($id);
            
            \Log::info('HeadDepartment: Validating exam:', ['exam_id' => $id, 'current_status' => $exam->status]);
            
            $exam->update([
                'status' => 'approved', // Changed from 'accepted' to 'approved'
                'validated_by' => auth()->id(),
                'validated_at' => now(),
                'validation_notes' => 'Exam approved by Head Department',
            ]);

            \Log::info('HeadDepartment: Exam validated successfully:', ['exam_id' => $id, 'new_status' => 'approved']);

            // Send notification to responsible
            $this->sendNotificationToResponsible('exam_validated', [
                'exam_id' => $exam->id,
                'exam_title' => $exam->title,
                'validated_by' => auth()->user()->full_name,
            ]);

            return redirect()->route('headdepartment.exams.index')
                ->with('success', 'Exam validated successfully and notification sent to responsible.');
        } catch (\Exception $e) {
            \Log::error('HeadDepartment: Error validating exam:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to validate exam: ' . $e->getMessage());
        }
    }

    public function rejectExam(Request $request, $id)
    {
        try {
            $exam = Exam::findOrFail($id);
            
            $validated = $request->validate([
                'reason' => 'required|string|max:500',
            ]);

            \Log::info('HeadDepartment: Rejecting exam:', ['exam_id' => $id, 'reason' => $validated['reason']]);

            $exam->update([
                'status' => 'rejected',
                'validated_by' => auth()->id(),
                'validated_at' => now(),
                'validation_notes' => $validated['reason'],
            ]);

            \Log::info('HeadDepartment: Exam rejected successfully:', ['exam_id' => $id]);

            // Send notification to responsible
            $this->sendNotificationToResponsible('exam_rejected', [
                'exam_id' => $exam->id,
                'exam_title' => $exam->title,
                'validated_by' => auth()->user()->full_name,
                'reason' => $validated['reason'],
            ]);

            return redirect()->route('headdepartment.exams.index')
                ->with('success', 'Exam rejected successfully and notification sent to responsible.');
        } catch (\Exception $e) {
            \Log::error('HeadDepartment: Error rejecting exam:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to reject exam: ' . $e->getMessage());
        }
    }

    private function sendNotificationToResponsible($type, $data)
    {
        // Store notification in session for flash messages
        $message = match($type) {
            'exam_validated' => "Your exam '{$data['exam_title']}' has been validated and is now active",
            'exam_rejected' => "Your exam '{$data['exam_title']}' has been rejected. Reason: {$data['reason']}",
            default => 'Exam notification'
        };

        // Store in session for flash messages
        session()->flash('responsable_notification', [
            'type' => $type,
            'message' => $message,
            'data' => $data,
            'timestamp' => now()->toDateTimeString()
        ]);
    }
}
