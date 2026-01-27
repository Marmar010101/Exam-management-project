<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'matricule',
        'first_name',
        'last_name',
        'email',
        'phone',
        'department',
        'speciality',
        'grade',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function exams()
    {
        return $this->belongsToMany(Exam::class, 'exam_teachers');
    }

    public function invigilationSchedules()
    {
        return $this->hasMany(InvigilationSchedule::class);
    }

    public function requests()
    {
        return $this->hasMany(TeacherRequest::class);
    }

    public function alerts()
    {
        return $this->hasMany(TeacherAlert::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class, 'teacher_id');
    }
}
