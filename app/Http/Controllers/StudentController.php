<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class StudentController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (auth()->check() && auth()->user()->role !== 'student') {
                abort(403); 
            }
            return $next($request); 
        });
    }

    public function index()
    {
        return Inertia::render('Student/Dashboard');
    }

    public function myExams()
    {
        return Inertia::render('Student/MyExams');
    }

    public function calendar()
    {
        return Inertia::render('Student/Calendar');
    }
}
