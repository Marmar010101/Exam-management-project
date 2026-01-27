<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_type',
        'exam_date_old',
        'exam_time_old',
        'teacher_id',
        'group_id',
        'module_id',
        'room_id',
        'duration',
        'status',
        'created_by',
        'validated_by',
        'validation_notes',
        'validated_at',
        'semester_id',
    ];

    protected $casts = [
        'exam_date_old' => 'date',
        'exam_time_old' => 'datetime',
        'validated_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'exam_students')
            ->withPivot('status', 'grade', 'remarks');
    }

    public function invigilators()
    {
        return $this->belongsToMany(Teacher::class, 'exam_invigilators');
    }

    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'exam_rooms');
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
            'pending' => 'Pending',
            'validated' => 'Validated',
            'rejected' => 'Rejected',
            'scheduled' => 'Scheduled',
            default => 'Unknown',
        };
    }

    public function getFormattedDate(): string
    {
        return $this->exam_date_old ? $this->exam_date_old->format('M d, Y') : 'N/A';
    }

    public function getFormattedTime(): string
    {
        return $this->exam_time_old ? $this->exam_time_old->format('H:i') : 'N/A';
    }
}
