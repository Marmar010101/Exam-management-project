<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'matricule','email','password','role','active'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */

  
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    

     public function responsable()
    {
        return $this->hasOne(Responsable::class);
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

     protected $casts = [
        'email_verified_at' => 'datetime',
    ];
   public function isRole($role)
    {
        return $this->role === $role;
    }
}
