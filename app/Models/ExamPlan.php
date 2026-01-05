<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by',
        'validated_by',
        'group_id',
        'module_id',
        'teacher_id',
        'room_id',
        'exam_type',
        'exam_date',
        'start_time',
        'end_time',
        'duration_minutes',
        'description',
        'status',
        'validation_notes',
        'validated_at',
    ];

    protected $casts = [
        'exam_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'validated_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    // UI Helper Methods
    public function getStatusColor(): string
    {
        return match($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'validated' => 'bg-green-100 text-green-800 border-green-200',
            'rejected' => 'bg-red-100 text-red-800 border-red-200',
            'scheduled' => 'bg-blue-100 text-blue-800 border-blue-200',
            default => 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }

    public function getStatusLabel(): string
    {
        return match($this->status) {
            'pending' => 'Pending Validation',
            'validated' => 'Validated',
            'rejected' => 'Rejected',
            'scheduled' => 'Scheduled',
            default => ucfirst($this->status),
        };
    }

    public function getExamTypeLabel(): string
    {
        return match($this->exam_type) {
            'Final' => 'Final Exam',
            'Midterm' => 'Midterm Exam',
            'Quiz' => 'Quiz',
            'Practical' => 'Practical Exam',
            'Oral' => 'Oral Exam',
            default => $this->exam_type,
        };
    }

    public function getFormattedDate(): string
    {
        return $this->exam_date->format('M d, Y');
    }

    public function getFormattedTime(): string
    {
        return $this->start_time->format('H:i') . ' - ' . $this->end_time->format('H:i');
    }
}
