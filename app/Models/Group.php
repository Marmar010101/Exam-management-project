<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'level_id',
        'speciality_id',
        'cycle_id',
        'semester_id',
        'academic_year',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function speciality()
    {
        return $this->belongsTo(Speciality::class);
    }

    public function cycle()
    {
        return $this->belongsTo(Cycle::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'group_modules');
    }

    public function exams()
    {
        return $this->hasMany(Exam::class, 'id_group');
    }
}
