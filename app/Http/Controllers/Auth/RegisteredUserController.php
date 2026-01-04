<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'matricule' => 'required|string|max:255|unique:'.User::class,
            'role' => 'required|in:student,teacher',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'student_id' => 'nullable|exists:students,id', 
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);

        $user = User::create([
            'matricule' => $request->matricule,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'student_id' => $request->role === 'student' ? $request->student_id : null,
            'teacher_id' => $request->role === 'teacher' ? $request->teacher_id : null,
        ]);

        event(new Registered($user));

        Auth::login($user);
        
        if ($user->role === 'student') {
            return redirect()->route('student.dashboard');
        } elseif ($user->role === 'teacher') {
            return redirect()->route('teacher.dashboard');
        }
        
        return redirect(RouteServiceProvider::HOME);
    }
}
