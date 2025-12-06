<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{

    protected $fillable = ['name', 'level_id'];

    
    public function level()
    {
        return $this->belongsTo(Level::class);
    }
      public function groups() {
        return $this->hasMany(Group::class);
    }
}
