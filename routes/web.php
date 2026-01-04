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
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

// AUTH ROUTES
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.submit');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// PROTECTED ROUTES
Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Student Dashboard
    Route::get('/student/dashboard', [StudentController::class, 'dashboard'])->name('student.dashboard');
    Route::get('/Student/MyExams', [StudentController::class, 'myExams'])->name('student.my_exams');
    Route::get('/Student/Calendar', [StudentController::class, 'calendar'])->name('student.calendar');

    // Teacher Dashboard
    Route::get('/teacher/dashboard', function () {
        return Inertia::render('Teacher/Dashboard');
    })->name('teacher.dashboard');

    // Head Department Dashboard
    Route::get('/headdepartment/dashboard', [HeadDepartmentController::class, 'index'])
        ->name('headdepartment.dashboard');

    // Responsable Dashboard
    Route::get('/Responsable/Dashboard', [ResponsableDashboardController::class, 'index'])
        ->name('responsable.dashboard');

    // Responsable Routes - selon la sidebar
    Route::get('/Responsable/ExamPlans', function () {
        return Inertia::render('Responsable/Exams/Index');
    })->name('responsable.exam_plans');
    
    Route::get('/Responsable/Exams', function () {
        return Inertia::render('Responsable/Exams/Index');
    })->name('responsable.exams');
    
    Route::get('/Responsable/Invigilation', [InvigilationController::class, 'index'])
        ->name('responsable.invigilation');
    
    Route::get('/Responsable/Calendars', [CalendarController::class, 'index'])
        ->name('calendars.index');

    // Exam Routes (générales)
    Route::get('/exams', [ExamController::class, 'index'])->name('exams.index');
    Route::get('/exams/create', [ExamController::class, 'create'])->name('exams.create');
    Route::post('/exams', [ExamController::class, 'store'])->name('exams.store');
    Route::get('/exams/{exam}/edit', [ExamController::class, 'edit'])->name('exams.edit');
    Route::put('/exams/{exam}', [ExamController::class, 'update'])->name('exams.update');
    Route::delete('/exams/{exam}', [ExamController::class, 'destroy'])->name('exams.destroy');
    Route::get('/exams/{exam}', [ExamController::class, 'show'])->name('exams.show');

    // API Routes
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
});

require __DIR__.'/auth.php';
