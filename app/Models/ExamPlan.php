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
        'exam_subtype',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'description',
        'status',
        'sent_to_head_at',
        'validation_notes',
        'validated_at',
        'is_planning_generated',
        'planning_type',
        'planning_data',
        'batch_id',
        'group_index',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'sent_to_head_at' => 'datetime',
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
            'sent_to_head' => 'bg-purple-100 text-purple-800 border-purple-200',
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
            'sent_to_head' => 'Sent to Head',
            default => ucfirst($this->status),
        };
    }

    public function getExamTypeLabel(): string
    {
        return match($this->exam_type) {
            'Exam' => 'Exam',
            'Control' => 'Control',
            'Test_TP' => 'Test_TP',
            default => $this->exam_type,
        };
    }

    public function getFormattedDate(): string
    {
        // Use start_date if available, otherwise fall back to exam_date
        $date = $this->start_date ?? $this->exam_date;
        return $date ? $date->format('M d, Y') : 'No date';
    }

    public function getFormattedDateRange(): string
    {
        // Use start_date and end_date if available, otherwise fall back to exam_date
        $startDate = $this->start_date ?? $this->exam_date;
        $endDate = $this->end_date ?? $this->exam_date;
        
        if (!$startDate) {
            return 'No date';
        }
        
        if ($startDate->eq($endDate)) {
            return $startDate->format('M d, Y');
        }
        
        return $startDate->format('M d') . ' - ' . $endDate->format('M d, Y');
    }

    public function getFormattedTime(): string
    {
        return $this->start_time->format('H:i') . ' - ' . $this->end_time->format('H:i');
    }
}
