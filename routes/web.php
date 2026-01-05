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
use App\Http\Controllers\TeacherRequestController;
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
use App\Http\Controllers\Teacher\ExamPlanController as TeacherExamPlanController;
use App\Http\Controllers\Student\ExamPlanController as StudentExamPlanController;

// PUBLIC ROUTES
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => true,
        'canRegister' => false, // Désactivé l'inscription
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// AUTH ROUTES
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// PROTECTED ROUTES
Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Dashboard routes by role
    Route::get('/headdepartment/Dashboard', [HeadDepartmentController::class, 'index'])
        ->name('headdepartment.dashboard');
    
    Route::get('/Responsable/Dashboard', [ResponsableDashboardController::class, 'index'])
        ->name('responsable.dashboard');
    
    Route::get('/Student/Dashboard', [StudentController::class, 'dashboard'])
        ->name('student.dashboard');
    
    Route::get('/Teacher/Dashboard', function () {
        return Inertia::render('Teacher/Dashboard');
    })->name('teacher.dashboard');

    // Student routes
    Route::get('/Student/MyExams', [StudentController::class, 'myExams'])->name('student.my_exams');
    Route::get('/Student/Calendar', [StudentController::class, 'calendar'])->name('student.calendar');

    // Teacher routes
    Route::get('/Teacher/requests', [TeacherRequestController::class, 'index'])->name('teacher.requests');
    Route::post('/Teacher/requests', [TeacherRequestController::class, 'store'])->name('teacher.requests.store');
    Route::put('/Teacher/requests/{teacherRequest}', [TeacherRequestController::class, 'update'])->name('teacher.requests.update');
    Route::delete('/Teacher/requests/{teacherRequest}', [TeacherRequestController::class, 'destroy'])->name('teacher.requests.destroy');
    Route::get('/Teacher/alerts', [TeacherAlertController::class, 'index'])->name('teacher.alerts');
    Route::post('/Teacher/alerts', [TeacherAlertController::class, 'store'])->name('teacher.alerts.store');
    Route::get('/Teacher/surveillance', [TeacherSurveillanceController::class, 'index'])->name('teacher.surveillance');
    Route::get('/Teacher/exams', [TeacherExamController::class, 'index'])->name('teacher.exams');
    Route::get('/Teacher/modules', [TeacherModuleController::class, 'index'])->name('teacher.modules');
    Route::get('/Teacher/requests_alerts', fn()=>Inertia::render('Teacher/requests_alerts'))->name('teacher.requests_alerts');

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
    Route::get('/headdepartment/teacher-requests', [TeacherRequestController::class, 'headDepartmentIndex'])
        ->name('headdepartment.teacher_requests');
    Route::put('/headdepartment/teacher-requests/{teacherRequest}', [TeacherRequestController::class, 'update'])
        ->name('headdepartment.teacher_requests.update');
    Route::delete('/headdepartment/teacher-requests/{teacherRequest}', [TeacherRequestController::class, 'destroy'])
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

    // Student routes
    Route::get('/Student/Dashboard', [StudentController::class, 'index'])
        ->name('student.dashboard');
    Route::get('/Student/MyExams', [StudentController::class, 'myExams'])
        ->name('student.my_exams');
    Route::get('/Student/Calendar', [StudentController::class, 'calendar'])
        ->name('student.calendar');

    // Teacher routes
    Route::get('/Teacher/Dashboard', [TeacherController::class, 'index'])
        ->name('teacher.dashboard');
    Route::get('/Teacher/Surveillance', [TeacherController::class, 'surveillance'])
        ->name('teacher.surveillance');
    Route::get('/Teacher/Exams', [TeacherController::class, 'exams'])
        ->name('teacher.exams');
    Route::get('/Teacher/Modules', [TeacherController::class, 'modules'])
        ->name('teacher.modules');
    Route::get('/Teacher/RequestsAlerts', [TeacherController::class, 'requestsAlerts'])
        ->name('teacher.requests_alerts');

    // Responsable routes
    Route::get('/Responsable/Dashboard', function () {
        return Inertia::render('Responsable/Dashboard');
    })->name('responsable.dashboard');

    Route::get('/Responsable/GroupsIndex', function () {
        return Inertia::render('Responsable/GroupsIndex');
    })->name('responsable.groups');

    Route::get('Responsable/Exams/Index', [\App\Http\Controllers\Headdepartment\ExamController::class, 'index'])
        ->name('responsable.exams');

    Route::get('/Responsable/Exams/Create', [\App\Http\Controllers\Headdepartment\ExamController::class, 'create'])
        ->name('responsable.exams.create');

    Route::post('/Responsable/Exams', [\App\Http\Controllers\Headdepartment\ExamController::class, 'store'])
        ->name('responsable.exams.store');

    Route::get('/Responsable/Exams/{exam}', [\App\Http\Controllers\Headdepartment\ExamController::class, 'show'])
        ->name('responsable.exams.show');

    Route::get('/Responsable/Exams/{exam}/edit', [\App\Http\Controllers\Headdepartment\ExamController::class, 'edit'])
        ->name('responsable.exams.edit');

    Route::put('/Responsable/Exams/{exam}', [\App\Http\Controllers\Headdepartment\ExamController::class, 'update'])
        ->name('responsable.exams.update');

    Route::delete('/Responsable/Exams/{exam}', [\App\Http\Controllers\Headdepartment\ExamController::class, 'destroy'])
        ->name('responsable.exams.destroy');

    Route::get('/Responsable/Invigilation', [InvigilationController::class, 'index'])
        ->name('responsable.invigilation');
    
    Route::get('/Responsable/TeacherRequests', [\App\Http\Controllers\Headdepartment\TeacherRequestController::class, 'index'])
        ->name('responsable.teacher_requests');
    
    // Invigilation management routes
    Route::prefix('invigilation')->group(function () {
        Route::get('/', [InvigilationController::class, 'index'])->name('invigilation.index');
        Route::post('/auto-assign', [InvigilationController::class, 'autoAssign'])->name('invigilation.auto-assign');
        Route::post('/manual-assign', [InvigilationController::class, 'manualAssign'])->name('invigilation.manual-assign');
        Route::delete('/{id}', [InvigilationController::class, 'destroy'])->name('invigilation.destroy');
        Route::post('/notify', [InvigilationController::class, 'notifyTeacher'])->name('invigilation.notify');
        Route::post('/send-emails', [InvigilationController::class, 'sendEmails'])->name('invigilation.send-emails');
        Route::get('/download/{type}', [InvigilationController::class, 'downloadSchedule'])->name('invigilation.download');
        Route::get('/exam/{exam}/print', [InvigilationController::class, 'printExamSchedule'])->name('invigilation.print-exam');
    });
    
    Route::get('/Responsable/Calendars', [CalendarController::class, 'index'])
        ->name('responsable.calendars');
    
    // Calendar management routes
    Route::get('/calendars', [CalendarController::class, 'index'])->name('calendars.index');
    Route::get('/calendars/export-pdf', [CalendarController::class, 'exportPdf'])->name('calendars.export.pdf');
    Route::get('/calendars/export-group-pdf/{group}', [CalendarController::class, 'exportGroupCalendarPdf'])->name('calendars.export.group.pdf');
    
    Route::get('/Responsable/Notifications', [NotificationController::class, 'index'])
        ->name('responsable.notifications');
    
    // Notification management routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::get('/api/notifications/count', [NotificationController::class, 'getUnreadCount'])->name('notifications.count');
    Route::get('/api/notifications/recent', [NotificationController::class, 'getRecent'])->name('notifications.recent');
    
    Route::get('/Responsable/GroupsIndex', [ResponsableDashboardController::class, 'allGroups'])
        ->name('responsable.groups.index');
    
    Route::get('/Responsable/PlanningCalendar', function () {
        return Inertia::render('Responsable/PlanningCalendar');
    })->name('responsable.planning.calendar');
    
    Route::get('/Responsable/SessionPlanning', function () {
        return Inertia::render('Responsable/SessionPlanning');
    })->name('responsable.session.planning');
    
    // Session planning routes
    Route::get('/responsable/session-planning/{group}', [SessionPlanningController::class, 'create'])
        ->name('session.planning.create');
    Route::post('/responsable/session-planning', [SessionPlanningController::class, 'store'])
        ->name('session.planning.store');
    Route::get('/groups/{group}/planning-calendar', [SessionPlanningController::class, 'showCalendar'])
        ->name('planning.calendar');

    // Exam routes with additional functionality
    Route::post('/exams/check-availability', [ExamController::class, 'checkAvailability'])->name('exams.check-availability');
    Route::post('/exams/suggest-rooms', [ExamController::class, 'suggestRooms'])->name('exams.suggest-rooms');
    Route::post('/exams/suggest-teachers', [ExamController::class, 'suggestTeachers'])->name('exams.suggest-teachers');
    
    Route::get('/session/planning/create/{group}', function ($group) {
        return Inertia::render('Responsable/SessionPlanning', ['groupId' => $group]);
    })->name('session.planning.create');
    
    Route::get('/groups/create', function () {
        return Inertia::render('Responsable/Groups/Create');
    })->name('groups.create');

    // Room management routes
    Route::get('/salles', [RoomController::class, 'index'])->name('rooms.index');
    Route::post('/salles', [RoomController::class, 'store'])->name('rooms.store');
    Route::put('/salles/{room}', [RoomController::class, 'update'])->name('rooms.update');
    Route::delete('/salles/{room}', [RoomController::class, 'destroy'])->name('rooms.destroy');

    // Module management routes
    Route::get('/modules', [ModuleController::class, 'index'])->name('modules.index');
    Route::post('/modules', [ModuleController::class, 'store'])->name('modules.store');
    Route::put('/modules/{module}', [ModuleController::class, 'update'])->name('modules.update');
    Route::delete('/modules/{module}', [ModuleController::class, 'destroy'])->name('modules.destroy');

    // API routes
    Route::get('/api/academic/structure', [AcademicStructureController::class, 'getAcademicStructure']);
    Route::get('/api/academic/system/{systemId}/levels', [AcademicStructureController::class, 'getLevelsBySystem']);
    Route::get('/api/academic/levels/{levelId}/semesters', [AcademicStructureController::class, 'getSemestersByLevel']);
    Route::get('/api/academic/levels/{levelId}/specialities', [AcademicStructureController::class, 'getSpecialitiesByLevel']);
    Route::get('/api/academic/levels/all', [AcademicStructureController::class, 'getAllLevels']);
    Route::get('/api/academic/specialities/all', [AcademicStructureController::class, 'getAllSpecialities']);

    // Report routes
    Route::get('/Headdepartment/Report', [\App\Http\Controllers\ReportController::class, 'headdepartment'])
        ->name('headdepartment.report');
    
    Route::get('/Responsable/Report', [\App\Http\Controllers\ReportController::class, 'responsable'])
        ->name('responsable.report');
    
    // Exam Plan routes - Responsable (Create, Manage)
    Route::prefix('responsable/exam-plans')->group(function () {
        Route::get('/', [ResponsableExamPlanController::class, 'index'])->name('responsable.exam-plans.index');
        Route::get('/create', [ResponsableExamPlanController::class, 'create'])->name('responsable.exam-plans.create');
        Route::post('/', [ResponsableExamPlanController::class, 'store'])->name('responsable.exam-plans.store');
        Route::get('/{examPlan}', [ResponsableExamPlanController::class, 'show'])->name('responsable.exam-plans.show');
        Route::get('/{examPlan}/edit', [ResponsableExamPlanController::class, 'edit'])->name('responsable.exam-plans.edit');
        Route::put('/{examPlan}', [ResponsableExamPlanController::class, 'update'])->name('responsable.exam-plans.update');
        Route::delete('/{examPlan}', [ResponsableExamPlanController::class, 'destroy'])->name('responsable.exam-plans.destroy');
    });
    
    // Exam Plan routes - Headdepartment (Validate)
    Route::prefix('headdepartment/exam-plans')->group(function () {
        Route::get('/', [HeaddepartmentExamPlanController::class, 'index'])->name('headdepartment.exam-plans.index');
        Route::get('/{examPlan}', [HeaddepartmentExamPlanController::class, 'show'])->name('headdepartment.exam-plans.show');
        Route::post('/{examPlan}/validate', [HeaddepartmentExamPlanController::class, 'validate'])->name('headdepartment.exam-plans.validate');
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
    
    Route::get('/Teacher/Report', [\App\Http\Controllers\ReportController::class, 'teacher'])
        ->name('teacher.report');
    
    Route::get('/Student/Report', [\App\Http\Controllers\ReportController::class, 'student'])
        ->name('student.report');
});
