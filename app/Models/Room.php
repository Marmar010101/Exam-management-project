<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_name',
        'room_capacity',
        'room_type',
        'availability',
        'description',
    ];

    protected $casts = [
        'room_capacity' => 'integer',
        'availability' => 'integer',
    ];

    public function exams()
    {
        return $this->belongsToMany(Exam::class, 'exam_rooms');
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'exam_rooms');
    }
}
