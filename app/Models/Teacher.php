<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'grade',
        'is_responsable',
        'unavailable_dates',
        'max_exams_per_day',
        'max_exams_per_week',
    ];

    protected $casts = [
        'is_responsable' => 'boolean',
        'unavailable_dates' => 'array',
    ];
      public function user()
    {
        return $this->belongsTo(User::class);
    }
   /* public function supervisedExams()
    //{
        return $this->belongsToMany(Exam::class, 'exam_teachers');
    }*/

    public function invigilatedExams()
{
    return $this->belongsToMany(Exam::class, 'exam_invigilators');
}
public function modules()
{
    return $this->hasMany(Module::class);
}
 public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}
