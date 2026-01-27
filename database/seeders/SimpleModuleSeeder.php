<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Exam;
use App\Models\Teacher;
use Illuminate\Database\Seeder;

class SimpleModuleSeeder extends Seeder
{
    public function run(): void
    {
        Module::query()->delete();
        Exam::query()->delete();
        
        $teachers = Teacher::all();
        $defaultTeacher = $teachers->first();
        
        $modules = [
            // Tronc Commun - 1ère année
            [
                'code' => 'ING101',
                'module_name' => 'Algorithmique',
                'description' => 'Algorithmique et structures de données',
                'credits' => 6,
                'coefficient' => 2.0,
                'volume_cm' => 30,
                'volume_td' => 30,
                'teacher_id' => $defaultTeacher?->id,
            ],
            [
                'code' => 'ING102',
                'module_name' => 'Systèmes d\'Exploitation',
                'description' => 'Introduction aux systèmes d\'exploitation',
                'credits' => 5,
                'coefficient' => 2.0,
                'volume_cm' => 25,
                'volume_td' => 25,
                'teacher_id' => $defaultTeacher?->id,
            ],
            [
                'code' => 'ING103',
                'module_name' => 'Bases de Données',
                'description' => 'Bases de données relationnelles',
                'credits' => 5,
                'coefficient' => 2.0,
                'volume_cm' => 25,
                'volume_td' => 25,
                'teacher_id' => $defaultTeacher?->id,
            ],
            [
                'code' => 'ING104',
                'module_name' => 'Programmation Web',
                'description' => 'Développement web',
                'credits' => 5,
                'coefficient' => 2.0,
                'volume_cm' => 20,
                'volume_td' => 30,
                'teacher_id' => $defaultTeacher?->id,
            ],
            [
                'code' => 'ING105',
                'module_name' => 'Réseaux',
                'description' => 'Réseaux informatiques',
                'credits' => 5,
                'coefficient' => 2.0,
                'volume_cm' => 25,
                'volume_td' => 25,
                'teacher_id' => $defaultTeacher?->id,
            ],
            
            // Spécialité Génie Logiciel - 2ème année
            [
                'code' => 'GL201',
                'module_name' => 'Génie Logiciel',
                'description' => 'Fondements du génie logiciel',
                'credits' => 6,
                'coefficient' => 2.5,
                'volume_cm' => 30,
                'volume_td' => 30,
                'teacher_id' => $defaultTeacher?->id,
            ],
            [
                'code' => 'GL202',
                'module_name' => 'Intelligence Artificielle',
                'description' => 'Introduction à l\'IA',
                'credits' => 5,
                'coefficient' => 2.0,
                'volume_cm' => 25,
                'volume_td' => 25,
                'teacher_id' => $defaultTeacher?->id,
            ],
            [
                'code' => 'GL203',
                'module_name' => 'Compilation',
                'description' => 'Théorie et pratique de la compilation',
                'credits' => 5,
                'coefficient' => 2.0,
                'volume_cm' => 25,
                'volume_td' => 25,
                'teacher_id' => $defaultTeacher?->id,
            ],
            
            // Spécialité IA - 3ème année
            [
                'code' => 'IA301',
                'module_name' => 'Machine Learning',
                'description' => 'Apprentissage automatique',
                'credits' => 6,
                'coefficient' => 3.0,
                'volume_cm' => 30,
                'volume_td' => 30,
                'teacher_id' => $defaultTeacher?->id,
            ],
            [
                'code' => 'IA302',
                'module_name' => 'Data Science',
                'description' => 'Science des données',
                'credits' => 5,
                'coefficient' => 2.0,
                'volume_cm' => 25,
                'volume_td' => 25,
                'teacher_id' => $defaultTeacher?->id,
            ],
            [
                'code' => 'IA303',
                'module_name' => 'Deep Learning',
                'description' => 'Réseaux de neurones profonds',
                'credits' => 5,
                'coefficient' => 2.0,
                'volume_cm' => 25,
                'volume_td' => 25,
                'teacher_id' => $defaultTeacher?->id,
            ],
        ];
        
        // Créer les modules
        foreach ($modules as $moduleData) {
            $module = Module::create($moduleData);
            
            // Créer 3 examens pour chaque module (Normal, Rattrapage, Remplacement)
            $examTypes = ['Normal', 'Rattrapage', 'Remplacement'];
            $dates = [
                now()->addDays(rand(1, 30))->format('Y-m-d'),
                now()->addDays(rand(31, 60))->format('Y-m-d'),
                now()->addDays(rand(61, 90))->format('Y-m-d'),
            ];
            $times = ['09:00:00', '14:00:00', '16:00:00'];
            
            foreach ($examTypes as $index => $examType) {
                Exam::create([
                    'exam_type' => $examType,
                    'exame_date' => $dates[$index],
                    'exame_time' => $times[$index % 3],
                    'teacher_id' => $defaultTeacher?->id,
                    'id_group' => 1, // Groupe par défaut
                    'id_module' => $module->id,
                ]);
            }
        }
        
        $this->command->info(count($modules) . ' modules créés avec succès.');
        $this->command->info(count($modules) * 3 . ' examens créés (3 par module).');
    }
}
