<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index()
    {
        return Inertia::render('Teacher/Dashboard', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function surveillance()
    {
        return Inertia::render('Teacher/Surveillance', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function exams()
    {
        return Inertia::render('Teacher/Exams', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function modules()
    {
        return Inertia::render('Teacher/Modules', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function requestsAlerts()
    {
        return Inertia::render('Teacher/RequestsAlerts', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
}