<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HeadDepartmentController;
use App\Http\Controllers\ResponsableDashboardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\InvigilationController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ExamsPlanningController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherAlertController;
use App\Http\Controllers\TeacherSurveillanceController;
use App\Http\Controllers\TeacherExamController;
use App\Http\Controllers\TeacherModuleController;
use App\Http\Controllers\DemandeEnseignantController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\AccountsController;
use App\Http\Controllers\AcademicStructureController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Foundation\Application;

use App\Http\Controllers\Headdepartment\AccountManagementController;
use App\Http\Controllers\Responsable\ExamPlanController as ResponsableExamPlanController;
use App\Http\Controllers\Headdepartment\ExamPlanController as HeaddepartmentExamPlanController;
use App\Http\Controllers\Teacher\RequestController as TeacherReqController;
use App\Http\Controllers\Teacher\ExamPlanController as TeacherExamPlanController;
use App\Http\Controllers\Student\ExamPlanController as StudentExamPlanController;
use App\Http\Controllers\Responsable\TeacherRequestController as ResponsableTeacherRequestController;

// PUBLIC ROUTES
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => true,
        'canRegister' => false, // Désactivé l'inscription
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
                ->name('login');
});

Route::post('login', [AuthenticatedSessionController::class, 'store'])
    ->name('login.store');

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');

Route::get('/forgot-password', [AuthenticatedSessionController::class, 'request'])
    ->name('password.request');

Route::post('forgot-password', [AuthenticatedSessionController::class, 'email'])
    ->name('password.email');

Route::put('reset-password/{token}', [AuthenticatedSessionController::class, 'update'])
    ->name('password.update');

Route::get('/reset-password/{token}', [AuthenticatedSessionController::class, 'edit'])
    ->name('password.edit');

