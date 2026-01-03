<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StudySystem;
use App\Models\StudyLevel;
use App\Models\Speciality;
use App\Models\Semester;

class CorrectAcademicStructureSeeder extends Seeder
{
    public function run()
    {
        // Supprimer les données existantes
        StudyLevel::query()->delete();
        Semester::query()->delete();
        Speciality::query()->delete();
        StudySystem::query()->delete();
        
        // Créer les systèmes
        $systemIngenieur = StudySystem::create([
            'name' => 'Ingénieur',
            'description' => 'Système Ingénieur - 5 ans',
            'duration_years' => 5,
            'diploma_type' => 'Ingénieur',
            'is_active' => true
        ]);
        
        $systemLMD = StudySystem::create([
            'name' => 'LMD',
            'description' => 'Système LMD - Licence + Master',
            'duration_years' => 5,
            'diploma_type' => 'Licence/Master',
            'is_active' => true
        ]);
        
        // Créer les spécialités
        $specialities = [
            'Tronc Commun Informatique',
            'Intelligence Artificielle',
            'Génie Logiciel',
            'Réseaux',
            'Systèmes d\'Information et Communication'
        ];
        
        foreach ($specialities as $specialityName) {
            Speciality::create(['name' => $specialityName]);
        }
        
        $troncCommun = Speciality::where('name', 'Tronc Commun Informatique')->first();
        $ia = Speciality::where('name', 'Intelligence Artificielle')->first();
        $gl = Speciality::where('name', 'Génie Logiciel')->first();
        $reseaux = Speciality::where('name', 'Réseaux')->first();
        $sic = Speciality::where('name', 'Systèmes d\'Information et Communication')->first();
        
        // Créer les semestres globaux (sans level_id pour l'instant)
        // On va créer les semestres via les relations level-semesters
        
        // SYSTÈME INGÉNIEUR (5 ans)
        
        // TRONC COMMUN (2 ans)
        $ingenieur1A = StudyLevel::create([
            'study_system_id' => $systemIngenieur->id,
            'name' => '1ère Année',
            'full_name' => '1ère Année Ingénieur',
            'level_order' => 1,
            'is_active' => true
        ]);
        
        $ingenieur2A = StudyLevel::create([
            'study_system_id' => $systemIngenieur->id,
            'name' => '2ème Année',
            'full_name' => '2ème Année Ingénieur',
            'level_order' => 2,
            'is_active' => true
        ]);
        
        // SPÉCIALITÉ (3 ans)
        $ingenieur3A = StudyLevel::create([
            'study_system_id' => $systemIngenieur->id,
            'name' => '3ème Année',
            'full_name' => '3ème Année Ingénieur',
            'level_order' => 3,
            'is_active' => true
        ]);
        
        $ingenieur4A = StudyLevel::create([
            'study_system_id' => $systemIngenieur->id,
            'name' => '4ème Année',
            'full_name' => '4ème Année Ingénieur',
            'level_order' => 4,
            'is_active' => true
        ]);
        
        $ingenieur5A = StudyLevel::create([
            'study_system_id' => $systemIngenieur->id,
            'name' => '5ème Année',
            'full_name' => '5ème Année Ingénieur',
            'level_order' => 5,
            'is_active' => true
        ]);
        
        // Assigner les semestres pour Ingénieur
        // 1A et 2A: S1, S2
        // Créer les semestres dans la table levels
        $s1 = \App\Models\Level::create(['name' => 'S1', 'cycle_id' => 1]);
        $s2 = \App\Models\Level::create(['name' => 'S2', 'cycle_id' => 1]);
        
        $ingenieur1A->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 1]);
        $ingenieur1A->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 2]);
        
        $ingenieur2A->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 1]);
        $ingenieur2A->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 2]);
        
        // 3A et 4A: S1, S2
        $ingenieur3A->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 1]);
        $ingenieur3A->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 2]);
        
        $ingenieur4A->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 1]);
        $ingenieur4A->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 2]);
        
        // 5A: S1 seulement
        $ingenieur5A->semesters()->attach([$s1->id], ['semester_order' => 1]);
        
        // SYSTÈME LMD
        
        // LICENCE (3 ans) - Tronc Commun
        $licenceL1 = StudyLevel::create([
            'study_system_id' => $systemLMD->id,
            'name' => 'L1',
            'full_name' => 'Licence 1ère Année',
            'level_order' => 1,
            'is_active' => true
        ]);
        
        $licenceL2 = StudyLevel::create([
            'study_system_id' => $systemLMD->id,
            'name' => 'L2',
            'full_name' => 'Licence 2ème Année',
            'level_order' => 2,
            'is_active' => true
        ]);
        
        $licenceL3 = StudyLevel::create([
            'study_system_id' => $systemLMD->id,
            'name' => 'L3',
            'full_name' => 'Licence 3ème Année',
            'level_order' => 3,
            'is_active' => true
        ]);
        
        // MASTER (2 ans)
        $masterM1 = StudyLevel::create([
            'study_system_id' => $systemLMD->id,
            'name' => 'M1',
            'full_name' => 'Master 1ère Année',
            'level_order' => 4,
            'is_active' => true
        ]);
        
        $masterM2 = StudyLevel::create([
            'study_system_id' => $systemLMD->id,
            'name' => 'M2',
            'full_name' => 'Master 2ème Année',
            'level_order' => 5,
            'is_active' => true
        ]);
        
        // Assigner les semestres pour LMD
        // L1, L2, L3: S1, S2
        $licenceL1->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 1]);
        $licenceL1->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 2]);
        
        $licenceL2->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 1]);
        $licenceL2->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 2]);
        
        $licenceL3->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 1]);
        $licenceL3->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 2]);
        
        // M1: S1, S2
        $masterM1->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 1]);
        $masterM1->semesters()->attach([$s1->id, $s2->id], ['semester_order' => 2]);
        
        // M2: S1 seulement
        $masterM2->semesters()->attach([$s1->id], ['semester_order' => 1]);
        
        $this->command->info('Structure académique correcte créée avec succès !');
    }
}
