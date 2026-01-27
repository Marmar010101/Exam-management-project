<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Room;
use App\Models\Exam;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of the exams.
     */
    public function index()
    {
        // Utiliser les vraies données des seeders
        $exams = Exam::with(['module', 'group', 'teacher'])
            ->orderBy('exam_date_old', 'desc')
            ->orderBy('exam_time_old', 'desc')
            ->get()
            ->map(function ($exam) {
                return [
                    'id' => $exam->id,
                    'module' => $exam->module->module_name ?? 'Unknown',
                    'date' => $exam->exam_date_old,
                    'time' => $exam->exam_time_old,
                    'room' => 'A101', // Default room - could be enhanced
                    'type' => $exam->exam_type,
                    'duration' => 120, // Default duration
                    'group' => $exam->group->name ?? 'Unknown',
                    'teacher' => $exam->teacher->first_name . ' ' . $exam->teacher->last_name ?? 'Unknown',
                ];
            });

        $modules = Module::where(function($query) {
            $query->where('code', 'NOT LIKE', 'PMM%')
                  ->where('code', 'NOT LIKE', 'RMM%')
                  ->where('code', 'NOT LIKE', 'SMM%');
        })->get(['id', 'module_name', 'code']);
        $rooms = Room::all(['id', 'room_name']);

        return Inertia::render('HeadDepartment/exams', [
            'exams' => $exams,
            'modules' => $modules,
            'rooms' => $rooms
        ]);
    }

    /**
     * Store a newly created exam.
     */
    public function store(Request $request)
    {
        // Pour l'instant, juste retourner un message de succès
        return redirect()->back()->with('success', 'Examen créé avec succès! (Mock data)');
    }

    /**
     * Update the specified exam.
     */
    public function update(Request $request, $id)
    {
        // Pour l'instant, juste retourner un message de succès
        return redirect()->back()->with('success', 'Examen mis à jour avec succès! (Mock data)');
    }

    /**
     * Remove the specified exam.
     */
    public function destroy($id)
    {
        // Pour l'instant, juste retourner un message de succès
        return redirect()->back()->with('success', 'Examen supprimé avec succès! (Mock data)');
    }

    /**
     * Validate the specified exam.
     */
    public function validateExam(Request $request, $id)
    {
        $exam = Exam::findOrFail($id);

        if ($exam->status !== 'pending') {
            return redirect()->route('headdepartment.exams')
                ->with('error', 'This exam has already been processed.');
        }

        $validated = $request->validate([
            'action' => 'required|in:validate,reject',
            'validation_notes' => 'nullable|string|max:1000',
        ]);

        $exam->update([
            'status' => $validated['action'] === 'validate' ? 'validated' : 'rejected',
            'validated_by' => auth()->id(),
            'validation_notes' => $validated['validation_notes'],
            'validated_at' => now(),
        ]);

        $message = $validated['action'] === 'validate' 
            ? 'Exam validated successfully.' 
            : 'Exam rejected.';

        return redirect()->route('headdepartment.exams')
            ->with('success', $message);
    }
}
