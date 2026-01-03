<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StudySystem;
use App\Models\StudyLevel;
use App\Models\Speciality;
use Illuminate\Support\Facades\DB;

class SimpleAcademicStructureSeeder extends Seeder
{
    public function run()
    {
        // Supprimer les données existantes
        DB::table('level_semesters')->delete();
        StudyLevel::query()->delete();
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
        
        // SYSTÈME INGÉNIEUR (5 ans)
        
        // TRONC COMMUN (2 ans)
        StudyLevel::create([
            'study_system_id' => $systemIngenieur->id,
            'name' => '1ère Année',
            'full_name' => '1ère Année Ingénieur',
            'level_order' => 1,
            'is_active' => true
        ]);
        
        StudyLevel::create([
            'study_system_id' => $systemIngenieur->id,
            'name' => '2ème Année',
            'full_name' => '2ème Année Ingénieur',
            'level_order' => 2,
            'is_active' => true
        ]);
        
        // SPÉCIALITÉ (3 ans)
        StudyLevel::create([
            'study_system_id' => $systemIngenieur->id,
            'name' => '3ème Année',
            'full_name' => '3ème Année Ingénieur',
            'level_order' => 3,
            'is_active' => true
        ]);
        
        StudyLevel::create([
            'study_system_id' => $systemIngenieur->id,
            'name' => '4ème Année',
            'full_name' => '4ème Année Ingénieur',
            'level_order' => 4,
            'is_active' => true
        ]);
        
        StudyLevel::create([
            'study_system_id' => $systemIngenieur->id,
            'name' => '5ème Année',
            'full_name' => '5ème Année Ingénieur',
            'level_order' => 5,
            'is_active' => true
        ]);
        
        // SYSTÈME LMD
        
        // LICENCE (3 ans) - Tronc Commun
        StudyLevel::create([
            'study_system_id' => $systemLMD->id,
            'name' => 'L1',
            'full_name' => 'Licence 1ère Année',
            'level_order' => 1,
            'is_active' => true
        ]);
        
        StudyLevel::create([
            'study_system_id' => $systemLMD->id,
            'name' => 'L2',
            'full_name' => 'Licence 2ème Année',
            'level_order' => 2,
            'is_active' => true
        ]);
        
        StudyLevel::create([
            'study_system_id' => $systemLMD->id,
            'name' => 'L3',
            'full_name' => 'Licence 3ème Année',
            'level_order' => 3,
            'is_active' => true
        ]);
        
        // MASTER (2 ans)
        StudyLevel::create([
            'study_system_id' => $systemLMD->id,
            'name' => 'M1',
            'full_name' => 'Master 1ère Année',
            'level_order' => 4,
            'is_active' => true
        ]);
        
        StudyLevel::create([
            'study_system_id' => $systemLMD->id,
            'name' => 'M2',
            'full_name' => 'Master 2ème Année',
            'level_order' => 5,
            'is_active' => true
        ]);
        
        $this->command->info('Structure académique simplifiée créée avec succès !');
    }
}
