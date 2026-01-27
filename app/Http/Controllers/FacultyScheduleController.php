<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FacultyScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        // Charger les données réelles depuis la base de données
        $cycles = \App\Models\Cycle::with(['levels'])->get();
        $specialities = \App\Models\Speciality::all();
        $modules = \App\Models\Module::with(['teacher', 'level', 'speciality'])->get();
        $groups = \App\Models\Group::with(['students', 'level', 'speciality'])->get();
        $teachers = \App\Models\Teacher::with('user', 'modules')->get();
        
        // Charger les examens existants
        $exams = \App\Models\Exam::with(['module.teacher', 'group.level', 'group.speciality', 'room'])->get();
        
        return Inertia::render('HeadDepartment/FacultySchedule', [
            'cycles' => $cycles,
            'specialities' => $specialities,
            'groups' => $groups,
            'modules' => $modules,
            'teachers' => $teachers,
            'examPlans' => $exams
        ]);
    }
    
    public function validateSchedule(Request $request): Response
    {
        // Logique de validation du planning
        $validated = $request->validate([
            'schedule_id' => 'required|string',
            'action' => 'required|in:validate,reject,pending'
        ]);
        
        // Ici vous pouvez ajouter la logique pour sauvegarder l'état de validation
        // Par exemple, sauvegarder dans une table ou mettre à jour un champ
        
        return response()->json([
            'success' => true,
            'message' => 'Planning ' . $validated['action'] . ' avec succès',
            'schedule_id' => $validated['schedule_id'],
            'action' => $validated['action']
        ]);
    }
}
