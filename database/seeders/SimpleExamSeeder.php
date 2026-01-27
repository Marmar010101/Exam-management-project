<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Module;
use Illuminate\Database\Seeder;

class SimpleExamSeeder extends Seeder
{
    public function run(): void
    {
        // Vider les examens existants
        Exam::query()->delete();
        
        // Récupérer tous les modules
        $modules = Module::all();
        
        if ($modules->count() === 0) {
            $this->command->error('Aucun module trouvé.');
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
        $examsToInsert = [];
        
        // Pour chaque module, créer des examens pour chaque type
        foreach ($modules as $module) {
            // Exam types
            foreach ($examTypes as $type) {
                $examsToInsert[] = $this->createExamArray($module, 'Exam', $type, $examDates, $timeSlots, $examIndex);
                $examIndex++;
            }
            
            // Control types
            foreach ($controlTypes as $type) {
                $examsToInsert[] = $this->createExamArray($module, 'Control', $type, $examDates, $timeSlots, $examIndex);
                $examIndex++;
            }
            
            // Test_TP types
            foreach ($testTypes as $type) {
                $examsToInsert[] = $this->createExamArray($module, 'Test TP', $type, $examDates, $timeSlots, $examIndex);
                $examIndex++;
            }
        }
        
        // Insérer en lots pour éviter les problèmes de contraintes
        foreach (array_chunk($examsToInsert, 100) as $chunk) {
            try {
                Exam::insert($chunk);
            } catch (\Exception $e) {
                $this->command->error('Erreur lors de l\'insertion: ' . $e->getMessage());
                // Continuer avec le lot suivant
            }
        }
        
        $this->command->info(count($examsToInsert) . ' examens créés avec succès pour ' . $modules->count() . ' modules.');
        $this->command->info('Chaque module a des examens pour: Exam (3 types), Control (2 types), Test_TP (1 type)');
    }
    
    private function createExamArray($module, $examCategory, $type, $examDates, $timeSlots, $examIndex): array
    {
        // Calculer la date et l'heure
        $dateIndex = $examIndex % count($examDates);
        $timeIndex = ($examIndex % count($timeSlots));
        
        return [
            'module_id' => $module->id,
            'module_id_old' => $module->id,
            'semester_id' => $module->semester_id,
            'group_id' => null, // Nullable pour éviter les contraintes
            'exam_type' => $examCategory,
            'exam_subtype' => $type,
            'title' => $this->generateExamTitle($module, $examCategory, $type),
            'description' => "Examen {$type} pour le module {$module->module_name}",
            'exam_date_old' => $examDates[$dateIndex],
            'exam_time_old' => $timeSlots[$timeIndex],
            'teacher_id' => null, // Nullable pour éviter les contraintes
            'room_id' => null, // Nullable pour éviter les contraintes
            'duration' => $this->getExamDuration($type),
            'duration_minutes' => $this->getExamDuration($type),
            'max_score' => 20,
            'status' => 'pending',
            'created_by' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ];
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
