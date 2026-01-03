<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Exam;
use App\Models\CalendarValidationRequest;
use App\Models\User;
use App\Notifications\CalendarValidationSubmittedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

class CalendarValidationController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:responsable']);
    }

    public function sendForValidation(Request $request, Group $group)
    {
        // Check if there are unpublished exams
        $exams = Exam::where('group_id', $group->id)
            ->unpublished()
            ->get();
        
        if ($exams->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No unpublished exams found for this group'
            ], 400);
        }

        // Check for existing pending request
        $existingRequest = CalendarValidationRequest::where('group_id', $group->id)
            ->where('status', 'pending')
            ->first();
            
        if ($existingRequest) {
            return response()->json([
                'success' => false,
                'message' => 'There is already a pending validation request for this group'
            ], 400);
        }

        // Prepare calendar data
        $dates = $exams->pluck('exam_date')->filter()->map(fn($date) => Carbon::parse($date));
        
        $dateRange = $dates->isNotEmpty() 
            ? $dates->min()->format('d M') . ' - ' . $dates->max()->format('d M')
            : 'No dates';
            
        $totalHours = $exams->sum('duration') / 60;

        $examData = $exams->map(function($exam) {
            return [
                'id' => $exam->id,
                'module_name' => $exam->module->module_name ?? 'Module',
                'exam_date' => $exam->exam_date?->format('Y-m-d'),
                'exam_time' => $exam->exam_time?->format('H:i'),
                'exam_type' => $exam->exam_type,
                'duration' => $exam->duration,
                'room_name' => $exam->rooms->first()->room_name ?? 'No room',
                'status' => $exam->status,
            ];
        });

        // Create validation request
        $validationRequest = CalendarValidationRequest::create([
            'group_id' => $group->id,
            'responsable_id' => auth()->id(),
            'status' => 'pending',
            'data' => [
                'exams' => $examData,
                'exam_count' => $exams->count(),
                'date_range' => $dateRange,
                'total_hours' => round($totalHours, 1),
                'submitted_at' => now()->toDateTimeString(),
                'responsable_name' => auth()->user()->name,
                'group_name' => $group->name,
            ]
        ]);

        // Notify head department
        $headDepartmentUsers = User::where('role', 'head_department')->get();
        if ($headDepartmentUsers->isNotEmpty()) {
            Notification::send($headDepartmentUsers, new CalendarValidationSubmittedNotification($validationRequest));
        }

        return response()->json([
            'success' => true,
            'message' => 'Calendar sent for validation successfully!',
            'validation_id' => $validationRequest->id
        ]);
    }

    public function checkStatus(Group $group)
    {
        $latestRequest = CalendarValidationRequest::where('group_id', $group->id)
            ->latest()
            ->first();

        return response()->json([
            'has_pending_request' => $latestRequest && $latestRequest->status === 'pending',
            'status' => $latestRequest ? $latestRequest->status : 'none',
            'last_request_date' => $latestRequest?->created_at,
        ]);
    }
}