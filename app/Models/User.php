<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'first_name', 'last_name', 'matricule','email','password','role','active'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function responsable()
    {
        return $this->hasOne(Responsable::class);
    }

    public function teacher()
    {
        return $this->hasOne(Teacher::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }

    public function headdepartment()
    {
        return $this->hasOne(HeadDepartment::class);
    }

    public function absences()
    {
        return $this->hasMany(TeacherAbsence::class, 'teacher_id');
    }

    public function isRole($role)
    {
        return $this->role === $role;
    }

    public function username()
    {
        return 'matricule';
    }
}
