<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HeadDepartmentController;
use App\Http\Controllers\ResponsableDashboardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\Headdepartment\ExamController as HeadDepartmentExamController;
use App\Http\Controllers\InvigilationController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherAlertController;
use App\Http\Controllers\TeacherSurveillanceController;
use App\Http\Controllers\TeacherExamController;
use App\Http\Controllers\TeacherModuleController;
use App\Http\Controllers\DemandeEnseignantController;
use App\Http\Controllers\AdvancedModuleController;
use App\Http\Controllers\FacultyScheduleController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\AccountsController;
use App\Http\Controllers\AcademicStructureController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Foundation\Application;

use App\Http\Controllers\Headdepartment\AccountManagementController;
use App\Http\Controllers\Responsable\ExamPlanController as ResponsableExamPlanController;
use App\Http\Controllers\Headdepartment\ExamPlanController as HeaddepartmentExamPlanController;
use App\Http\Controllers\Student\ExamPlanController as StudentExamPlanController;
use App\Http\Controllers\Responsable\TeacherRequestController as ResponsableTeacherRequestController;
use App\Http\Controllers\Responsable\ExamScheduleController;

// PUBLIC ROUTES
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => true,
        'canRegister' => false, // Désactivé l'inscription
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// AUTH ROUTES (accessible par tout le monde)
Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->name('login');

Route::get('/test-login', function() {
    return 'Login test page - this works!';
})->name('test.login');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->name('login.store');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');

