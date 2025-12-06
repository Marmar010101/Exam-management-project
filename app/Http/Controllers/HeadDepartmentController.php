<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HeadDepartmentController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (auth()->user()->role !== 'headdepartment') {
                abort(403); 
            }
            return $next($request); 
             });
    }
 
    public function index()
    {
      return Inertia::render('HeadDepartment/Dashboard', [
            'status' => session('status'),
        ]);
    }
}
