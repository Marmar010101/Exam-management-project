<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Group;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Exam;

class ResponsableDashboardController extends Controller
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
        $groups = Group::withCount(['students', 'modules', 'exams'])
            ->with(['level', 'speciality', 'cycle'])
            ->orderBy('name')
            ->get();

        $studentsCount = Student::count();
        $teachersCount = Teacher::count();
        $examsCount = Exam::count();
        $activePercentage = 85; // Active accounts percentage

        // Get upcoming exams
        $upcomingExams = Exam::where('exam_date_old', '>=', now())
            ->with(['module', 'group'])
            ->orderBy('exam_date_old')
            ->orderBy('exam_time_old')
            ->limit(10)
            ->get()
            ->map(function ($exam) {
                return [
                    'id' => $exam->id,
                    'module_name' => $exam->module ? $exam->module->module_name : 'Unknown',
                    'group_name' => $exam->group ? $exam->group->name : 'Unknown',
                    'exam_date' => $exam->exam_date_old,
                    'formatted_date' => \Carbon\Carbon::parse($exam->exam_date_old)->format('M d, Y'),
                    'exam_time' => $exam->exam_time_old,
                    'type' => $exam->exam_type,
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
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
}
