<?php
use App\Http\Controllers\HeadDepartmentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Foundation\Application;

use App\Http\Controllers\Headdepartment\AccountManagementController;


// PUBLIC ROUTES
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => true,
        'canRegister' => false, // Désactivé l'inscription
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});





/*
Route::get('/', function () {
    return redirect()->route('register');
});

*/
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// PROTECTED ROUTES
Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/headdepartment/dashboard', [HeadDepartmentController::class, 'index'])
        ->name('headdepartment.dashboard');
    Route::get('/student/dashboard', function () {
        return Inertia::render('Student/Dashboard');
    })->name('student.dashboard');
});

require __DIR__.'/auth.php';
