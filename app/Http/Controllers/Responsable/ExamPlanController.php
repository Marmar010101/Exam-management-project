<?php

namespace App\Http\Controllers\Responsable;

use App\Http\Controllers\Controller;
use App\Models\ExamPlan;
use App\Models\Group;
use App\Models\Module;
use App\Models\Teacher;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamPlanController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (auth()->check() && auth()->user()->role !== 'responsable') {
                abort(403); 
            }
            return $next($request); 
        });
    }

    /**
     * Display a listing of exam plans.
     */
    public function index()
    {
        $examPlans = ExamPlan::with(['group', 'module', 'teacher', 'room', 'creator', 'validator'])
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
                    'exam_date' => $plan->exam_date,
                    'formatted_date' => $plan->getFormattedDate(),
                    'start_time' => $plan->start_time,
                    'end_time' => $plan->end_time,
                    'formatted_time' => $plan->getFormattedTime(),
                    'duration_minutes' => $plan->duration_minutes,
                    'status' => $plan->status,
                    'status_label' => $plan->getStatusLabel(),
                    'status_color' => $plan->getStatusColor(),
                    'description' => $plan->description,
                    'created_by' => $plan->creator ? $plan->creator->first_name . ' ' . $plan->creator->last_name : 'Unknown',
                    'validated_by' => $plan->validator ? $plan->validator->first_name . ' ' . $plan->validator->last_name : null,
                    'validated_at' => $plan->validated_at ? $plan->validated_at->format('M d, Y H:i') : null,
                ];
            });

        return Inertia::render('Responsable/ExamPlans/Index', [
            'examPlans' => $examPlans,
        ]);
    }

    /**
     * Show the form for creating a new exam plan.
     */
    public function create()
    {
        $groups = Group::with(['level', 'speciality'])->orderBy('name')->get();
        $modules = Module::with(['teacher'])->orderBy('module_name')->get();
        $teachers = Teacher::with(['user'])->orderBy('first_name')->get();
        $rooms = Room::where('availability', true)->orderBy('room_name')->get();
        $examTypes = ['Final', 'Midterm', 'Quiz', 'Practical', 'Oral'];

        return Inertia::render('Responsable/ExamPlans/Create', [
            'groups' => $groups,
            'modules' => $modules,
            'teachers' => $teachers,
            'rooms' => $rooms,
            'examTypes' => $examTypes,
        ]);
    }

    /**
     * Store a newly created exam plan in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'group_id' => 'required|exists:groups,id',
            'module_id' => 'required|exists:modules,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'room_id' => 'nullable|exists:rooms,id',
            'exam_type' => 'required|string|in:Final,Midterm,Quiz,Practical,Oral',
            'exam_date' => 'required|date|after:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'duration_minutes' => 'required|integer|min:30|max:240',
            'description' => 'nullable|string|max:1000',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'pending';

        ExamPlan::create($validated);

        return redirect()->route('responsable.exam-plans.index')
            ->with('success', 'Exam plan created successfully and sent for validation.');
    }

    /**
     * Display the specified exam plan.
     */
    public function show($id)
    {
        $examPlan = ExamPlan::with(['group', 'module', 'teacher', 'room', 'creator', 'validator'])
            ->findOrFail($id);

        return Inertia::render('Responsable/ExamPlans/Show', [
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

    /**
     * Show the form for editing the specified exam plan.
     */
    public function edit($id)
    {
        $examPlan = ExamPlan::findOrFail($id);
        
        // Only allow editing if status is pending or rejected
        if (!in_array($examPlan->status, ['pending', 'rejected'])) {
            return redirect()->route('responsable.exam-plans.show', $id)
                ->with('error', 'Cannot edit exam plan that has been validated or scheduled.');
        }

        $groups = Group::with(['level', 'speciality'])->orderBy('name')->get();
        $modules = Module::with(['teacher'])->orderBy('module_name')->get();
        $teachers = Teacher::with(['user'])->orderBy('first_name')->get();
        $rooms = Room::where('availability', true)->orderBy('room_name')->get();
        $examTypes = ['Final', 'Midterm', 'Quiz', 'Practical', 'Oral'];

        return Inertia::render('Responsable/ExamPlans/Edit', [
            'examPlan' => $examPlan,
            'groups' => $groups,
            'modules' => $modules,
            'teachers' => $teachers,
            'rooms' => $rooms,
            'examTypes' => $examTypes,
        ]);
    }

    /**
     * Update the specified exam plan in storage.
     */
    public function update(Request $request, $id)
    {
        $examPlan = ExamPlan::findOrFail($id);
        
        // Only allow updating if status is pending or rejected
        if (!in_array($examPlan->status, ['pending', 'rejected'])) {
            return redirect()->route('responsable.exam-plans.show', $id)
                ->with('error', 'Cannot update exam plan that has been validated or scheduled.');
        }

        $validated = $request->validate([
            'group_id' => 'required|exists:groups,id',
            'module_id' => 'required|exists:modules,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'room_id' => 'nullable|exists:rooms,id',
            'exam_type' => 'required|string|in:Final,Midterm,Quiz,Practical,Oral',
            'exam_date' => 'required|date|after:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'duration_minutes' => 'required|integer|min:30|max:240',
            'description' => 'nullable|string|max:1000',
        ]);

        $examPlan->update($validated);

        return redirect()->route('responsable.exam-plans.show', $id)
            ->with('success', 'Exam plan updated successfully.');
    }

    /**
     * Remove the specified exam plan from storage.
     */
    public function destroy($id)
    {
        $examPlan = ExamPlan::findOrFail($id);
        
        // Only allow deleting if status is pending or rejected
        if (!in_array($examPlan->status, ['pending', 'rejected'])) {
            return redirect()->route('responsable.exam-plans.show', $id)
                ->with('error', 'Cannot delete exam plan that has been validated or scheduled.');
        }

        $examPlan->delete();

        return redirect()->route('responsable.exam-plans.index')
            ->with('success', 'Exam plan deleted successfully.');
    }
}
