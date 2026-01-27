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
        
        // Get teacher's modules directly from modules table
        $modules = DB::table('modules')
            ->where('teacher_id', $user->id)
            ->orderBy('module_name')
            ->get()
            ->map(function ($module) {
                return [
                    'id' => $module->id,
                    'name' => $module->module_name,
                    'code' => $module->code ?? $module->module_name ?? 'N/A',
                    'speciality' => $module->speciality ?? 'Non spécifié',
                    'level' => $module->level ?? 'Non spécifié',
                    'semester' => $module->semester ?? 'Non spécifié',
                    'credits' => $module->credits ?? 6,
                ];
            });

        return Inertia::render('Teacher/modules', [
            'modules' => $modules,
            'user' => $user
        ]);
    }
}
