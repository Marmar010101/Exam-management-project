<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    protected $fillable = ['name','cycle_id', 'level_id', 'speciality_id','semester_id','students_count'];

    public function cycle() {
        return $this->belongsTo(Cycle::class);
    }
    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
    
    public function students()
    {
        return $this->hasMany(Student::class);
    }
    public function speciality()
{
    return $this->belongsTo(Speciality::class);
}
  public function modules(): HasMany
    {
        return $this->hasMany(Module::class);
    }
     public function exams()
    {
        return $this->hasMany(Exam::class);
    }
}
