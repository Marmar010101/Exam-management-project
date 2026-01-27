<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Module;
use App\Models\Room;
use Illuminate\Database\Seeder;

class CorrectedExamSeeder extends Seeder
{
    public function run(): void
    {
        // Vider les examens existants
        Exam::query()->delete();
        
        // Récupérer tous les modules et salles
        $modules = Module::all();
        $rooms = Room::all();
        
        if ($modules->count() === 0) {
            $this->command->error('Aucun module trouvé. Veuillez d\'abord exécuter le ModuleSeeder.');
            return;
        }
        
        if ($rooms->count() === 0) {
            $this->command->error('Aucune salle trouvée.');
            return;
        }
        
        $examTypes = ['Normal', 'Replacement', 'Retake']; // Types pour Exam
        $controlTypes = ['Normal', 'Replacement']; // Types pour Control
        $testTypes = ['Test']; // Type pour Test_TP
        
        // Dates d'examens pour janvier 2026
        $examDates = [
            '2026-01-15', '2026-01-16', '2026-01-17', '2026-01-18', '2026-01-19', '2026-01-20', '2026-01-21', '2026-01-22',
            '2026-01-23', '2026-01-24', '2026-01-25', '2026-01-26', '2026-01-27', '2026-01-28', '2026-01-29', '2026-01-30',
            '2026-01-31'
        ];
        
        // Créneaux horaires
        $timeSlots = ['08:30:00', '10:45:00', '13:00:00', '15:15:00', '17:30:00'];
        
        $examIndex = 0;
        
        // Pour chaque module, créer des examens pour chaque type
        foreach ($modules as $module) {
            // Exam types
            foreach ($examTypes as $type) {
                $this->createExam($module, 'Exam', $type, $examDates, $timeSlots, $rooms, $examIndex);
                $examIndex++;
            }
            
            // Control types
            foreach ($controlTypes as $type) {
                $this->createExam($module, 'Control', $type, $examDates, $timeSlots, $rooms, $examIndex);
                $examIndex++;
            }
            
            // Test_TP types
            foreach ($testTypes as $type) {
                $this->createExam($module, 'Test TP', $type, $examDates, $timeSlots, $rooms, $examIndex);
                $examIndex++;
            }
        }
        
        $this->command->info('Examens créés avec succès pour ' . $modules->count() . ' modules.');
        $this->command->info('Chaque module a des examens pour: Exam (3 types), Control (2 types), Test_TP (1 type)');
    }
    
    private function createExam($module, $examCategory, $type, $examDates, $timeSlots, $rooms, $examIndex): void
    {
        // Calculer la date et l'heure
        $dateIndex = $examIndex % count($examDates);
        $timeIndex = ($examIndex % count($timeSlots));
        $roomIndex = ($examIndex % $rooms->count());
        
        // Récupérer un groupe compatible avec le module
        $compatibleGroup = \App\Models\Group::where('level_id', $module->level_id)
            ->where('speciality_id', $module->speciality_id)
            ->first();
        
        $groupId = $compatibleGroup ? $compatibleGroup->id : 1; // Utiliser 1 comme fallback
        
        Exam::create([
            'module_id' => $module->id,
            'module_id_old' => $module->id, // Ajouter ce champ
            'semester_id' => $module->semester_id, // Utiliser le semestre du module
            'group_id' => $groupId, // Assigner un groupe compatible
            'exam_type' => $examCategory,
            'exam_subtype' => $type,
            'title' => $this->generateExamTitle($module, $examCategory, $type),
            'description' => "Examen {$type} pour le module {$module->module_name}",
            'exam_date_old' => $examDates[$dateIndex],
            'exam_time_old' => $timeSlots[$timeIndex],
            'teacher_id' => 18, // Utiliser un teacher_id valide
            'room_id' => $rooms->get($roomIndex)->id,
            'duration' => $this->getExamDuration($type),
            'duration_minutes' => $this->getExamDuration($type),
            'max_score' => 20,
            'status' => 'pending',
            'created_by' => 1, // Utiliser un user_id par défaut
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
    
    private function generateExamTitle($module, $examCategory, $type): string
    {
        return "{$module->module_name} - {$examCategory} {$type}";
    }
    
    private function getExamDuration($type): int
    {
        return match($type) {
            'Normal' => 120,
            'Replacement' => 90,
            'Retake' => 120,
            'Test' => 60,
            default => 120
        };
    }
}
