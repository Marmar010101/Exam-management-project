<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherExamController extends Controller
{
    /**
     * Display teacher exams page
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get teacher's exams
        $exams = DB::table('teacher_exams')
            ->where('teacher_id', $user->id)
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($exam) {
                return [
                    'id' => $exam->id,
                    'module' => $exam->module,
                    'module_id' => $exam->module_id,
                    'type' => $exam->type,
                    'date' => $exam->date,
                    'duration' => $exam->duration,
                    'group' => $exam->group,
                    'room' => $exam->room,
                ];
            });

        return Inertia::render('Teacher/exams', [
            'exams' => $exams,
            'user' => $user
        ]);
    }
}
