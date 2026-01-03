<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Speciality;
use App\Models\Level;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleController extends Controller
{
    /**
     * Display a listing of the modules.
     */
    public function index()
    {
        $modules = Module::with(['speciality'])->get()->map(function ($module) {
            return [
                'id' => $module->id,
                'module_name' => $module->module_name,
                'code' => $module->code ?? 'N/A',
                'speciality' => $module->speciality->name ?? 'N/A',
                'speciality_id' => $module->speciality_id,
                'level' => 'N/A', // Pas de relation level pour l'instant
                'level_id' => $module->level_id ?? null,
                'semester' => 'N/A', // Pas de relation semester pour l'instant
                'semester_id' => $module->semester_id ?? null,
                'teacher' => 'Non assigné' // Plus de relation teacher
            ];
        });

        $specialities = Speciality::all(['id', 'name']);
        $levels = \App\Models\StudyLevel::with('studySystem')->get(['id', 'name', 'study_system_id']);
        $semesters = Semester::all(['id', 'name']);
        $filieres = \App\Models\Filiere::all(['id', 'name']);

        return Inertia::render('headdepartment/modules', [
            'modules' => $modules,
            'specialities' => $specialities,
            'levels' => $levels,
            'semesters' => $semesters,
            'filieres' => $filieres
        ]);
    }

    /**
     * Store a newly created module.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'module_name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'speciality_id' => 'required|exists:specialities,id',
            'level_id' => 'nullable|exists:study_levels,id',
            'semester_id' => 'nullable|exists:semesters,id',
            'filiere_id' => 'nullable|exists:filieres,id'
            // 'teacher_id' => 'nullable|exists:teachers,id' // Commenté - table teachers n'existe plus
        ]);

        Module::create($validated);

        return redirect()->back()->with('success', 'Module créé avec succès');
    }

    /**
     * Update the specified module.
     */
    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'module_name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'speciality_id' => 'required|exists:specialities,id',
            'level_id' => 'nullable|exists:study_levels,id',
            'semester_id' => 'nullable|exists:semesters,id',
            'filiere_id' => 'nullable|exists:filieres,id'
            // 'teacher_id' => 'nullable|exists:teachers,id' // Commenté - table teachers n'existe plus
        ]);

        $module->update($validated);

        return redirect()->back()->with('success', 'Module mis à jour avec succès');
    }

    /**
     * Remove the specified module.
     */
    public function destroy(Module $module)
    {
        $module->delete();

        return redirect()->back()->with('success', 'Module supprimé avec succès');
    }
}
