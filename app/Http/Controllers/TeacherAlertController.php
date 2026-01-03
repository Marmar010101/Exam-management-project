<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherAlertController extends Controller
{
    /**
     * Display teacher alerts page
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get all alerts (for now, all teachers can see all alerts)
        $alerts = DB::table('teacher_alerts')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($alert) {
                return [
                    'id' => $alert->id,
                    'title' => $alert->title,
                    'message' => $alert->message,
                    'type' => $alert->type,
                    'priority' => $alert->priority,
                    'sender' => $alert->sender,
                    'created_at' => $alert->created_at,
                ];
            });

        return Inertia::render('Teacher/alerts', [
            'alerts' => $alerts,
            'user' => $user
        ]);
    }

    /**
     * Store a new alert
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,warning,urgent',
            'priority' => 'required|in:low,normal,high',
        ]);

        DB::table('teacher_alerts')->insert([
            'title' => $validated['title'],
            'message' => $validated['message'],
            'type' => $validated['type'],
            'priority' => $validated['priority'],
            'sender' => Auth::user()->first_name . ' ' . Auth::user()->last_name,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Alerte créée avec succès!');
    }
}
