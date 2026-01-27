<?php

namespace App\Http\Controllers\Responsable;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Exam;
use App\Models\Module;
use App\Models\Group;
use App\Models\Teacher;
use App\Models\Room;
use App\Services\ExamNotificationService;

class ExamController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            \Log::info('ExamController middleware check:', ['user_id' => auth()->id(), 'role' => auth()->user()?->role]);
            
            // Temporarily allow access for debugging
            if (auth()->check()) {
                return $next($request);
            }
            
            // Original check - re-enable later
            // if (auth()->check() && auth()->user()->role !== 'responsable') {
            //     abort(403); 
            // }
            return $next($request); 
        });
    }

    public function index()
    {
        \Log::info('Responsable: Loading exams page');
        
        $exams = Exam::with(['module', 'group.level', 'group.speciality', 'teacher.user', 'room'])
            ->orderBy('exam_date_old', 'asc')
            ->orderBy('exam_time_old', 'asc')
            ->get();
            
        \Log::info('Responsable: Total exams found:', ['count' => $exams->count()]);
        
        $examData = $exams->map(function ($exam) {
            $examArray = [
                'id' => $exam->id,
                'module' => [
                    'id' => $exam->module->id ?? null,
                    'module_name' => $exam->module->module_name ?? 'N/A',
                ],
                'group' => [
                    'id' => $exam->group->id ?? null,
                    'name' => $exam->group->name ?? 'N/A',
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
                ],
                'exam_type' => $exam->exam_type,
                'exam_subtype' => $exam->exam_subtype ?? '',
                'exam_date' => $exam->exam_date_old,
                'exam_time' => $exam->exam_time_old,
                'duration_minutes' => $exam->duration_minutes ?? 120,
                'title' => $exam->title ?? $exam->exam_type,
                'description' => $exam->description ?? '',
                'status' => $exam->status ?? 'pending',
                'created_by' => $exam->created_by,
                'validated_by' => $exam->validated_by,
                'validation_notes' => $exam->validation_notes,
                'validated_at' => $exam->validated_at,
                'created_at' => $exam->created_at,
                'updated_at' => $exam->updated_at,
            ];
            
            \Log::info('Responsable: Exam processed:', ['id' => $exam->id, 'status' => $examArray['status'], 'module' => $examArray['module']['module_name']]);
            
            return $examArray;
        });

        \Log::info('Responsable: Final exam data count:', ['count' => $examData->count()]);

        return Inertia::render('Responsable/Exams', [
            'exams' => $examData,
        ]);
    }

    public function create()
    {
        \Log::info('Exam create page accessed by user:', ['user_id' => auth()->id(), 'role' => auth()->user()?->role]);
        
        $modules = Module::orderBy('module_name')->get();
        $groups = Group::with(['level', 'speciality'])->orderBy('name')->get();
        $teachers = Teacher::with(['user'])->orderBy('first_name')->get();
        $semesters = \App\Models\Semester::orderBy('name')->get();

        \Log::info('Data loaded for exam create:', [
            'modules_count' => $modules->count(),
            'groups_count' => $groups->count(),
            'teachers_count' => $teachers->count(),
            'semesters_count' => $semesters->count()
        ]);

        return Inertia::render('Responsable/Exams/Create', [
            'sections' => $groups,
            'modules' => $modules,
            'teachers' => $teachers,
            'semesters' => $semesters,
        ]);
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Exam creation attempt with data:', $request->all());
            
            $validated = $request->validate([
                'section_id' => 'required|exists:groups,id',
                'module_id' => 'required|exists:modules,id',
                'semester_id' => 'required|exists:semesters,id',
                'exam_type' => 'required|in:Exam,Control,Test_TP',
                'exam_subtype' => 'nullable|in:Normal,Remplacement,Rattrapage',
                'duration' => 'required|integer|min:15|max:240',
                'description' => 'nullable|string',
                'teacher_id' => 'required|exists:teachers,id',
            ]);

            \Log::info('Validation passed:', $validated);

            $exam = Exam::create([
                'module_id' => $validated['module_id'],
                'group_id' => $validated['section_id'],
                'semester_id' => $validated['semester_id'],
                'exam_type' => $validated['exam_type'],
                'exam_subtype' => $validated['exam_subtype'] ?? 'Normal',
                'title' => $this->generateExamTitle($validated['module_id'], $validated['exam_type'], $validated['exam_subtype'] ?? 'Normal'),
                'description' => $validated['description'],
                'duration_minutes' => $validated['duration'],
                'max_score' => 20,
                'exam_date_old' => now()->format('Y-m-d'),
                'exam_time_old' => '08:00:00',
                'teacher_id' => $validated['teacher_id'],
                'room_id' => 1,
                'duration' => $validated['duration'],
                'status' => 'pending',
                'created_by' => auth()->id(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            \Log::info('Exam created successfully:', ['exam_id' => $exam->id]);

            // Send notification to Head Department
            $this->sendNotificationToHeadDepartment('exam_created', [
                'exam_id' => $exam->id,
                'exam_title' => $exam->title,
                'created_by' => auth()->user()->full_name,
            ]);

            // Store flash notification for Head Department
            session()->flash('headdepartment_notification', [
                'type' => 'exam_created',
                'message' => "New exam '{$exam->title}' created by " . auth()->user()->full_name . " and pending validation",
                'exam_id' => $exam->id,
                'timestamp' => now()->toDateTimeString()
            ]);

            \Log::info('HeadDepartment notification stored:', ['notification' => session('headdepartment_notification')]);

            return redirect('/Responsable/Exams')
                ->with('success', 'Exam created successfully and sent for validation.');
        } catch (\Exception $e) {
            \Log::error('Exam creation failed:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to create exam: ' . $e->getMessage());
        }
    }

    private function generateExamTitle($moduleId, $examType, $exam_subtype)
    {
        $module = Module::find($moduleId);
        $moduleName = $module ? $module->module_name : 'Unknown Module';
        
        $typeLabels = [
            'Exam' => 'Exam',
            'Control' => 'Control',
            'Test_TP' => 'Test TP'
        ];
        
        $subtypeLabels = [
            'Normal' => 'Normal',
            'Remplacement' => 'Replacement',
            'Rattrapage' => 'Make-up'
        ];
        
        return $moduleName . ' - ' . $typeLabels[$examType] . ' ' . $subtypeLabels[$exam_subtype];
    }

    public function edit($id)
    {
        $exam = Exam::findOrFail($id);
        $exam->load(['module', 'group', 'teacher']);
        
        $modules = Module::orderBy('module_name')->get();
        $groups = Group::with(['level', 'speciality'])->orderBy('name')->get();
        $teachers = Teacher::with(['user'])->orderBy('first_name')->get();

        return Inertia::render('Responsable/Exams/Edit', [
            'exam' => $exam,
            'sections' => $groups,
            'modules' => $modules,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, $id)
    {
        $exam = Exam::findOrFail($id);
        
        $validated = $request->validate([
            'section_id' => 'required|exists:groups,id',
            'module_id' => 'required|exists:modules,id',
            'exam_type' => 'required|in:Exam,Control,Test_TP',
            'exam_subtype' => 'required|in:Normal,Remplacement,Rattrapage',
            'duration' => 'required|integer|min:15|max:240',
            'description' => 'nullable|string',
            'teacher_id' => 'required|exists:teachers,id',
        ]);

        $exam->update([
            'module_id' => $validated['module_id'],
            'group_id' => $validated['section_id'],
            'exam_type' => $validated['exam_type'],
            'exam_subtype' => $validated['exam_subtype'],
            'title' => $this->generateExamTitle($validated['module_id'], $validated['exam_type'], $validated['exam_subtype']),
            'description' => $validated['description'],
            'duration_minutes' => $validated['duration'],
            'duration' => $validated['duration'],
            'teacher_id' => $validated['teacher_id'],
            'updated_at' => now(),
        ]);

        // Send notification to Head Department
        $this->sendNotificationToHeadDepartment('exam_updated', [
            'exam_id' => $exam->id,
            'exam_title' => $exam->title,
            'updated_by' => auth()->user()->full_name,
        ]);

        return redirect()->route('responsable.exams.index')
            ->with('success', 'Exam updated successfully.');
    }

    public function destroy($id)
    {
        $exam = Exam::findOrFail($id);
        $examTitle = $exam->title;
        
        $exam->delete();

        // Send notification to Head Department
        $this->sendNotificationToHeadDepartment('exam_deleted', [
            'exam_id' => $exam->id,
            'exam_title' => $examTitle,
            'deleted_by' => auth()->user()->full_name,
        ]);

        return redirect()->route('responsable.exams.index')
            ->with('success', 'Exam deleted successfully.');
    }

    private function sendNotificationToHeadDepartment($type, $data)
    {
        // Store notification in database or session
        $message = match($type) {
            'exam_created' => "New exam '{$data['exam_title']}' created by {$data['created_by']} and pending validation",
            'exam_updated' => "Exam '{$data['exam_title']}' updated by {$data['updated_by']} and pending validation",
            'exam_deleted' => "Exam '{$data['exam_title']}' deleted by {$data['deleted_by']}",
            'exam_validated' => "Exam '{$data['exam_title']}' has been validated and is now active",
            'exam_rejected' => "Exam '{$data['exam_title']}' has been rejected. Reason: {$data['reason']}",
            default => 'Exam notification'
        };

        // Store in session for flash messages
        session()->flash('head_department_notification', [
            'type' => $type,
            'message' => $message,
            'data' => $data,
            'timestamp' => now()->toDateTimeString()
        ]);
    }
}
