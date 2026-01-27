<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Exam;
use App\Models\Teacher;
use Illuminate\Database\Seeder;

class ModuleExamSeeder extends Seeder
{
    public function run(): void
    {
        $modules = Module::all();
        $teachers = Teacher::all();
        $defaultTeacher = $teachers->first();
        
        if ($modules->isEmpty()) {
            $this->command->error('Aucun module trouvé. Exécutez CompleteModuleSeeder d\'abord.');
            return;
        }
        
        $examCount = 0;
        
        foreach ($modules as $index => $module) {
            // Créer 3 examens pour chaque module (Normal, Rattrapage, Remplacement)
            $examTypes = ['Normal', 'Rattrapage', 'Remplacement'];
            $dates = [
                now()->addDays(($index * 10) + 1)->format('Y-m-d'),
                now()->addDays(($index * 10) + 15)->format('Y-m-d'),
                now()->addDays(($index * 10) + 20)->format('Y-m-d'),
            ];
            $times = ['09:00:00', '14:00:00', '16:00:00'];
            
            foreach ($examTypes as $examIndex => $examType) {
                Exam::create([
                    'exam_type' => $examType,
                    'exame_date' => $dates[$examIndex],
                    'exame_time' => $times[$examIndex],
                    'teacher_id' => $defaultTeacher?->id,
                    'id_group' => null, // Pas de groupe pour éviter les contraintes
                    'id_module' => $module->id,
                ]);
                $examCount++;
            }
        }
        
        $this->command->info($examCount . ' examens créés avec succès.');
        $this->command->info('3 examens par module: Normal, Rattrapage, Remplacement');
    }
}
