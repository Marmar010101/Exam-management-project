<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class RedirectToDashboard
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Si c'est une requête GET vers la racine, rediriger selon le rôle
        if ($request->isMethod('GET') && $request->path() === '/') {
            $user = Auth::user();
            
            if ($user) {
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

        return $response;
    }
}
