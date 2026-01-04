<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
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

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'matricule' => ['required', 'string'],
            'password'  => ['required', 'string'],
        ]);

        if (! Auth::attempt([
            'matricule' => $request->matricule,
            'password'  => $request->password,
        ], $request->boolean('remember'))) {
            return back()->withErrors([
                'matricule' => 'Matricule ou mot de passe incorrect.',
            ]);
        }

        $request->session()->regenerate();
        $user = Auth::user();

        // Redirection selon le rôle
        switch($user->role) {
            case 'student':
                return redirect()->route('student.dashboard');
            case 'teacher':
                return redirect()->route('teacher.dashboard');
            case 'responsable':
                return redirect()->route('responsable.dashboard');
            case 'headdepartment':
            case 'head_department':
                return redirect()->route('headdepartment.dashboard');
            default:
                return redirect('/');
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}