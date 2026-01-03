<?php

use App\Http\Controllers\ExamController;
use App\Http\Controllers\HeadDepartmentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Models\Exam;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\ResponsableDashboardController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\InvigilationController;
use App\Http\Controllers\ExamPlanningController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\SessionPlanningController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\CalendarValidationController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Student Dashboard
    Route::get('/student/dashboard', function () {
        return Inertia::render('Student/Dashboard');
    })->name('student.dashboard');

    // Teacher Dashboard
    Route::get('/teacher/dashboard', function () {
        return Inertia::render('Teacher/Dashboard');
    })->name('teacher.dashboard');

    // Head Department Dashboard
    Route::get('/headdepartment/dashboard', [HeadDepartmentController::class, 'index'])
        ->name('headdepartment.dashboard');

    // Responsable Dashboard
    Route::get('/responsable/dashboard', [ResponsableDashboardController::class, 'index'])
        ->name('responsable.dashboard');

    // Exam Routes
    Route::get('/exams', [ExamController::class, 'index'])->name('exams.index');
    Route::get('/exams/create', [ExamController::class, 'create'])->name('exams.create');
    Route::post('/exams', [ExamController::class, 'store'])->name('exams.store');
    Route::get('/exams/{exam}/edit', [ExamController::class, 'edit'])->name('exams.edit');
    Route::put('/exams/{exam}', [ExamController::class, 'update'])->name('exams.update');
    Route::delete('/exams/{exam}', [ExamController::class, 'destroy'])->name('exams.destroy');
    Route::get('/exams/{exam}', [ExamController::class, 'show'])->name('exams.show');
    Route::get('/exam-planning/{group}/create', [ExamPlanningController::class, 'create'])->name('exam-planning.create');

    // Exam Availability and Suggestions
    Route::post('/exams/check-availability', [ExamController::class, 'checkAvailability'])->name('exams.check-availability');
    Route::post('/exams/suggest-rooms', [ExamController::class, 'suggestRooms'])->name('exams.suggest-rooms');
    Route::post('/exams/suggest-teachers', [ExamController::class, 'suggestTeachers'])->name('exams.suggest-teachers');  

    // Invigilation Routes
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

    // Session Planning Routes
    Route::get('/responsable/session-planning/{group}', [SessionPlanningController::class, 'create'])
        ->name('session.planning.create');
    Route::post('/responsable/session-planning', [SessionPlanningController::class, 'store'])
        ->name('session.planning.store');
    Route::get('/groups/{group}/planning-calendar', [SessionPlanningController::class, 'showCalendar'])
        ->name('planning.calendar');

    // Groups Routes
    Route::get('/groups', [ResponsableDashboardController::class, 'allGroups'])->name('groups.index');

    // Calendar Routes
    Route::get('/calendars', [CalendarController::class, 'index'])->name('calendars.index');
    Route::get('/calendars/export-pdf', [CalendarController::class, 'exportPdf'])->name('calendars.export.pdf');
    Route::get('/calendars/export-group-pdf/{group}', [CalendarController::class, 'exportGroupCalendarPdf'])->name('calendars.export.group.pdf');

    // Notifications Routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::get('/api/notifications/count', [NotificationController::class, 'getUnreadCount'])->name('notifications.count');
    Route::get('/api/notifications/recent', [NotificationController::class, 'getRecent'])->name('notifications.recent');

    // Calendar Validation Routes
    Route::post('/calendar/{group}/send-validation', [CalendarValidationController::class, 'sendForValidation'])
        ->name('calendar.validation.send');
    Route::get('/calendar/{group}/validation-status', [CalendarValidationController::class, 'checkStatus'])
        ->name('calendar.validation.status');

    // Responsable Complaint Management Routes
    Route::middleware(['auth', 'role:responsable'])->prefix('responsable')->name('responsable.')->group(function () {
        Route::get('/teacher-complaints', [ResponsableDashboardController::class, 'teacherComplaints'])->name('teacher-complaints.index');
        Route::get('/teacher-complaints/{complaint}', [ResponsableDashboardController::class, 'showComplaint'])->name('teacher-complaints.show');
        Route::post('/teacher-complaints/{complaint}/respond', [ResponsableDashboardController::class, 'respondToComplaint'])->name('teacher-complaints.respond');
    });
});

require __DIR__.'/auth.php';
