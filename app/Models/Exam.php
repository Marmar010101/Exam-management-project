<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'group_id',
        'exam_date',
        'exam_time',
        'end_time',
        'duration',
        'exam_type',
        'conflict_warnings',
        'has_conflicts',
        'session_name',
        'is_batch_created',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
        'published_at',
        'created_by',
        'is_published'
    ];
    
    protected $casts = [
        'exam_date' => 'date',
        'exam_time' => 'datetime:H:i:s',
        'end_time' => 'datetime:H:i:s',
        'has_conflicts' => 'boolean',
        'approved_at' => 'datetime',
        'published_at' => 'datetime',
        'is_published' => 'boolean',
    ];

    // Automatically calculate end_time
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($exam) {
            if ($exam->exam_time && $exam->duration) {
                $start = Carbon::parse($exam->exam_time);
                $exam->end_time = $start->copy()->addMinutes($exam->duration);
            }
        });
    }

 public function rooms()
{
    return $this->belongsToMany(Room::class, 'exam_rooms');
               
}

public function invigilators()
{
     return $this->belongsToMany(Teacher::class, 'exam_teachers');
}

public function teachers()
{
    return $this->belongsToMany(Teacher::class, 'exam_teachers');
}
    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }


    public function invigilationSchedules()
{
    return $this->hasMany(InvigilationSchedule::class);
}

      public function getStartTimeAttribute()
    {
        return $this->exam_time;
    }
    

     public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Add this method for status checks
    public function isPendingApproval(): bool
    {
        return $this->status === 'pending_approval';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    // Helper method to check conflicts
    public function checkConflicts()
{
    $conflicts = [];
    
    // Check room conflicts for ALL rooms assigned to this exam
    $roomIds = $this->rooms()->pluck('rooms.id');
    
    if ($roomIds->count() > 0) {
        $roomConflicts = Exam::whereHas('rooms', function ($query) use ($roomIds) {
            $query->whereIn('room_id', $roomIds);
        })
        ->where('exam_date', $this->exam_date)
        ->where('id', '!=', $this->id)
        ->where(function ($query) {
            $query->where(function ($q) {
                $q->where('exam_time', '<', $this->end_time)
                  ->where('end_time', '>', $this->exam_time);
            });
        })
        ->exists();

        if ($roomConflicts) {
            $roomNames = $this->rooms->pluck('room_name')->join(', ');
            $conflicts[] = "One or more rooms ({$roomNames}) are already occupied during this time";
        }
    }

    // Check teacher conflicts
    if ($this->invigilators()->count() > 0) {
        $invigilatorIds = $this->invigilators()->pluck('teachers.id');
        
        $teacherConflicts = Exam::whereHas('invigilators', function ($query) use ($invigilatorIds) {
            $query->whereIn('teacher_id', $invigilatorIds);
        })
        ->where('exam_date', $this->exam_date)
        ->where('id', '!=', $this->id)
        ->where(function ($query) {
            $query->where(function ($q) {
                $q->where('exam_time', '<', $this->end_time)
                  ->where('end_time', '>', $this->exam_time);
            });
        })
        ->exists();

        if ($teacherConflicts) {
            $conflicts[] = "One or more invigilators have another exam at the same time";
        }
    }

    // Check group conflicts
    $groupConflicts = Exam::where('group_id', $this->group_id)
        ->where('exam_date', $this->exam_date)
        ->where('id', '!=', $this->id)
        ->where(function ($query) {
            $query->where(function ($q) {
                $q->where('exam_time', '<', $this->end_time)
                  ->where('end_time', '>', $this->exam_time);
            });
        })
        ->exists();

    if ($groupConflicts) {
        $conflicts[] = "This group has another exam scheduled at the same time";
    }

    // Check teacher max exams per day
    foreach ($this->invigilators as $teacher) {
        $examsCountToday = Exam::whereHas('invigilators', function ($query) use ($teacher) {
            $query->where('teacher_id', $teacher->id);
        })
        ->where('exam_date', $this->exam_date)
        ->count();

        if ($examsCountToday >= $teacher->max_exams_per_day) {
            $conflicts[] = "Teacher {$teacher->full_name} has reached maximum exams per day ({$teacher->max_exams_per_day})";
        }
    }

    $this->conflict_warnings = implode('; ', $conflicts);
    $this->has_conflicts = !empty($conflicts);
    
    return $conflicts;
}
    // In Exam.php model
public function assignRoomsBasedOnCapacity()
{
    // Get group student count
    $group = $this->group;
    $studentCount = $group->students_count ?? 0;
    
    // Get available rooms sorted by capacity (largest first)
    $availableRooms = Room::where('availability', true)
        ->orderByDesc('capacity')
        ->get();
    
    $assignedRooms = [];
    $remainingStudents = $studentCount;
    
    foreach ($availableRooms as $room) {
        if ($remainingStudents <= 0) break;
        
        // Calculate students for this room (fill up to capacity)
        $studentsInRoom = min($room->capacity, $remainingStudents);
        
        // Attach room with student count
        $this->rooms()->attach($room->id, [
            'student_count' => $studentsInRoom
        ]);
        
        $assignedRooms[] = $room;
        $remainingStudents -= $studentsInRoom;
    }
    
    // If we couldn't assign enough capacity, add warning
    if ($remainingStudents > 0) {
        $this->conflict_warnings .= "; Insufficient room capacity for all students";
        $this->has_conflicts = true;
    }
    
    return $assignedRooms;
}
public function calendarValidationRequests()
{
    return $this->hasManyThrough(
        CalendarValidationRequest::class,
        Group::class,
        'id', // Foreign key on groups table
        'group_id', // Foreign key on calendar_validation_requests table
        'group_id', // Local key on exams table
        'id' // Local key on groups table
    );
}

public function scopeUnpublished($query)
{
    return $query->where(function($q) {
        $q->where('is_published', false)
          ->orWhereNull('is_published');
    });
}

}