// PROTECTED ROUTES
Route::middleware('auth')->group(function () {
    // Redirection selon le rôle pour la racine (après authentification)
    Route::get('/home', function () {
        $user = auth()->user();
        switch ($user->role) {
            case 'headdepartment':
            case 'head_department':
                return redirect()->route('headdepartment.dashboard');
            case 'responsable':
                return redirect()->route('responsable.dashboard');
            case 'teacher':
                return redirect()->route('teacher.dashboard');
            case 'student':
                return redirect()->route('student.dashboard');
            default:
                return redirect()->route('profile.edit');
        }
    })->name('home');
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::patch('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Universal dashboard route - redirects to profile page
    Route::get('/dashboard', function () {
        return redirect()->route('profile.edit');
    })->name('dashboard');

    // Dashboard routes by role
    Route::get('/HeadDepartment/Dashboard', [HeadDepartmentController::class, 'index'])
        ->name('headdepartment.dashboard');
    Route::get('/Responsable/Dashboard', [ResponsableDashboardController::class, 'index'])
        ->name('responsable.dashboard');
    Route::post('/Responsable/Dashboard', [ResponsableDashboardController::class, 'index'])
        ->name('responsable.dashboard.post');
    Route::get('/Teacher/Dashboard', [TeacherController::class, 'index'])
        ->name('teacher.dashboard');
    Route::get('/Student/Dashboard', [StudentController::class, 'index'])
        ->name('student.dashboard');

    // Student routes
    Route::get('/Student/MyExams', [StudentController::class, 'myExams'])->name('student.my_exams');
    Route::get('/Student/Calendar', [StudentController::class, 'calendar'])->name('student.calendar');

    // Teacher routes
    Route::get('/Teacher/supervision', [TeacherController::class, 'supervision'])
        ->name('teacher.supervision');
    Route::get('/Teacher/modules', [TeacherController::class, 'modules'])
        ->name('teacher.modules');
    Route::get('/Teacher/requests_alerts', [TeacherController::class, 'requestsAlerts'])
        ->name('teacher.requests_alerts');
    Route::post('/Teacher/requests', [TeacherController::class, 'storeRequest'])
        ->name('teacher.requests.store');
    Route::get('/Teacher/Report', [\App\Http\Controllers\ReportController::class, 'teacher'])
        ->name('teacher.report');

    // Head Department routes
    Route::get('/HeadDepartment/AccountManagement/Management', [UserManagementController::class, 'index'])
        ->name('headdepartment.management');
    Route::post('/HeadDepartment/AccountManagement/Management', [UserManagementController::class, 'store'])
        ->name('headdepartment.management.store');
    Route::put('/HeadDepartment/AccountManagement/Management/{user}', [UserManagementController::class, 'update'])
        ->name('headdepartment.management.update');
    Route::delete('/HeadDepartment/AccountManagement/Management/{user}', [UserManagementController::class, 'destroy'])
        ->name('headdepartment.management.destroy');
    Route::get('/HeadDepartment/faculty-schedule', [\App\Http\Controllers\FacultyScheduleController::class, 'index'])
        ->name('headdepartment.faculty-schedule');
    Route::post('/HeadDepartment/faculty-schedule/validate', [\App\Http\Controllers\FacultyScheduleController::class, 'validateSchedule'])
        ->name('headdepartment.faculty-schedule.validate');
    Route::get('/HeadDepartment/Exams', [HeadDepartmentExamController::class, 'index'])
        ->name('headdepartment.exams.index');
    Route::put('/HeadDepartment/Exams/{exam}/validate', [HeadDepartmentExamController::class, 'validateExam'])
        ->name('headdepartment.exams.validate');
    Route::put('/HeadDepartment/Exams/{exam}/reject', [HeadDepartmentExamController::class, 'rejectExam'])
        ->name('headdepartment.exams.reject');
    Route::get('/HeadDepartment/Modules', [ModuleController::class, 'index'])
        ->name('headdepartment.modules');
    Route::post('/HeadDepartment/Modules', [ModuleController::class, 'store'])
        ->name('headdepartment.modules.store');
    Route::put('/HeadDepartment/Modules/{module}', [ModuleController::class, 'update'])
        ->name('headdepartment.modules.update');
    Route::delete('/HeadDepartment/Modules/{module}', [ModuleController::class, 'destroy'])
        ->name('headdepartment.modules.destroy');
    Route::get('/HeadDepartment/Salles', [RoomController::class, 'index'])
        ->name('headdepartment.salles');
    Route::get('/headdepartment/salles', [RoomController::class, 'index'])
        ->name('headdepartment.salles.lower');
    Route::post('/HeadDepartment/Salles', [RoomController::class, 'store'])
        ->name('headdepartment.salles.store');
    Route::put('/HeadDepartment/Salles/{room}', [RoomController::class, 'update'])
        ->name('headdepartment.salles.update');
    Route::delete('/HeadDepartment/Salles/{room}', [RoomController::class, 'destroy'])
        ->name('headdepartment.salles.destroy');
    Route::post('/rooms', [RoomController::class, 'store'])
        ->name('rooms.store');
    Route::put('/rooms/{room}', [RoomController::class, 'update'])
        ->name('rooms.update');
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy'])
        ->name('rooms.destroy');
    Route::get('/HeadDepartment/Notifications', fn()=>Inertia::render('HeadDepartment/notifications'))
        ->name('headdepartment.notifications');
    Route::get('/HeadDepartment/Report', [\App\Http\Controllers\ReportController::class, 'headdepartment'])
        ->name('headdepartment.report');
    Route::post('/HeadDepartment/Report', [\App\Http\Controllers\ReportController::class, 'headdepartment'])
        ->name('headdepartment.report.post');

    // Notifications routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.readAll');
    Route::get('/notifications/recent', [NotificationController::class, 'getRecent'])->name('notifications.recent');
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notifications.unreadCount');

    // Role-specific notification routes
    Route::get('/student/notifications', fn()=>Inertia::render('Student/Notifications'))
        ->name('student.notifications');
    Route::get('/responsable/notifications', fn()=>Inertia::render('Responsable/Notifications'))
        ->name('responsable.notifications');

    // Advanced Module Management routes
    Route::prefix('advanced-modules')->name('advanced-modules.')->group(function () {
        Route::get('/', [AdvancedModuleController::class, 'index'])->name('index');
        Route::get('/create', [AdvancedModuleController::class, 'create'])->name('create');
        Route::post('/', [AdvancedModuleController::class, 'store'])->name('store');
        Route::get('/{module}/edit', [AdvancedModuleController::class, 'edit'])->name('edit');
        Route::put('/{module}', [AdvancedModuleController::class, 'update'])->name('update');
        Route::delete('/{module}', [AdvancedModuleController::class, 'destroy'])->name('destroy');
        Route::post('/{module}/duplicate', [AdvancedModuleController::class, 'duplicate'])->name('duplicate');
        Route::get('/export/excel', [AdvancedModuleController::class, 'exportExcel'])->name('export.excel');
        Route::post('/import/excel', [AdvancedModuleController::class, 'importExcel'])->name('import.excel');
        Route::get('/{module}/pdf', [AdvancedModuleController::class, 'generatePDF'])->name('pdf');
        Route::get('/check-code', [AdvancedModuleController::class, 'checkCodeAvailability'])->name('check-code');
    });

    // Responsable routes
    Route::get('/Responsable/GroupsIndex', function () {
        return Inertia::render('Responsable/GroupsIndex');
    })->name('responsable.groups');

    Route::get('/Responsable/Exams/Index', [\App\Http\Controllers\Responsable\ExamController::class, 'index'])
        ->name('responsable.exams.index');
    Route::get('/Responsable/Exams/Create', [\App\Http\Controllers\Responsable\ExamController::class, 'create'])
        ->name('responsable.exams.create');
    Route::post('/Responsable/Exams', [\App\Http\Controllers\Responsable\ExamController::class, 'store'])
        ->name('responsable.exams.store');
    Route::get('/Responsable/Exams/{exam}/Edit', [\App\Http\Controllers\Responsable\ExamController::class, 'edit'])
        ->name('responsable.exams.edit');
    Route::put('/Responsable/Exams/{exam}', [\App\Http\Controllers\Responsable\ExamController::class, 'update'])
        ->name('responsable.exams.update');
    Route::delete('/Responsable/Exams/{exam}', [\App\Http\Controllers\Responsable\ExamController::class, 'destroy'])
        ->name('responsable.exams.destroy');

    Route::get('/Responsable/Exams', [\App\Http\Controllers\Responsable\ExamController::class, 'index'])
        ->name('responsable.exams');

    Route::get('/Responsable/Invigilation/Index', [InvigilationController::class, 'index'])
        ->name('responsable.invigilation');
    
    Route::get('/Responsable/Planning/Calendar', [InvigilationController::class, 'calendar'])
        ->name('responsable.planning.calendar');
    
    Route::get('/Responsable/TeacherRequests', [ResponsableTeacherRequestController::class, 'index'])
        ->name('responsable.teacher_requests');
    Route::put('/Responsable/TeacherRequests/{teacherRequest}', [ResponsableTeacherRequestController::class, 'update'])
        ->name('responsable.teacher_requests.update');
    Route::post('/Responsable/TeacherRequests/{teacherRequest}/process', [ResponsableTeacherRequestController::class, 'process'])
        ->name('responsable.teacher_requests.process');
    Route::delete('/Responsable/TeacherRequests/{teacherRequest}', [ResponsableTeacherRequestController::class, 'destroy'])
        ->name('responsable.teacher_requests.destroy');

    // Exam Plan routes - Responsable (Create, Read, Update, Delete)
    Route::prefix('responsable/exam-plans')->group(function () {
        Route::get('/', [ResponsableExamPlanController::class, 'index'])->name('responsable.exam-plans.index');
        Route::get('/create', [ResponsableExamPlanController::class, 'create'])->name('responsable.exam-plans.create');
        Route::post('/', [ResponsableExamPlanController::class, 'store'])->name('responsable.exam-plans.store');
        Route::post('/batch-store', [ResponsableExamPlanController::class, 'batchStore'])->name('responsable.exam-plans.batch-store');
        Route::get('/{examPlan}', [ResponsableExamPlanController::class, 'show'])->name('responsable.exam-plans.show');
        Route::get('/{examPlan}/edit', [ResponsableExamPlanController::class, 'edit'])->name('responsable.exam-plans.edit');
        Route::put('/{examPlan}', [ResponsableExamPlanController::class, 'update'])->name('responsable.exam-plans.update');
        Route::delete('/{examPlan}', [ResponsableExamPlanController::class, 'destroy'])->name('responsable.exam-plans.destroy');
        Route::post('/{examPlan}/send-to-head', [ResponsableExamPlanController::class, 'sendToHeadDepartment'])->name('responsable.exam-plans.send-to-head');
        Route::post('/send-all-to-head', [ResponsableExamPlanController::class, 'sendAllToHeadDepartment'])->name('responsable.exam-plans.send-all-to-head');
        Route::post('/batch-delete', [ResponsableExamPlanController::class, 'batchDelete'])->name('responsable.exam-plans.batch-delete');
        Route::post('/batch-send-to-head', [ResponsableExamPlanController::class, 'batchSendToHeadDepartment'])->name('responsable.exam-plans.batch-send-to-head');
        Route::get('/schedule', [ResponsableExamPlanController::class, 'schedule'])->name('responsable.exam-plans.schedule');
    });
    
    // Exam Schedule Generator routes - Automatic Planning
    Route::prefix('responsable/exam-schedule')->group(function () {
        Route::get('/create', [ExamScheduleController::class, 'create'])->name('responsable.exam-schedule.create');
        Route::post('/get-automatic-selection', [ExamScheduleController::class, 'getAutomaticSelection'])->name('responsable.exam-schedule.get-automatic-selection');
        Route::post('/generate', [ExamScheduleController::class, 'generate'])->name('responsable.exam-schedule.generate');
        Route::get('/', [ExamScheduleController::class, 'index'])->name('responsable.exam-schedule.index');
        Route::post('/validate', [ExamScheduleController::class, 'validateSchedule'])->name('responsable.exam-schedule.validate');
        Route::get('/{scheduleId}', [ExamScheduleController::class, 'show'])->name('responsable.exam-schedule.show');
    });
    
    // Exam Plan routes - Headdepartment (Validate, Read)
    Route::prefix('headdepartment/exam-plans')->group(function () {
        Route::get('/', [HeaddepartmentExamPlanController::class, 'index'])->name('headdepartment.exam-plans.index');
        Route::get('/{examPlan}', [HeaddepartmentExamPlanController::class, 'show'])->name('headdepartment.exam-plans.show');
        Route::post('/{examPlan}/validate', [HeaddepartmentExamPlanController::class, 'validateExamPlan'])->name('headdepartment.exam-plans.validate');
        Route::get('/all', [HeaddepartmentExamPlanController::class, 'all'])->name('headdepartment.exam-plans.all');
    });
    
    // Exam Plan routes - Student (Consult)
    Route::prefix('student/exam-plans')->group(function () {
        Route::get('/', [StudentExamPlanController::class, 'index'])->name('student.exam-plans.index');
        Route::get('/{examPlan}', [StudentExamPlanController::class, 'show'])->name('student.exam-plans.show');
    });
    
    // Report routes
    Route::get('/HeadDepartment/Report', [\App\Http\Controllers\ReportController::class, 'headdepartment'])
        ->name('headdepartment.report');
    Route::post('/HeadDepartment/Report', [\App\Http\Controllers\ReportController::class, 'headdepartment'])
        ->name('headdepartment.report.post');
    Route::get('/Responsable/Report', [\App\Http\Controllers\ReportController::class, 'responsable'])
        ->name('responsable.report');
    Route::get('/Teacher/Report', [\App\Http\Controllers\ReportController::class, 'teacher'])
        ->name('teacher.report');
    Route::get('/Student/Report', [\App\Http\Controllers\ReportController::class, 'student'])
        ->name('student.report');
});

require __DIR__.'/auth.php';
