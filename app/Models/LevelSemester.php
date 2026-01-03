<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LevelSemester extends Model
{
    use HasFactory;

    protected $fillable = ['study_level_id', 'semester_id', 'semester_order'];

    public function studyLevel()
    {
        return $this->belongsTo(StudyLevel::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
}
