<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherModuleController extends Controller
{
    /**
     * Display teacher modules page
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get teacher's modules through teacher_modules relationship
        $modules = DB::table('modules')
            ->select('modules.*')
            ->join('teacher_modules', 'modules.id', '=', 'teacher_modules.module_id')
            ->where('teacher_modules.teacher_id', $user->id)
            ->orderBy('modules.module_name')
            ->get()
            ->map(function ($module) {
                return [
                    'id' => $module->id,
                    'name' => $module->module_name,
                    'code' => $module->module_name ?? 'N/A',
                    'speciality' => 'Non spécifié',
                    'level' => 'Non spécifié',
                    'semester' => 'Non spécifié',
                    'credits' => 6,
                ];
            });

        return Inertia::render('Teacher/modules', [
            'modules' => $modules,
            'user' => $user
        ]);
    }
}
