<?php

namespace App\Http\Controllers;

use App\Models\TeacherRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherRequestController extends Controller
{
    /**
     * Display teacher requests page (for submitting new requests)
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get teacher's requests
        $requests = TeacherRequest::where('user_id', $user->id)
            ->with('module')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get teacher's modules for dropdown
        $modules = $user->teacher ? $user->teacher->modules : collect();

        return Inertia::render('Teacher/requests', [
            'requests' => $requests,
            'modules' => $modules,
            'user' => $user
        ]);
    }

    /**
     * Store a new teacher request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:absence,delay_date,delay_duration,other',
            'module_id' => 'nullable|exists:modules,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'date' => 'nullable|date',
            'time' => 'nullable|string',
            'room' => 'nullable|string|max:50',
            'new_date' => 'nullable|date|required_if:type,delay_date',
            'new_duration' => 'nullable|string|required_if:type,delay_duration',
            'urgency' => 'required|in:low,normal,high',
        ]);

        $teacherRequest = TeacherRequest::create([
            'user_id' => Auth::id(),
            'type' => $validated['type'],
            'module_id' => $validated['module_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'date' => $validated['date'] ?? null,
            'time' => $validated['time'] ?? null,
            'room' => $validated['room'] ?? null,
            'new_date' => $validated['new_date'] ?? null,
            'new_duration' => $validated['new_duration'] ?? null,
            'urgency' => $validated['urgency'],
            'status' => 'pending',
        ]);

        return redirect()->route('teacher.requests')
            ->with('success', 'Demande soumise avec succès!');
    }

    /**
     * Display requests for Head Department (for management)
     */
    public function headDepartmentIndex()
    {
        $requests = TeacherRequest::with(['user', 'module'])
            ->orderBy('urgency', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('headdepartment/teacher_requests', [
            'requests' => $requests
        ]);
    }

    /**
     * Update request status (for Head Department)
     */
    public function update(Request $request, TeacherRequest $teacherRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'admin_notes' => 'nullable|string|max:500'
        ]);

        $teacherRequest->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? null,
            'response_date' => now()
        ]);

        return redirect()->back()
            ->with('success', 'Statut de la demande mis à jour!');
    }

    /**
     * Store a new alert
     */
    public function storeAlert(Request $request)
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

    /**
     * Delete a request
     */
    public function destroy(TeacherRequest $teacherRequest)
    {
        // Only allow deletion of own requests or by Head Department
        if ($teacherRequest->user_id !== Auth::id() && !Auth::user()->hasRole('headdepartment')) {
            abort(403);
        }

        $teacherRequest->delete();

        return redirect()->back()
            ->with('success', 'Demande supprimée!');
    }
}
