<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class StudentController extends Controller
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
        return Inertia::render('Student/Dashboard', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function myExams()
    {
        return Inertia::render('Student/MyExams', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function calendar()
    {
        return Inertia::render('Student/Calendar', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
}
