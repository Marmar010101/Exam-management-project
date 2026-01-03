<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudySystem extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'duration_years', 'diploma_type', 'is_active'];

    public function levels()
    {
        return $this->hasMany(StudyLevel::class);
    }

    public function activeLevels()
    {
        return $this->hasMany(StudyLevel::class)->where('is_active', true)->orderBy('level_order');
    }
}
