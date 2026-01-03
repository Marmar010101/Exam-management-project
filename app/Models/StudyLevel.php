<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyLevel extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'study_system_id', 'level_order', 'full_name', 'is_active'];

    public function studySystem()
    {
        return $this->belongsTo(StudySystem::class);
    }

    public function levelSemesters()
    {
        return $this->hasMany(LevelSemester::class);
    }

    public function semesters()
    {
        return $this->belongsToMany(Semester::class, 'level_semesters')
            ->withPivot('semester_order')
            ->orderBy('semester_order');
    }

    public function getSpecialities()
    {
        // Charger la relation studySystem si pas déjà chargée
        if (!$this->relationLoaded('studySystem')) {
            $this->load('studySystem');
        }
        
        // Retourner les spécialités possibles pour ce niveau selon la nouvelle structure
        if ($this->studySystem->name === 'Ingénieur') {
            if ($this->name === '1ère Année' || $this->name === '2ème Année') {
                // Tronc commun pour 1A, 2A
                return Speciality::where('name', 'Tronc Commun Informatique')->get();
            } else {
                // Spécialités pour 3A, 4A, 5A
                return Speciality::whereIn('name', [
                    'Intelligence Artificielle',
                    'Génie Logiciel',
                    'Réseaux',
                    'Systèmes d\'Information et Communication'
                ])->get();
            }
        } elseif ($this->studySystem->name === 'LMD') {
            // Pour LMD, toutes les spécialités sont disponibles
            return Speciality::all();
        }
        
        return collect();
    }
}
