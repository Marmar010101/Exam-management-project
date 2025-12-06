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
    ];
  public function user()
    {
        return $this->belongsTo(User::class);
    }
}
