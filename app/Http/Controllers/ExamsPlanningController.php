<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ExamPlan;

class ExamsPlanningController extends Controller
{
    /**
     * Display the exams planning validation page for Head Department.
     */
    public function index(): Response
    {
        // Récupérer les exam plans en attente de validation
        $examPlans = ExamPlan::with(['group', 'module', 'teacher', 'room', 'creator'])
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
                    'created_at' => $plan->created_at->format('M d, Y H:i'),
                ];
            });

        $stats = [
            'pending_count' => ExamPlan::where('status', 'pending')->count(),
            'validated_count' => ExamPlan::where('status', 'validated')->count(),
            'rejected_count' => ExamPlan::where('status', 'rejected')->count(),
            'scheduled_count' => ExamPlan::where('status', 'scheduled')->count(),
        ];

        return Inertia::render('HeadDepartment/exams_planing', [
            'examPlans' => $examPlans,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a new exam.
     */
    public function store(Request $request)
    {
        // Pour l'instant, juste retourner un message de succès
        return redirect()->back()->with('success', 'Exam created successfully! (Mock data)');
    }

    /**
     * Update an exam.
     */
    public function update(Request $request, $id)
    {
        // Pour l'instant, juste retourner un message de succès
        return redirect()->back()->with('success', 'Exam updated successfully! (Mock data)');
    }

    /**
     * Delete an exam.
     */
    public function destroy($id)
    {
        // Pour l'instant, juste retourner un message de succès
        return redirect()->back()->with('success', 'Exam deleted successfully! (Mock data)');
    }
}
