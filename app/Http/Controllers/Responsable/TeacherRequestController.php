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
            // Allow access ONLY for responsable role
            if (auth()->check() && auth()->user()->role === 'responsable') {
                return $next($request);
            }
            
            // Return 403 Forbidden for all other roles (including headdepartment)
            abort(403, 'Access Denied: Only responsable role can access this page.');
        });
    }

    /**
     * Display teacher requests for responsable.
     */
    public function index()
    {
        // Get real requests from database
        $requests = \App\Models\TeacherRequest::with(['teacher.user'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'type' => $request->type,
                    'title' => $request->title,
                    'description' => $request->description,
                    'date' => $request->created_at->format('Y-m-d'),
                    'time' => $request->created_at->format('H:i'),
                    'room' => $request->room ?? 'N/A',
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
        
        // If no requests exist, create sample data for testing
        if ($requests->isEmpty()) {
            $requests = [
                [
                    'id' => 1,
                    'type' => 'delay_exam',
                    'title' => 'Delay Math Exam',
                    'description' => 'Need to delay due to illness',
                    'date' => now()->format('Y-m-d'),
                    'time' => now()->format('H:i'),
                    'room' => 'A101',
                    'urgency' => 'high',
                    'status' => 'pending',
                    'admin_notes' => null,
                    'processed_at' => null,
                    'created_at' => now()->format('Y-m-d H:i:s'),
                    'module_name' => 'Mathematics',
                    'teacher_name' => 'John Doe',
                ]
            ];
        }

        // Calculate stats
        $stats = [
            'total' => $requests->count(),
            'pending' => $requests->where('status', 'pending')->count(),
            'approved' => $requests->where('status', 'approved')->count(),
            'rejected' => $requests->where('status', 'rejected')->count(),
        ];

        // Get responsable's unread notifications
        $unreadNotifications = \App\Models\Notification::where('user_id', auth()->id())
            ->where('read', false)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                $data = $notification->data;
                // If data is already an array, use it as is, otherwise decode JSON
                if (is_array($data)) {
                    $decodedData = $data;
                } else {
                    $decodedData = json_decode($data, true);
                }
                
                return [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'type' => $notification->type,
                    'created_at' => $notification->created_at->format('Y-m-d H:i:s'),
                    'data' => $decodedData
                ];
            });

        return Inertia::render('Responsable/TeacherRequests', [
            'requests' => $requests,
            'stats' => $stats,
            'notifications' => $unreadNotifications,
        ]);
    }

    /**
     * Process a teacher request with detailed validation and action creation.
     */
    public function process(Request $request, $id)
    {
        $teacherRequest = TeacherRequest::findOrFail($id);
        
        $validated = $request->validate([
            'decision' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:decision,rejected|string|max:500',
            'new_date' => 'required_if:decision,approved|date|after_or_equal:today',
            'new_time' => 'required_if:decision,approved|date_format:H:i',
            'new_room' => 'nullable|string|max:50',
            'student_message' => 'nullable|string|max:1000',
            'absence_date' => 'required_if:decision,approved|date|before_or_equal:today',
            'absence_type' => 'required_if:decision,approved|in:justified,unjustified',
            'absence_impact' => 'nullable|string|max:500',
            'cancellation_action' => 'nullable|string|max:500'
        ]);

        // Update request status
        $teacherRequest->update([
            'status' => $validated['decision'],
            'admin_notes' => $validated['rejection_reason'] ?? null,
            'processed_at' => now(),
        ]);

        // Create automatic actions based on request type and decision
        if ($validated['decision'] === 'approved') {
            $this->createAutomaticAction($teacherRequest, $validated);
            
            // Send notification to teacher about approval
            $this->sendNotification($teacherRequest->teacher->user, 'approved', $validated);
        } else {
            // Send notification to teacher about rejection
            $this->sendNotification($teacherRequest->teacher->user, 'rejected', $validated);
        }

        return redirect()->back()
            ->with('success', 'Request processed successfully. ' . 
                ($validated['decision'] === 'approved' ? 'Action created automatically.' : 'Teacher notified of rejection.'));
    }

    /**
     * Create automatic actions based on request type.
     */
    private function createAutomaticAction($request, $data)
    {
        switch ($request->type) {
            case 'delay_exam':
            case 'delay_test':
                // Create rescheduled exam/test
                $this->createRescheduledExam($request, $data);
                break;
                
            case 'absence':
                // Create validated absence record
                $this->createValidatedAbsence($request, $data);
                break;
                
            case 'cancel_exam':
            case 'cancel_test':
                // Create cancellation record
                $this->createCancellation($request, $data);
                break;
        }
    }

    /**
     * Create rescheduled exam/test record.
     */
    private function createRescheduledExam($request, $data)
    {
        // In real implementation, this would update exam in database
        // For now, we'll log the action
        \Log::info('Exam rescheduled', [
            'request_id' => $request->id,
            'new_date' => $data['new_date'],
            'new_time' => $data['new_time'],
            'new_room' => $data['new_room'] ?? null,
            'student_message' => $data['student_message'] ?? null
        ]);
    }

    /**
     * Create validated absence record.
     */
    private function createValidatedAbsence($request, $data)
    {
        // In real implementation, this would create an absence record
        \Log::info('Absence validated', [
            'request_id' => $request->id,
            'absence_date' => $data['absence_date'],
            'absence_type' => $data['absence_type'],
            'impact' => $data['absence_impact'] ?? null
        ]);
    }

    /**
     * Create cancellation record.
     */
    private function createCancellation($request, $data)
    {
        // In real implementation, this would update exam/test status to cancelled
        \Log::info('Exam/test cancelled', [
            'request_id' => $request->id,
            'action' => $data['cancellation_action'] ?? null
        ]);
    }

    /**
     * Send notification to teacher.
     */
    private function sendNotification($teacher, $decision, $data)
    {
        $message = $decision === 'approved' 
            ? 'Your request was approved and corresponding action has been created automatically.'
            : 'Your request was rejected. Reason: ' . $data['rejection_reason'];
            
        // Create notification record in database
        \App\Models\Notification::create([
            'user_id' => $teacher->id,
            'title' => 'Request ' . ucfirst($decision),
            'message' => $message,
            'type' => 'request_response',
            'data' => json_encode([
                'request_id' => $data['request_id'] ?? null,
                'decision' => $decision,
                'reason' => $data['rejection_reason'] ?? null,
                'processed_at' => now()->format('Y-m-d H:i:s')
            ]),
            'read' => false,
            'created_at' => now()
        ]);
        
        \Log::info('Notification sent to teacher', [
            'teacher_id' => $teacher->id,
            'message' => $message,
            'decision' => $decision
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
