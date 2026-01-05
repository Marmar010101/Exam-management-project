<?php

namespace App\Http\Controllers\Headdepartment;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Room;
use App\Models\Exam;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of exams.
     */
    public function index()
    {
        // Use real data from seeders
        $exams = Exam::with(['module', 'group', 'teacher'])
            ->orderBy('exame_date', 'desc')
            ->orderBy('exame_time', 'desc')
            ->get()
            ->map(function ($exam) {
                return [
                    'id' => $exam->id,
                    'module' => $exam->module ? $exam->module->module_name : 'Unknown',
                    'date' => $exam->exame_date,
                    'time' => $exam->exame_time,
                    'room' => 'A101', // Default room - could be enhanced
                    'type' => $exam->exam_type,
                    'group' => $exam->group ? $exam->group->name : 'Unknown',
                    'teacher' => $exam->teacher ? $exam->teacher->first_name . ' ' . $exam->teacher->last_name : 'Unknown',
                ];
            });

        return Inertia::render('Responsable/Exams', [
            'exams' => $exams,
        ]);
    }

    /**
     * Show the form for creating a new exam.
     */
    public function create()
    {
        $modules = Module::all();
        $rooms = Room::all();
        
        return Inertia::render('Responsable/Exams', [
            'modules' => $modules,
            'rooms' => $rooms,
            'creating' => true,
        ]);
    }

    /**
     * Store a newly created exam in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'module_id' => 'required|exists:modules,id',
            'exame_date' => 'required|date',
            'exame_time' => 'required',
            'exam_type' => 'required|string',
            'id_group' => 'required|exists:groups,id',
        ]);

        Exam::create($validated);

        return redirect()->route('responsable.exams.index')
            ->with('success', 'Exam created successfully.');
    }

    /**
     * Display the specified exam.
     */
    public function show($id)
    {
        $exam = Exam::with(['module', 'group', 'teacher'])->findOrFail($id);
        
        return Inertia::render('Responsable/Exams', [
            'exam' => $exam,
        ]);
    }

    /**
     * Show the form for editing the specified exam.
     */
    public function edit($id)
    {
        $exam = Exam::findOrFail($id);
        $modules = Module::all();
        $rooms = Room::all();
        
        return Inertia::render('Responsable/Exams', [
            'exam' => $exam,
            'modules' => $modules,
            'rooms' => $rooms,
            'editing' => true,
        ]);
    }

    /**
     * Update the specified exam in storage.
     */
    public function update(Request $request, $id)
    {
        $exam = Exam::findOrFail($id);
        
        $validated = $request->validate([
            'module_id' => 'required|exists:modules,id',
            'exame_date' => 'required|date',
            'exame_time' => 'required',
            'exam_type' => 'required|string',
            'id_group' => 'required|exists:groups,id',
        ]);

        $exam->update($validated);

        return redirect()->route('responsable.exams.index')
            ->with('success', 'Exam updated successfully.');
    }

    /**
     * Remove the specified exam from storage.
     */
    public function destroy($id)
    {
        $exam = Exam::findOrFail($id);
        $exam->delete();

        return redirect()->route('responsable.exams.index')
            ->with('success', 'Exam deleted successfully.');
    }
}
