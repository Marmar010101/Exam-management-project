<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForceNewTabMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        
        // Ajouter des headers pour forcer les liens externes dans de nouveaux onglets
        $response->header('X-Force-New-Tab', 'true');
        $response->header('Content-Security-Policy', 'frame-ancestors "self";');
        
        return $response;
    }
}