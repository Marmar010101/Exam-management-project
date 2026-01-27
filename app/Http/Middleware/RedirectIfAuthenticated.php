<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  string|null  ...$guards
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::user();
                
                // Rediriger selon le rôle
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
            }
        }

        return $next($request);
    }
}
