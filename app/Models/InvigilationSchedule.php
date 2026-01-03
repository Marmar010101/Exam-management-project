<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvigilationSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'teacher_id',
        'role',
        'notes',
        'notified'
    ];

    protected $casts = [
        'notified' => 'boolean',
        'unavailable_dates' => 'array'
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

}
