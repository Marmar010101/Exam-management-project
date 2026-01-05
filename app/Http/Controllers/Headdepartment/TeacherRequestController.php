<?php

namespace App\Http\Controllers\Headdepartment;

use App\Http\Controllers\Controller;
use App\Models\TeacherRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (auth()->check() && auth()->user()->role !== 'headdepartment') {
                abort(403); 
            }
            return $next($request); 
        });
    }

    /**
     * Display teacher requests management page.
     */
    public function index()
    {
        $requests = TeacherRequest::with(['teacher.user', 'module'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'teacher_name' => $request->teacher ? $request->teacher->first_name . ' ' . $request->teacher->last_name : 'Unknown',
                    'teacher_email' => $request->teacher ? $request->teacher->user->email : 'N/A',
                    'module_name' => $request->module ? $request->module->module_name : 'N/A',
                    'type' => $request->type,
                    'title' => $request->title,
                    'description' => $request->description,
                    'date' => $request->date,
                    'time' => $request->time,
                    'room' => $request->room,
                    'urgency' => $request->urgency,
                    'status' => $request->status,
                    'created_at' => $request->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Headdepartment/TeacherRequests', [
            'requests' => $requests,
        ]);
    }

    /**
     * Update request status.
     */
    public function updateStatus(Request $request, $id)
    {
        $teacherRequest = TeacherRequest::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $teacherRequest->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'],
            'processed_at' => now(),
        ]);

        $message = $validated['status'] === 'approved' 
            ? 'Teacher request approved successfully.' 
            : 'Teacher request rejected.';

        return redirect()->back()
            ->with('success', $message);
    }

    /**
     * Delete a request.
     */
    public function destroy($id)
    {
        $teacherRequest = TeacherRequest::findOrFail($id);
        $teacherRequest->delete();

        return redirect()->back()
            ->with('success', 'Teacher request deleted successfully.');
    }
}
