<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreateExamPlansSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer les IDs des modules, groupes, enseignants, salles
        $modules = DB::table('modules')->pluck('id', 'module_name');
        $groups = DB::table('groups')->pluck('id', 'name');
        $teachers = DB::table('teachers')->pluck('id', 'first_name');
        $rooms = DB::table('rooms')->pluck('id', 'room_name');
        
        echo "Available modules: " . $modules->count() . PHP_EOL;
        echo "Available groups: " . $groups->count() . PHP_EOL;
        echo "Available teachers: " . $teachers->count() . PHP_EOL;
        echo "Available rooms: " . $rooms->count() . PHP_EOL;
        
        // Créer des examens de test pour chaque combinaison
        $examPlans = [];
        $examTypes = ['Exam', 'Control', 'Test_TP'];
        
        // Prendre quelques modules et groupes pour créer des examens
        $sampleModules = $modules->take(8);
        $sampleGroups = $groups->take(12);
        $sampleTeachers = $teachers->take(6);
        $sampleRooms = $rooms->take(8);
        
        foreach ($sampleModules as $moduleName => $moduleId) {
            foreach ($examTypes as $examType) {
                // Assigner des groupes aléatoires pour cet examen
                $assignedGroups = $sampleGroups->random(3);
                
                $examPlans[] = [
                    'module_id' => $moduleId,
                    'module_name' => $moduleName,
                    'exam_type' => [$examType], // Stocker comme array
                    'groups' => $assignedGroups->map(function($groupId, $groupName) {
                        return [
                            'group_id' => $groupId,
                            'group_name' => $groupName,
                            'exam_date' => now()->addDays(rand(1, 30))->format('Y-m-d'),
                            'exam_time' => sprintf('%02d:00', rand(8, 17)),
                        ];
                    })->toArray(),
                    'teacher_id' => $sampleTeachers->random(),
                    'room_id' => $sampleRooms->random(),
                    'start_date' => now()->addDays(rand(1, 30))->format('Y-m-d'),
                    'end_date' => now()->addDays(rand(31, 60))->format('Y-m-d'),
                    'start_time' => sprintf('%02d:00', rand(8, 16)),
                    'end_time' => sprintf('%02d:00', rand(17, 19)),
                    'description' => "Examen de type {$examType} pour le module {$moduleName}",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Insérer les exam plans
        foreach ($examPlans as $examPlan) {
            // Prendre le premier groupe assigné
            $firstGroup = $examPlan['groups'][0];
            
            $examPlanId = DB::table('exam_plans')->insertGetId([
                'module_id' => $examPlan['module_id'],
                'group_id' => $firstGroup['group_id'],
                'teacher_id' => $examPlan['teacher_id'],
                'room_id' => $examPlan['room_id'],
                'exam_type' => $examPlan['exam_type'][0], // Prendre le premier type
                'exam_date' => $firstGroup['exam_date'], // Utiliser la date du premier groupe
                'duration_minutes' => 120, // 2 heures par défaut
                'start_date' => $examPlan['start_date'],
                'end_date' => $examPlan['end_date'],
                'start_time' => $examPlan['start_time'],
                'end_time' => $examPlan['end_time'],
                'description' => $examPlan['description'],
                'created_by' => 1, // ID de l'utilisateur qui crée (responsable)
                'created_at' => $examPlan['created_at'],
                'updated_at' => $examPlan['updated_at'],
            ]);
            
            echo "Exam plan created: {$examPlan['module_name']} - {$examPlan['exam_type'][0]} (Group: {$firstGroup['group_name']}) (ID: {$examPlanId})\n";
        }
        
        echo "\nCréation terminée! " . count($examPlans) . " exam plans créés.\n";
    }
}
