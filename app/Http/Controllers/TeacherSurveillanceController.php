<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherSurveillanceController extends Controller
{
    /**
     * Display teacher surveillance page
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get teacher's surveillances
        $surveillances = DB::table('teacher_surveillances')
            ->where('teacher_id', $user->id)
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($surveillance) {
                return [
                    'id' => $surveillance->id,
                    'module' => $surveillance->module,
                    'module_id' => $surveillance->module_id,
                    'group' => $surveillance->group,
                    'date' => $surveillance->date,
                    'time' => $surveillance->time,
                    'room' => $surveillance->room,
                    'urgency' => $surveillance->urgency,
                ];
            });

        return Inertia::render('Teacher/surveillance', [
            'surveillances' => $surveillances,
            'user' => $user
        ]);
    }
}
