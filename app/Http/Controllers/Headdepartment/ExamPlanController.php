<?php

namespace App\Http\Controllers\Headdepartment;

use App\Http\Controllers\Controller;
use App\Models\ExamPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamPlanController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (auth()->check() && auth()->user()->role !== 'headdepartment') {
                abort(403); 
            }
            return $next($request); 
        });
    }

    /**
     * Display exam plans pending validation.
     */
    public function index()
    {
        $examPlans = ExamPlan::with(['group', 'module', 'teacher', 'room', 'creator'])
            ->where('status', 'pending')
            ->orderBy('exam_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'group_name' => $plan->group ? $plan->group->name : 'Unknown',
                    'module_name' => $plan->module ? $plan->module->module_name : 'Unknown',
                    'teacher_name' => $plan->teacher ? $plan->teacher->first_name . ' ' . $plan->teacher->last_name : 'Not Assigned',
                    'room_name' => $plan->room ? $plan->room->name : 'Not Assigned',
                    'exam_type' => $plan->exam_type,
                    'exam_type_label' => $plan->getExamTypeLabel(),
                    'exam_date' => $plan->exam_date,
                    'formatted_date' => $plan->getFormattedDate(),
                    'start_time' => $plan->start_time,
                    'end_time' => $plan->end_time,
                    'formatted_time' => $plan->getFormattedTime(),
                    'duration_minutes' => $plan->duration_minutes,
                    'description' => $plan->description,
                    'created_by' => $plan->creator ? $plan->creator->first_name . ' ' . $plan->creator->last_name : 'Unknown',
                    'created_at' => $plan->created_at->format('M d, Y H:i'),
                ];
            });

        $stats = [
            'pending_count' => ExamPlan::where('status', 'pending')->count(),
            'validated_count' => ExamPlan::where('status', 'validated')->count(),
            'rejected_count' => ExamPlan::where('status', 'rejected')->count(),
            'scheduled_count' => ExamPlan::where('status', 'scheduled')->count(),
        ];

        return Inertia::render('Headdepartment/ExamPlans/Index', [
            'examPlans' => $examPlans,
            'stats' => $stats,
        ]);
    }

    /**
     * Display the specified exam plan for validation.
     */
    public function show($id)
    {
        $examPlan = ExamPlan::with(['group', 'module', 'teacher', 'room', 'creator', 'validator'])
            ->findOrFail($id);

        return Inertia::render('HeadDepartment/ExamPlanShow', [
            'examPlan' => [
                'id' => $examPlan->id,
                'group' => $examPlan->group,
                'module' => $examPlan->module,
                'teacher' => $examPlan->teacher,
                'room' => $examPlan->room,
                'exam_type' => $examPlan->exam_type,
                'exam_type_label' => $examPlan->getExamTypeLabel(),
                'exam_date' => $examPlan->exam_date,
                'formatted_date' => $examPlan->getFormattedDate(),
                'start_time' => $examPlan->start_time,
                'end_time' => $examPlan->end_time,
                'formatted_time' => $examPlan->getFormattedTime(),
                'duration_minutes' => $examPlan->duration_minutes,
                'description' => $examPlan->description,
                'status' => $examPlan->status,
                'status_label' => $examPlan->getStatusLabel(),
                'status_color' => $examPlan->getStatusColor(),
                'created_by' => $examPlan->creator ? $examPlan->creator->first_name . ' ' . $examPlan->creator->last_name : 'Unknown',
                'created_at' => $examPlan->created_at->format('M d, Y H:i'),
                'validator' => $examPlan->validator,
                'validated_at' => $examPlan->validated_at ? $examPlan->validated_at->format('M d, Y H:i') : null,
                'validation_notes' => $examPlan->validation_notes,
            ],
        ]);
    }

    /**
     * Validate the exam plan.
     */
    public function validateExamPlan(Request $request, $id)
    {
        $examPlan = ExamPlan::findOrFail($id);

        if ($examPlan->status !== 'pending') {
            return redirect()->route('headdepartment.exam-plans.show', $id)
                ->with('error', 'This exam plan has already been processed.');
        }

        $validated = $request->validate([
            'action' => 'required|in:validate,reject',
            'validation_notes' => 'nullable|string|max:1000',
        ]);

        $examPlan->update([
            'status' => $validated['action'] === 'validate' ? 'validated' : 'rejected',
            'validated_by' => auth()->id(),
            'validation_notes' => $validated['validation_notes'],
            'validated_at' => now(),
        ]);

        $message = $validated['action'] === 'validate' 
            ? 'Exam plan validated successfully.' 
            : 'Exam plan rejected.';

        return redirect()->route('headdepartment.exam-plans.index')
            ->with('success', $message);
    }

    /**
     * Display all exam plans (for reporting).
     */
    public function all()
    {
        $examPlans = ExamPlan::with(['group', 'module', 'teacher', 'room', 'creator', 'validator'])
            ->orderBy('exam_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'group_name' => $plan->group ? $plan->group->name : 'Unknown',
                    'module_name' => $plan->module ? $plan->module->module_name : 'Unknown',
                    'teacher_name' => $plan->teacher ? $plan->teacher->first_name . ' ' . $plan->teacher->last_name : 'Not Assigned',
                    'room_name' => $plan->room ? $plan->room->name : 'Not Assigned',
                    'exam_type' => $plan->exam_type,
                    'exam_type_label' => $plan->getExamTypeLabel(),
                    'exam_date' => $plan->exam_date,
                    'formatted_date' => $plan->getFormattedDate(),
                    'start_time' => $plan->start_time,
                    'end_time' => $plan->end_time,
                    'formatted_time' => $plan->getFormattedTime(),
                    'duration_minutes' => $plan->duration_minutes,
                    'status' => $plan->status,
                    'status_label' => $plan->getStatusLabel(),
                    'status_color' => $plan->getStatusColor(),
                    'created_by' => $plan->creator ? $plan->creator->first_name . ' ' . $plan->creator->last_name : 'Unknown',
                    'validated_by' => $plan->validator ? $plan->validator->first_name . ' ' . $plan->validator->last_name : null,
                    'validated_at' => $plan->validated_at ? $plan->validated_at->format('M d, Y H:i') : null,
                    'created_at' => $plan->created_at->format('M d, Y H:i'),
                ];
            });

        return Inertia::render('Headdepartment/ExamPlans/All', [
            'examPlans' => $examPlans,
        ]);
    }
}
