<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = ['name','cycle_id', 'level_id', 'semester_id','speciality_id'];

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
}
