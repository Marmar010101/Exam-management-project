<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'code'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
