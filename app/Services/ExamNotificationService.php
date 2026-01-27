<?php

namespace App\Services;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class ExamNotificationService
{
    public static function notifyHeadDepartment($type, $exam, $message, $data = [])
    {
        // Get all Head Department users
        $headDepartmentUsers = User::where('role', 'headdepartment')->get();
        
        // Get current user info safely
        $currentUser = Auth::user();
        $senderName = $currentUser ? $currentUser->first_name . ' ' . $currentUser->last_name : 'System';
        $senderRole = $currentUser ? $currentUser->role : 'system';
        
        foreach ($headDepartmentUsers as $user) {
            Notification::create([
                'type' => $type,
                'message' => $message,
                'data' => array_merge($data, [
                    'exam_id' => $exam->id,
                    'module_name' => $exam->module ? $exam->module->module_name : 'Unknown',
                    'exam_date' => $exam->exame_date,
                    'exam_time' => $exam->exame_time,
                    'room_name' => $exam->room ? $exam->room->room_name : 'Unknown',
                    'exam_type' => $exam->exam_type,
                    'sender_name' => $senderName,
                    'sender_role' => $senderRole,
                ]),
                'user_id' => $user->id,
                'sender_id' => $currentUser ? $currentUser->id : $user->id,
                'read' => false,
            ]);
        }
    }

    public static function notifyResponsable($type, $exam, $message, $data = [])
    {
        // Get the responsable who created the exam
        if ($exam->created_by) {
            $responsable = User::find($exam->created_by);
            
            if ($responsable) {
                // Get current user info safely
                $currentUser = Auth::user();
                $decisionBy = $currentUser ? $currentUser->first_name . ' ' . $currentUser->last_name : 'System';
                $decisionRole = $currentUser ? $currentUser->role : 'system';
                
                Notification::create([
                    'type' => $type,
                    'message' => $message,
                    'data' => array_merge($data, [
                        'exam_id' => $exam->id,
                        'module_name' => $exam->module ? $exam->module->module_name : 'Unknown',
                        'exam_date' => $exam->exame_date,
                        'exam_time' => $exam->exame_time,
                        'room_name' => $exam->room ? $exam->room->room_name : 'Unknown',
                        'exam_type' => $exam->exam_type,
                        'decision_by' => $decisionBy,
                        'decision_role' => $decisionRole,
                    ]),
                    'user_id' => $responsable->id,
                    'sender_id' => $currentUser ? $currentUser->id : $responsable->id,
                    'read' => false,
                ]);
            }
        }
    }

    public static function examCreated($exam)
    {
        $currentUser = Auth::user();
        $senderName = $currentUser ? $currentUser->first_name . ' ' . $currentUser->last_name : 'System';
        
        self::notifyHeadDepartment(
            'exam_created',
            $exam,
            'New exam created by ' . $senderName,
            ['action' => 'created']
        );
    }

    public static function examUpdated($exam)
    {
        $currentUser = Auth::user();
        $senderName = $currentUser ? $currentUser->first_name . ' ' . $currentUser->last_name : 'System';
        
        self::notifyHeadDepartment(
            'exam_updated',
            $exam,
            'Exam updated by ' . $senderName,
            ['action' => 'updated']
        );
    }

    public static function examDeleted($exam)
    {
        $currentUser = Auth::user();
        $senderName = $currentUser ? $currentUser->first_name . ' ' . $currentUser->last_name : 'System';
        
        self::notifyHeadDepartment(
            'exam_deleted',
            $exam,
            'Exam deleted by ' . $senderName,
            ['action' => 'deleted']
        );
    }

    public static function examValidated($exam)
    {
        self::notifyResponsable(
            'exam_validated',
            $exam,
            'Your exam has been accepted',
            ['action' => 'validated', 'status' => 'accepted']
        );
    }

    public static function examRejected($exam, $reason = null)
    {
        self::notifyResponsable(
            'exam_rejected',
            $exam,
            'Your exam has been rejected',
            ['action' => 'rejected', 'status' => 'rejected', 'reason' => $reason]
        );
    }
}
