<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_name',
        'code',
        'description',
        'system_type',
        'level',
        'semester',
        'credits',
        'coefficient',
        'volume_cm',
        'volume_td',
        'specialty',
        'objectives',
        'resources',
        'evaluation_methods',
        'exam_types',
        'semester_id',
        'level_id',
        'speciality_id',
        'teacher_id',
        'cycle_id'
    ];

    protected $casts = [
        'credits' => 'integer',
        'coefficient' => 'decimal:2',
        'volume_cm' => 'integer',
        'volume_td' => 'integer',
        'evaluation_methods' => 'array',
        'exam_types' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    public function level()
    {
        return $this->belongsTo(Level::class, 'level_id');
    }

    public function speciality()
    {
        return $this->belongsTo(Speciality::class, 'speciality_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'module_teachers');
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_modules');
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }

    public function prerequisites()
    {
        return $this->belongsToMany(Module::class, 'module_prerequisites', 'module_id', 'prerequisite_id');
    }

    public function prerequisiteOf()
    {
        return $this->belongsToMany(Module::class, 'module_prerequisites', 'prerequisite_id', 'module_id');
    }

    // Accessors for formatted values
    public function getSystemTypeLabelAttribute()
    {
        return match($this->system_type) {
            'ing' => 'Système Ingénieur',
            'lmd' => 'Système LMD',
            default => $this->system_type,
        };
    }

    public function getLevelLabelAttribute()
    {
        return match($this->level) {
            'ing1' => '1ère Année Ingénieur',
            'ing2' => '2ème Année Ingénieur',
            'ing3' => '3ème Année Ingénieur',
            'ing4' => '4ème Année Ingénieur',
            'ing5' => '5ème Année Ingénieur',
            'l1' => 'Licence 1 (L1)',
            'l2' => 'Licence 2 (L2)',
            'l3' => 'Licence 3 (L3)',
            'm1' => 'Master 1 (M1)',
            'm2' => 'Master 2 (M2)',
            default => $this->level,
        };
    }

    public function getSpecialtyLabelAttribute()
    {
        return match($this->specialty) {
            'ia' => 'Intelligence Artificielle',
            'gl' => 'Génie Logiciel',
            'res' => 'Réseaux',
            'sic' => 'Systèmes d\'Information et Communication',
            default => $this->specialty,
        };
    }
}
