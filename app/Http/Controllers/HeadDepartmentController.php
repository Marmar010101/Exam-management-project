<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HeadDepartmentController extends Controller
{
    // Temporairement désactivé pour le debug
    // public function __construct()
    // {
    //     $this->middleware(function ($request, $next) {
    //         // Debug information
    //         if (!auth()->check()) {
    //             \Log::info('User not authenticated');
    //             abort(401, 'Please login first');
    //         }
            
    //         $userRole = auth()->user()->role;
    //         \Log::info('User role: ' . $userRole);
            
    //         if ($userRole !== 'headdepartment') {
    //             \Log::info('Access denied for role: ' . $userRole);
    //             abort(403, 'Access denied. Role: ' . $userRole); 
    //         }
            
    //         return $next($request); 
    //     });
    // }

    public function index()
    {
      return Inertia::render('HeadDepartment/Dashboard', [
            'status' => session('status'),
        ]);
    }
}