// PROTECTED ROUTES
Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Universal dashboard route - redirects based on user role
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if (!$user) {
            return redirect()->route('login');
        }
        
        switch ($user->role) {
            case 'headdepartment':
                return redirect()->route('headdepartment.dashboard');
            case 'responsable':
                return redirect()->route('responsable.dashboard');
            case 'teacher':
                return redirect()->route('teacher.dashboard');
            case 'student':
                return redirect()->route('student.dashboard');
            default:
                return redirect()->route('login');
        }
    })->name('dashboard');

    // Dashboard routes by role
    Route::get('/HeadDepartment/Dashboard', [HeadDepartmentController::class, 'index'])
        ->name('headdepartment.dashboard');
    Route::get('/Responsable/Dashboard', [ResponsableDashboardController::class, 'index'])
        ->name('responsable.dashboard');
    Route::get('/Teacher/Dashboard', [TeacherController::class, 'index'])
        ->name('teacher.dashboard');
    Route::get('/Student/Dashboard', [StudentController::class, 'index'])
        ->name('student.dashboard');

    // Student routes
    Route::get('/Student/MyExams', [StudentController::class, 'myExams'])->name('student.my_exams');
    Route::get('/Student/Calendar', [StudentController::class, 'calendar'])->name('student.calendar');

    // Teacher routes
    Route::get('/Teacher/Surveillance', [TeacherController::class, 'surveillance'])
        ->name('teacher.surveillance');
    Route::get('/Teacher/Exams', [TeacherController::class, 'exams'])
        ->name('teacher.exams');
    Route::get('/Teacher/Modules', [TeacherController::class, 'modules'])
        ->name('teacher.modules');
    Route::get('/Teacher/RequestsAlerts', [TeacherController::class, 'requestsAlerts'])
        ->name('teacher.requests_alerts');

    // Head Department routes
    Route::get('/headdepartment/account_management/management', [UserManagementController::class, 'index'])
        ->name('headdepartment.management');
    Route::get('/headdepartment/exams-planing', [ExamsPlanningController::class, 'index'])
        ->name('headdepartment.exams_planing');
    Route::get('/headdepartment/exams', [ExamController::class, 'index'])
        ->name('headdepartment.exams');
    Route::post('/headdepartment/exams', [ExamController::class, 'store'])
        ->name('headdepartment.exams.store');
    Route::put('/headdepartment/exams/{exam}', [ExamController::class, 'update'])
        ->name('headdepartment.exams.update');
    Route::delete('/headdepartment/exams/{exam}', [ExamController::class, 'destroy'])
        ->name('headdepartment.exams.destroy');
    Route::get('/headdepartment/teacher-requests', [\App\Http\Controllers\Headdepartment\TeacherRequestController::class, 'index'])
        ->name('headdepartment.teacher_requests');
    Route::put('/headdepartment/teacher-requests/{teacherRequest}', [\App\Http\Controllers\Headdepartment\TeacherRequestController::class, 'update'])
        ->name('headdepartment.teacher_requests.update');
    Route::delete('/headdepartment/teacher-requests/{teacherRequest}', [\App\Http\Controllers\Headdepartment\TeacherRequestController::class, 'destroy'])
        ->name('headdepartment.teacher_requests.destroy');
    Route::get('/headdepartment/modules', [ModuleController::class, 'index'])
        ->name('headdepartment.modules');
    Route::post('/headdepartment/modules', [ModuleController::class, 'store'])
        ->name('headdepartment.modules.store');
    Route::put('/headdepartment/modules/{module}', [ModuleController::class, 'update'])
        ->name('headdepartment.modules.update');
    Route::delete('/headdepartment/modules/{module}', [ModuleController::class, 'destroy'])
        ->name('headdepartment.modules.destroy');
    Route::get('/headdepartment/salles', fn()=>Inertia::render('headdepartment/salles'))
        ->name('headdepartment.salles');
    Route::get('/headdepartment/notifications', fn()=>Inertia::render('headdepartment/notifications'))
        ->name('headdepartment.notifications');

    // Responsable routes
    Route::get('/Responsable/GroupsIndex', function () {
        return Inertia::render('Responsable/GroupsIndex');
    })->name('responsable.groups');

    Route::get('/Responsable/Exams/Index', [\App\Http\Controllers\Headdepartment\ExamController::class, 'index'])
        ->name('responsable.exams');
    Route::get('/Responsable/Exams/Create', [\App\Http\Controllers\Headdepartment\ExamController::class, 'create'])
        ->name('responsable.exams.create');
    Route::post('/Responsable/Exams', [\App\Http\Controllers\Headdepartment\ExamController::class, 'store'])
        ->name('responsable.exams.store');
    Route::get('/Responsable/Exams/{exam}', [\App\Http\Controllers\Headdepartment\ExamController::class, 'show'])
        ->name('responsable.exams.show');
    Route::put('/Responsable/Exams/{exam}', [\App\Http\Controllers\Headdepartment\ExamController::class, 'update'])
        ->name('responsable.exams.update');
    Route::delete('/Responsable/Exams/{exam}', [\App\Http\Controllers\Headdepartment\ExamController::class, 'destroy'])
        ->name('responsable.exams.destroy');

    Route::get('/Responsable/Invigilation', [InvigilationController::class, 'index'])
        ->name('responsable.invigilation');
    
    Route::get('/Responsable/TeacherRequests', [ResponsableTeacherRequestController::class, 'index'])
        ->name('responsable.teacher_requests');
    Route::put('/Responsable/TeacherRequests/{teacherRequest}', [ResponsableTeacherRequestController::class, 'update'])
        ->name('responsable.teacher_requests.update');
    Route::delete('/Responsable/TeacherRequests/{teacherRequest}', [ResponsableTeacherRequestController::class, 'destroy'])
        ->name('responsable.teacher_requests.destroy');
    
    Route::get('/Responsable/PlanningCalendar', function () {
        return Inertia::render('Responsable/PlanningCalendar');
    })->name('responsable.planning.calendar');
    
    Route::get('/Responsable/SessionPlanning', function () {
        return Inertia::render('Responsable/SessionPlanning');
    })->name('responsable.session.planning');

    // Exam Plan routes - Responsable (Create, Read, Update, Delete)
    Route::prefix('responsable/exam-plans')->group(function () {
        Route::get('/', [ResponsableExamPlanController::class, 'index'])->name('responsable.exam-plans.index');
        Route::get('/create', [ResponsableExamPlanController::class, 'create'])->name('responsable.exam-plans.create');
        Route::post('/', [ResponsableExamPlanController::class, 'store'])->name('responsable.exam-plans.store');
        Route::get('/{examPlan}', [ResponsableExamPlanController::class, 'show'])->name('responsable.exam-plans.show');
        Route::get('/{examPlan}/edit', [ResponsableExamPlanController::class, 'edit'])->name('responsable.exam-plans.edit');
        Route::put('/{examPlan}', [ResponsableExamPlanController::class, 'update'])->name('responsable.exam-plans.update');
        Route::delete('/{examPlan}', [ResponsableExamPlanController::class, 'destroy'])->name('responsable.exam-plans.destroy');
    });
    
    // Exam Plan routes - Headdepartment (Validate, Read)
    Route::prefix('headdepartment/exam-plans')->group(function () {
        Route::get('/', [HeaddepartmentExamPlanController::class, 'index'])->name('headdepartment.exam-plans.index');
        Route::get('/{examPlan}', [HeaddepartmentExamPlanController::class, 'show'])->name('headdepartment.exam-plans.show');
        Route::post('/{examPlan}/validate', [HeaddepartmentExamPlanController::class, 'validateExamPlan'])->name('headdepartment.exam-plans.validate');
        Route::get('/all', [HeaddepartmentExamPlanController::class, 'all'])->name('headdepartment.exam-plans.all');
    });
    
    // Exam Plan routes - Teacher (Consult)
    Route::prefix('teacher/exam-plans')->group(function () {
        Route::get('/', [TeacherExamPlanController::class, 'index'])->name('teacher.exam-plans.index');
        Route::get('/{examPlan}', [TeacherExamPlanController::class, 'show'])->name('teacher.exam-plans.show');
    });
    
    // Exam Plan routes - Student (Consult)
    Route::prefix('student/exam-plans')->group(function () {
        Route::get('/', [StudentExamPlanController::class, 'index'])->name('student.exam-plans.index');
        Route::get('/{examPlan}', [StudentExamPlanController::class, 'show'])->name('student.exam-plans.show');
    });
    
    // Teacher Request routes
    Route::prefix('teacher/requests')->group(function () {
        Route::get('/', [TeacherReqController::class, 'index'])->name('teacher.requests.index');
        Route::get('/create', [TeacherReqController::class, 'create'])->name('teacher.requests.create');
        Route::post('/', [TeacherReqController::class, 'store'])->name('teacher.requests.store');
        Route::get('/{request}', [TeacherReqController::class, 'show'])->name('teacher.requests.show');
    });
    
    // Report routes
    Route::get('/headdepartment/report', [\App\Http\Controllers\ReportController::class, 'headdepartment'])
        ->name('headdepartment.report');
    Route::get('/Responsable/Report', [\App\Http\Controllers\ReportController::class, 'responsable'])
        ->name('responsable.report');
    Route::get('/Teacher/Report', [\App\Http\Controllers\ReportController::class, 'teacher'])
        ->name('teacher.report');
    Route::get('/Student/Report', [\App\Http\Controllers\ReportController::class, 'student'])
        ->name('student.report');
});

require __DIR__.'/auth.php';
