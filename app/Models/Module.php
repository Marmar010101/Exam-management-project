<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = [
        'module_name',
        'teacher_id',
        'group_id',
    ];

    
   public function teacher()
{
    return $this->belongsTo(Teacher::class, 'teacher_id');
}
    public function group()
{
    return $this->belongsTo(Group::class);
}
}
