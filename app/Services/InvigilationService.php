<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\Teacher;
use App\Models\InvigilationSchedule;
use Carbon\Carbon;

class InvigilationService
{
    public function autoAssignInvigilators($examIds)
    {
        $exams = Exam::with(['module', 'rooms', 'invigilators'])->whereIn('id', $examIds)->get();
        $teachers = Teacher::all();
        
        $results = [
            'assigned' => 0,
            'skipped' => 0,
            'conflicts' => []
        ];
        
        foreach ($exams as $exam) {
            // Clear existing assignments for these exams
            $exam->invigilators()->detach();
            
            // Try to assign exactly 2 teachers per exam
            $assignedCount = 0;
            $neededTeachers = 2; // Exactly 2 teachers per exam
            
            // First priority: module teacher if available
            if ($exam->module->teacher_id) {
                $mainTeacher = Teacher::find($exam->module->teacher_id);
                if ($mainTeacher && $this->isTeacherAvailable($mainTeacher, $exam)) {
                    $exam->invigilators()->attach($mainTeacher->id);
                    $assignedCount++;
                    $results['assigned']++;
                } else {
                    $results['skipped']++;
                    $results['conflicts'][] = "Module teacher not available for exam {$exam->id}";
                }
            }
            
            // Second priority: other available teachers
            foreach ($teachers as $teacher) {
                if ($assignedCount >= $neededTeachers) break;
                
                // Skip if already assigned as module teacher
                if ($exam->module->teacher_id === $teacher->id) continue;
                
                if ($this->isTeacherAvailable($teacher, $exam)) {
                    $exam->invigilators()->attach($teacher->id);
                    $assignedCount++;
                    $results['assigned']++;
                }
            }
            
            // If still need more teachers
            if ($assignedCount < $neededTeachers) {
                $results['skipped'] += ($neededTeachers - $assignedCount);
                $results['conflicts'][] = "Could only assign {$assignedCount} of {$neededTeachers} teachers for exam {$exam->id}";
            }
        }
        
        return $results;
    }
    
    private function isTeacherAvailable($teacher, $exam)
    {
        // Check unavailable dates
        if ($teacher->unavailable_dates && in_array($exam->exam_date, $teacher->unavailable_dates)) {
            return false;
        }
        
        // Check max exams per day
        $dailyAssignments = Exam::whereHas('invigilators', function($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->where('exam_date', $exam->exam_date)
            ->count();
            
        if ($dailyAssignments >= $teacher->max_exams_per_day) {
            return false;
        }
        
        // Check time conflicts - teacher can't be in two exams at same time
        $timeConflict = Exam::whereHas('invigilators', function($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->where('exam_date', $exam->exam_date)
            ->where(function($q) use ($exam) {
                $q->whereBetween('exam_time', [$exam->exam_time, $exam->end_time])
                  ->orWhereBetween('end_time', [$exam->exam_time, $exam->end_time])
                  ->orWhere(function($sub) use ($exam) {
                      $sub->where('exam_time', '<=', $exam->exam_time)
                          ->where('end_time', '>=', $exam->end_time);
                  });
            })
            ->exists();
            
        return !$timeConflict;
    }
    
    public function getTeacherSchedule($teacherId, $startDate = null, $endDate = null)
    {
        $query = Exam::with(['module', 'rooms'])
            ->whereHas('invigilators', function($query) use ($teacherId) {
                $query->where('teacher_id', $teacherId);
            });
            
        if ($startDate) {
            $query->where('exam_date', '>=', $startDate);
        }
        
        if ($endDate) {
            $query->where('exam_date', '<=', $endDate);
        }
        
        return $query->orderBy('exam_date')
                     ->orderBy('exam_time')
                     ->get();
    }
    
    public function getTeacherAvailability($teacherId, $date)
    {
        $teacher = Teacher::find($teacherId);
        
        if (!$teacher) return 'unknown';
        
        // Check unavailable dates
        if ($teacher->unavailable_dates && in_array($date, $teacher->unavailable_dates)) {
            return 'unavailable';
        }
        
        // Check current assignments
        $assignments = Exam::whereHas('invigilators', function($query) use ($teacherId) {
                $query->where('teacher_id', $teacherId);
            })
            ->where('exam_date', $date)
            ->count();
            
        if ($assignments >= $teacher->max_exams_per_day) {
            return 'busy';
        }
        
        return 'available';
    }
}