<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\Room;
use App\Models\Teacher;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ExamConflictService
{
    public static function checkRoomAvailability($roomId, $date, $startTime, $duration, $excludeExamId = null)
    {
        $endTime = Carbon::parse($startTime)->addMinutes($duration);
        
        $query = Exam::whereHas('rooms', function ($query) use ($roomId) {
            $query->where('room_id', $roomId);
        })
        ->whereDate('exam_date', $date)
        ->where(function ($query) use ($startTime, $endTime) {
            $query->whereBetween('exam_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function ($q) use ($startTime, $endTime) {
                      $q->where('exam_time', '<=', $startTime)
                        ->where('end_time', '>=', $endTime);
                  });
        });
        
        if ($excludeExamId) {
            $query->where('id', '!=', $excludeExamId);
        }
        
        $conflictingExams = $query->get();

        return [
            'available' => $conflictingExams->isEmpty(),
            'conflicts' => $conflictingExams
        ];
    }

    public static function checkTeacherAvailability($teacherId, $date, $startTime, $duration, $excludeExamId = null)
    {
        $endTime = Carbon::parse($startTime)->addMinutes($duration);
        
        // Use invigilators relationship which points to exam_teachers table
        $query = Exam::whereHas('invigilators', function ($query) use ($teacherId) {
            $query->where('teacher_id', $teacherId);
        })
        ->whereDate('exam_date', $date)
        ->where(function ($query) use ($startTime, $endTime) {
            $query->whereBetween('exam_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function ($q) use ($startTime, $endTime) {
                      $q->where('exam_time', '<=', $startTime)
                        ->where('end_time', '>=', $endTime);
                  });
        });
        
        if ($excludeExamId) {
            $query->where('id', '!=', $excludeExamId);
        }
        
        $conflictingExams = $query->get();

        return [
            'available' => $conflictingExams->isEmpty(),
            'conflicts' => $conflictingExams
        ];
    }

    // REMOVED GROUP CONFLICT CHECK - Groups can have exams at same time
    // public static function checkGroupAvailability($groupId, $date, $startTime, $duration) {}

    public static function getAvailableRooms($date, $startTime, $duration, $capacity = null, $excludeRoomIds = [])
    {
        $endTime = Carbon::parse($startTime)->addMinutes($duration);
        
        $occupiedRoomIds = Exam::whereHas('rooms')
            ->whereDate('exam_date', $date)
            ->where(function ($query) use ($startTime, $endTime) {
                $query->whereBetween('exam_time', [$startTime, $endTime])
                      ->orWhereBetween('end_time', [$startTime, $endTime])
                      ->orWhere(function ($q) use ($startTime, $endTime) {
                          $q->where('exam_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                      });
            })
            ->pluck('id')
            ->toArray();

        $occupiedRoomIds = DB::table('exam_rooms')
            ->whereIn('exam_id', $occupiedRoomIds)
            ->pluck('room_id')
            ->toArray();

        // Combine occupied room IDs with excluded room IDs
        $allExcludedIds = array_unique(array_merge($occupiedRoomIds, $excludeRoomIds));

        $query = Room::where('availability', true)
            ->whereNotIn('id', $allExcludedIds);

        if ($capacity) {
            $query->where('capacity', '>=', $capacity);
        }

        return $query->get();
    }

    public static function getAvailableTeachers($date, $startTime, $duration, $excludeTeacherIds = [])
    {
        $endTime = Carbon::parse($startTime)->addMinutes($duration);
        
        // Use invigilators relationship which points to exam_teachers table
        $occupiedTeacherIds = Exam::whereHas('invigilators')
            ->whereDate('exam_date', $date)
            ->where(function ($query) use ($startTime, $endTime) {
                $query->whereBetween('exam_time', [$startTime, $endTime])
                      ->orWhereBetween('end_time', [$startTime, $endTime])
                      ->orWhere(function ($q) use ($startTime, $endTime) {
                          $q->where('exam_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                      });
            })
            ->pluck('id')
            ->toArray();

        // Use exam_teachers table (not exam_invigilators)
        $occupiedTeacherIds = DB::table('exam_teachers')
            ->whereIn('exam_id', $occupiedTeacherIds)
            ->pluck('teacher_id')
            ->toArray();

        $allOccupiedIds = array_unique(array_merge($occupiedTeacherIds, $excludeTeacherIds));

        return Teacher::whereNotIn('id', $allOccupiedIds)->get();
    }
    
    // New method to check if enough resources are available
    public static function checkResourcesAvailability($date, $startTime, $duration, $requiredRooms = 1, $requiredTeachers = 2)
    {
        $availableRooms = self::getAvailableRooms($date, $startTime, $duration);
        $availableTeachers = self::getAvailableTeachers($date, $startTime, $duration);
        
        return [
            'rooms_available' => $availableRooms->count() >= $requiredRooms,
            'teachers_available' => $availableTeachers->count() >= $requiredTeachers,
            'available_rooms_count' => $availableRooms->count(),
            'available_teachers_count' => $availableTeachers->count(),
            'available_rooms' => $availableRooms,
            'available_teachers' => $availableTeachers
        ];
    }

    public static function checkGroupAvailability($groupId, $date, $startTime, $duration, $excludeExamId = null)
{
    $endTime = Carbon::parse($startTime)->addMinutes($duration);
    
    $query = Exam::where('group_id', $groupId)
        ->whereDate('exam_date', $date)
        ->where(function ($query) use ($startTime, $endTime) {
            $query->whereBetween('exam_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function ($q) use ($startTime, $endTime) {
                      $q->where('exam_time', '<=', $startTime)
                        ->where('end_time', '>=', $endTime);
                  });
        });
    
    if ($excludeExamId) {
        $query->where('id', '!=', $excludeExamId);
    }
    
    $conflictingExams = $query->get();

    return [
        'available' => $conflictingExams->isEmpty(),
        'conflicts' => $conflictingExams
    ];
}
}