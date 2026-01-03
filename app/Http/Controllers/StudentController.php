<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class StudentController extends Controller
{
    public function dashboard()
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
