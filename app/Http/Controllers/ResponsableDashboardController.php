<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Group;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Exam;

class ResponsableDashboardController extends Controller
{
   // app/Http/Controllers/Responsable/DashboardController.php
public function index()
{
    $groups = Group::withCount(['students', 'modules', 'exams'])
        ->with(['level', 'speciality', 'cycle'])
        ->orderBy('name')
        ->get();

    $studentsCount = Student::count();
    $teachersCount = Teacher::count();
    $examsCount = Exam::count();
    $activePercentage = 95; // This could be dynamic

    // Get upcoming exams
    $upcomingExams = Exam::where('exam_date', '>=', now())
        ->with(['module', 'group'])
        ->orderBy('exam_date')
        ->limit(10)
        ->get()
        ->map(function ($exam) {
            return [
                'id' => $exam->id,
                'module_name' => $exam->module?->module_name ?? 'Unknown',
                'group_name' => $exam->group?->name ?? 'Unknown',
                'exam_date' => $exam->exam_date,
                'formatted_date' => \Carbon\Carbon::parse($exam->exam_date)->format('M d'),
                'is_today' => $exam->exam_date == now()->format('Y-m-d'),
                'time_range' => $exam->exam_time . ' - ' . $exam->end_time,
            ];
        });

    return Inertia::render('Responsable/Dashboard', [
        'studentsCount' => $studentsCount,
        'teachersCount' => $teachersCount,
        'examsCount' => $examsCount,
        'activePercentage' => $activePercentage,
        'groups' => $groups, // All groups
        'upcomingExams' => $upcomingExams,
    ]);
}

public function allGroups()
    {
        $groups = Group::withCount(['students', 'modules', 'exams'])
            ->with(['level', 'speciality', 'cycle'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Responsable/GroupsIndex', [
            'groups' => $groups,
        ]);
    }
    
    
}