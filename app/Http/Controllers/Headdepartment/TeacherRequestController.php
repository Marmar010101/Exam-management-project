<?php

namespace App\Http\Controllers\Headdepartment;

use App\Http\Controllers\Controller;
use App\Models\TeacherRequest;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherRequestController extends Controller
{
    /**
     * Display teacher requests management page.
     */
    public function index(): Response
    {
        $requests = TeacherRequest::with(['teacher.user', 'module'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'teacher_name' => $request->teacher->first_name . ' ' . $request->teacher->last_name,
                    'teacher_email' => $request->teacher->user->email,
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

        // Statistics
        $stats = [
            'total_requests' => $requests->count(),
            'pending_requests' => $requests->where('status', 'pending')->count(),
            'approved_requests' => $requests->where('status', 'approved')->count(),
            'rejected_requests' => $requests->where('status', 'rejected')->count(),
        ];

        return Inertia::render('Responsable/TeacherRequests', [
            'requests' => $requests,
            'stats' => $stats,
        ]);
    }

    /**
     * Update request status.
     */
    public function updateStatus(Request $request, TeacherRequest $teacherRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'reason' => 'nullable|string|max:500',
        ]);

        $teacherRequest->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['reason'] ?? null,
            'processed_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Request status updated successfully.');
    }

    /**
     * Delete a request.
     */
    public function destroy(TeacherRequest $teacherRequest)
    {
        $teacherRequest->delete();

        return redirect()->back()
            ->with('success', 'Request deleted successfully.');
    }
}
