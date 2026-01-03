<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use App\Models\StudyLevel;
use App\Models\Speciality;

class TestModulesSeeder extends Seeder
{
    public function run()
    {
        // Récupérer les données académiques
        $ingenieur1A = StudyLevel::where('name', '1ère Année')->first();
        $ingenieur3A = StudyLevel::where('name', '3ème Année')->first();
        $licenceL1 = StudyLevel::where('name', 'L1')->first();
        $masterM1 = StudyLevel::where('name', 'M1')->first();
        
        $troncCommun = Speciality::where('name', 'Tronc Commun Informatique')->first();
        $ia = Speciality::where('name', 'Intelligence Artificielle')->first();
        
        // Modules pour Ingénieur 1A (Tronc Commun)
        Module::create([
            'module_name' => 'Algorithmique et Structures de Données',
            'code' => 'ING101',
            'speciality_id' => $troncCommun->id,
            'teacher_id' => 3
        ]);
        
        Module::create([
            'module_name' => 'Programmation Orientée Objet',
            'code' => 'ING102',
            'speciality_id' => $troncCommun->id,
            'teacher_id' => 3
        ]);
        
        // Modules pour Ingénieur 3A (Spécialité IA)
        Module::create([
            'module_name' => 'Machine Learning',
            'code' => 'ING301',
            'speciality_id' => $ia->id,
            'teacher_id' => 3
        ]);
        
        // Modules pour Licence L1
        Module::create([
            'module_name' => 'Introduction à l\'Informatique',
            'code' => 'LIC101',
            'speciality_id' => $troncCommun->id,
            'teacher_id' => 3
        ]);
        
        // Modules pour Master M1
        Module::create([
            'module_name' => 'Deep Learning',
            'code' => 'MAS101',
            'speciality_id' => $ia->id,
            'teacher_id' => 3
        ]);
        
        $this->command->info('Modules de test créés avec succès !');
    }
}
