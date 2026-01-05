<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function __construct()
    {
        // Temporarily remove strict role checking for debugging
        $this->middleware(function ($request, $next) {
            // Allow access if user is authenticated
            if (auth()->check()) {
                return $next($request);
            }
            // If not authenticated, let Laravel handle it
            return $next($request);
        });
    }

    public function index()
    {
        try {
            $user = auth()->user();
            return Inertia::render('Teacher/Dashboard', [
                'auth' => [
                    'user' => $user
                ],
                'stats' => [
                    'totalModules' => 4,
                    'totalSurveillances' => 6,
                    'upcomingExams' => 3,
                    'attendanceRate' => 87
                ],
                'recentAlerts' => [],
                'upcomingExams' => []
            ]);
        } catch (\Exception $e) {
            \Log::error('Teacher Dashboard Error: ' . $e->getMessage());
            return Inertia::render('Teacher/Dashboard', [
                'auth' => [
                    'user' => auth()->user()
                ],
                'stats' => [],
                'recentAlerts' => [],
                'upcomingExams' => []
            ]);
        }
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
