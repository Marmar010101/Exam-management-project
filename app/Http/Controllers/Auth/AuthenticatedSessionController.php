<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        // Validate matricule + password
        $request->validate([
            'matricule' => ['required', 'string'],
            'password'  => ['required', 'string'],
        ]);

        // Attempt login using matricule instead of email
        if (! Auth::attempt([
            'matricule' => $request->matricule,
            'password'  => $request->password,
        ], $request->boolean('remember'))) {

            return back()->withErrors([
                'matricule' => 'The information does not match.',
            ]);
        }

        // Regenerate session for security
        $request->session()->regenerate();

       // Get the logged-in user
        $user = Auth::user();

        
    // Redirect based on role
        if ($user->role === 'student') {
            return redirect()->route('student.dashboard');
        } elseif ($user->role === 'teacher') {
            return redirect()->route('teacher.dashboard');
        }
        elseif ($user->role === 'responsable') {
    return redirect()->route('responsable.dashboard');
} elseif ($user->role === 'headdepartment') {
    return redirect()->route('headdepartment.dashboard');
}


        // fallback
        return redirect(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
