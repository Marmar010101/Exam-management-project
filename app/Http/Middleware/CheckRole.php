<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Debug: Log the request
        Log::info('CheckRole middleware triggered', [
            'path' => $request->path(),
            'user_id' => Auth::id(),
            'user_role' => Auth::user()->role ?? 'not-authenticated',
            'required_roles' => $roles
        ]);

        // Check if user is authenticated
        if (!Auth::check()) {
            Log::warning('User not authenticated');
            return redirect()->route('login');
        }

        // Get the authenticated user
        $user = Auth::user();
        
        Log::info('User details', [
            'user_role' => $user->role,
            'required_roles' => $roles,
            'has_role' => in_array($user->role, $roles)
        ]);

        // Check if user has one of the required roles
        if (!in_array($user->role, $roles)) {
            Log::warning('User does not have required role', [
                'user_role' => $user->role,
                'required_roles' => $roles
            ]);
            abort(403, 'Unauthorized action.');
        }

        Log::info('User passed role check');
        return $next($request);
    }
}