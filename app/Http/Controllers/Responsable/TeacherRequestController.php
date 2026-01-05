<?php

namespace App\Http\Controllers\Responsable;

use App\Http\Controllers\Controller;
use App\Models\TeacherRequest;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (auth()->check() && !in_array(auth()->user()->role, ['responsable', 'headdepartment'])) {
                abort(403); 
            }
            return $next($request); 
        });
    }

    /**
     * Display teacher requests for responsable.
     */
    public function index()
    {
        $requests = TeacherRequest::with(['module', 'teacher.user'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'type' => $request->type,
                    'title' => $request->title,
                    'description' => $request->description,
                    'date' => $request->date,
                    'time' => $request->time,
                    'room' => $request->room,
                    'urgency' => $request->urgency,
                    'status' => $request->status,
                    'admin_notes' => $request->admin_notes,
                    'processed_at' => $request->processed_at ? $request->processed_at->format('Y-m-d H:i:s') : null,
                    'created_at' => $request->created_at->format('Y-m-d H:i:s'),
                    'module_name' => $request->module ? $request->module->module_name : 'N/A',
                    'teacher_name' => $request->teacher && $request->teacher->user ? 
                        $request->teacher->user->first_name . ' ' . $request->teacher->user->last_name : 'N/A',
                ];
            });

        return Inertia::render('Responsable/TeacherRequests', [
            'requests' => $requests,
        ]);
    }

    /**
     * Update the status of a teacher request.
     */
    public function update(Request $request, $id)
    {
        $teacherRequest = TeacherRequest::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'admin_notes' => 'nullable|string|max:500'
        ]);

        $teacherRequest->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? null,
            'processed_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Request status updated successfully.');
    }

    /**
     * Remove the specified teacher request.
     */
    public function destroy($id)
    {
        $teacherRequest = TeacherRequest::findOrFail($id);
        $teacherRequest->delete();

        return redirect()->back()
            ->with('success', 'Request deleted successfully.');
    }
}
