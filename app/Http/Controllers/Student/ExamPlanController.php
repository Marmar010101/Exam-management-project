<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ExamPlan;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamPlanController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (auth()->check() && auth()->user()->role !== 'student') {
                abort(403); 
            }
            return $next($request); 
        });
    }

    /**
     * Display exam plans for the authenticated student.
     */
    public function index()
    {
        $student = Student::where('user_id', auth()->id())->first();
        
        if (!$student) {
            return Inertia::render('Student/ExamPlans/Index', [
                'examPlans' => [],
                'student' => null,
            ]);
        }

        $examPlans = ExamPlan::with(['group', 'module', 'teacher', 'room', 'creator', 'validator'])
            ->where('group_id', $student->group_id)
            ->whereIn('status', ['validated', 'scheduled'])
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
                    'status' => $plan->status,
                    'status_label' => $plan->getStatusLabel(),
                    'status_color' => $plan->getStatusColor(),
                    'created_by' => $plan->creator ? $plan->creator->first_name . ' ' . $plan->creator->last_name : 'Unknown',
                    'validated_by' => $plan->validator ? $plan->validator->first_name . ' ' . $plan->validator->last_name : null,
                    'validated_at' => $plan->validated_at ? $plan->validated_at->format('M d, Y H:i') : null,
                ];
            });

        return Inertia::render('Student/ExamPlans/Index', [
            'examPlans' => $examPlans,
            'student' => $student,
        ]);
    }

    /**
     * Display the specified exam plan.
     */
    public function show($id)
    {
        $student = Student::where('user_id', auth()->id())->first();
        
        if (!$student) {
            abort(403, 'Student profile not found');
        }

        $examPlan = ExamPlan::with(['group', 'module', 'teacher', 'room', 'creator', 'validator'])
            ->where('id', $id)
            ->where('group_id', $student->group_id)
            ->whereIn('status', ['validated', 'scheduled'])
            ->firstOrFail();

        return Inertia::render('Student/ExamPlans/Show', [
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
                'created_by' => $examPlan->creator,
                'validated_by' => $examPlan->validator,
                'validated_at' => $examPlan->validated_at ? $examPlan->validated_at->format('M d, Y H:i') : null,
                'validation_notes' => $examPlan->validation_notes,
                'created_at' => $examPlan->created_at->format('M d, Y H:i'),
            ],
        ]);
    }
}
