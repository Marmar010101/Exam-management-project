<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cycle extends Model
{
     protected $fillable = ['cycle_name'];
     public function levels() {
        return $this->hasMany(Level::class);
    }

    public function groups() {
        return $this->hasMany(Group::class);
    }
}
