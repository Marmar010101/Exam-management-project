<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'room_name',
        'capacity',
        'room_type',
        'availability',
    ];
    public function exams()
    {
        return $this->belongsToMany(Exam::class, 'exam_rooms');
    }
}
