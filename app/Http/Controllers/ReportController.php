<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Exam;
use App\Models\Module;
use App\Models\Group;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function headdepartment()
    {
        // Statistiques générales pour le head department
        $stats = [
            'total_users' => User::count(),
            'total_students' => Student::count(),
            'total_teachers' => Teacher::count(),
            'total_exams' => Exam::count(),
            'total_modules' => Module::count(),
            'total_groups' => Group::count(),
            'total_rooms' => Room::count(),
        ];

        // Répartition par rôle
        $usersByRole = User::selectRaw('role, COUNT(*) as count')
            ->groupBy('role')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->role => $item->count];
            });

        // Examens par mois
        $examsByMonth = Exam::selectRaw('MONTH(exam_date_old) as month, COUNT(*) as count')
            ->whereYear('exam_date_old', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->mapWithKeys(function ($item) {
                $monthName = date('F', mktime(0, 0, 0, $item->month, 1));
                return [$monthName => $item->count];
            });

        // Modules par spécialité
        $modulesBySpeciality = Module::with('speciality')
            ->get()
            ->groupBy('speciality.name')
            ->map(function ($group) {
                return $group->count();
            });

        return Inertia::render('HeadDepartment/report', [
            'stats' => $stats,
            'usersByRole' => $usersByRole,
            'examsByMonth' => $examsByMonth,
            'modulesBySpeciality' => $modulesBySpeciality,
        ]);
    }

    public function responsable()
    {
        $user = auth()->user();
        
        // Statistiques pour le responsable
        $stats = [
            'total_students' => Student::count(),
            'total_groups' => Group::count(),
            'total_exams' => Exam::count(),
            'total_modules' => Module::count(),
        ];

        // Groupes avec leurs statistiques
        $groups = Group::withCount(['students', 'modules', 'exams'])
            ->with(['level', 'speciality'])
            ->get()
            ->map(function ($group) {
                return [
                    'name' => $group->name,
                    'level' => $group->level?->name,
                    'speciality' => $group->speciality?->name,
                    'students_count' => $group->students_count,
                    'modules_count' => $group->modules_count,
                    'exams_count' => $group->exams_count,
                ];
            });

        // Examens à venir
        $upcomingExams = Exam::with(['module', 'group', 'teacher'])
            ->where('exam_date_old', '>=', now())
            ->orderBy('exam_date_old')
            ->take(10)
            ->get()
            ->map(function ($exam) {
                return [
                    'module' => $exam->module?->module_name,
                    'group' => $exam->group?->name,
                    'date' => $exam->exam_date_old,
                    'time' => $exam->exam_time_old,
                    'teacher' => $exam->teacher?->first_name . ' ' . $exam->teacher?->last_name,
                ];
            });

        return Inertia::render('Responsable/Report', [
            'stats' => $stats,
            'groups' => $groups,
            'upcomingExams' => $upcomingExams,
        ]);
    }

    public function teacher()
    {
        $user = auth()->user();
        
        // Examens du professeur
        $teacherExams = Exam::with(['module', 'group'])
            ->where('teacher_id', $user->id)
            ->orderBy('exam_date_old', 'desc')
            ->get()
            ->map(function ($exam) {
                return [
                    'module' => $exam->module?->module_name,
                    'group' => $exam->group?->name,
                    'date' => $exam->exam_date_old,
                    'time' => $exam->exam_time_old,
                    'type' => $exam->exam_type,
                ];
            });

        // Modules enseignés
        $modules = Module::where('teacher_id', $user->id)->get();

        // Statistiques
        $stats = [
            'total_exams' => $teacherExams->count(),
            'total_modules' => $modules->count(),
            'upcoming_exams' => $teacherExams->where('date', '>=', now()->format('Y-m-d'))->count(),
        ];

        return Inertia::render('Teacher/Report', [
            'auth' => [
                'user' => $user
            ],
            'stats' => $stats,
            'exams' => $teacherExams,
            'modules' => $modules,
        ]);
    }

    public function student()
    {
        $user = auth()->user();
        $student = $user->student;
        
        // Group et informations de l'étudiant
        $studentInfo = Student::with(['group.level', 'group.speciality', 'group.cycle'])
            ->find($student->id);

        // Examens de l'étudiant (basé sur son groupe)
        $studentExams = Exam::with(['module', 'teacher'])
            ->where('group_id', $student->group_id)
            ->orderBy('exam_date_old', 'desc')
            ->get()
            ->map(function ($exam) {
                return [
                    'module' => $exam->module?->module_name,
                    'date' => $exam->exam_date_old,
                    'time' => $exam->exam_time_old,
                    'type' => $exam->exam_type,
                    'teacher' => $exam->teacher?->first_name . ' ' . $exam->teacher?->last_name,
                ];
            });

        // Modules de l'étudiant
        $modules = $studentInfo->group->modules ?? collect();

        // Statistiques
        $stats = [
            'total_exams' => $studentExams->count(),
            'total_modules' => $modules->count(),
            'upcoming_exams' => $studentExams->where('date', '>=', now()->format('Y-m-d'))->count(),
            'completed_exams' => $studentExams->where('date', '<', now()->format('Y-m-d'))->count(),
        ];

        return Inertia::render('Student/Report', [
            'stats' => $stats,
            'studentInfo' => $studentInfo,
            'exams' => $studentExams,
            'modules' => $modules,
        ]);
    }
}
