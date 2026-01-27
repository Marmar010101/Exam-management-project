<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => false, // Désactivé
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        $user = Auth::user();

        // Rediriger vers le dashboard approprié selon le rôle
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
                return redirect()->route('dashboard');
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        \Log::info('Logout attempt for user: ' . auth()->user()?->email);
        
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        \Log::info('Logout successful, redirecting to welcome page');
        return redirect()->route('welcome');
    }
}