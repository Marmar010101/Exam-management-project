<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Module;
use Illuminate\Database\Seeder;

class WorkingExamSeeder extends Seeder
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
        $successCount = 0;
        $errorCount = 0;
        
        // Pour chaque module, créer des examens pour chaque type
        foreach ($modules as $module) {
            // Exam types
            foreach ($examTypes as $type) {
                try {
                    $this->createSingleExam($module, 'Exam', $type, $examDates, $timeSlots, $examIndex);
                    $successCount++;
                    $examIndex++;
                } catch (\Exception $e) {
                    $this->command->error("Erreur création Exam {$type} pour module {$module->module_name}: " . $e->getMessage());
                    $errorCount++;
                }
            }
            
            // Control types
            foreach ($controlTypes as $type) {
                try {
                    $this->createSingleExam($module, 'Control', $type, $examDates, $timeSlots, $examIndex);
                    $successCount++;
                    $examIndex++;
                } catch (\Exception $e) {
                    $this->command->error("Erreur création Control {$type} pour module {$module->module_name}: " . $e->getMessage());
                    $errorCount++;
                }
            }
            
            // Test_TP types
            foreach ($testTypes as $type) {
                try {
                    $this->createSingleExam($module, 'Test TP', $type, $examDates, $timeSlots, $examIndex);
                    $successCount++;
                    $examIndex++;
                } catch (\Exception $e) {
                    $this->command->error("Erreur création Test TP {$type} pour module {$module->module_name}: " . $e->getMessage());
                    $errorCount++;
                }
            }
            
            // Afficher la progression tous les 10 modules
            if ($module->id % 10 == 0) {
                $this->command->info("Traité {$module->id} modules, {$successCount} examens créés, {$errorCount} erreurs");
            }
        }
        
        $this->command->info("\n=== RÉSULTAT FINAL ===");
        $this->command->info("✅ {$successCount} examens créés avec succès");
        $this->command->info("❌ {$errorCount} examens en erreur");
        $this->command->info("📊 Total: " . ($successCount + $errorCount) . " examens tentés pour " . $modules->count() . " modules");
        
        // Vérification finale
        $finalCount = Exam::count();
        $this->command->info("🔍 Vérification: {$finalCount} examens dans la base de données");
    }
    
    private function createSingleExam($module, $examCategory, $type, $examDates, $timeSlots, $examIndex): void
    {
        // Calculer la date et l'heure
        $dateIndex = $examIndex % count($examDates);
        $timeIndex = ($examIndex % count($timeSlots));
        
        Exam::create([
            'module_id' => $module->id,
            'module_id_old' => $module->id,
            'semester_id' => $module->semester_id,
            'group_id' => null,
            'exam_type' => $examCategory,
            'exam_subtype' => $type,
            'title' => $this->generateExamTitle($module, $examCategory, $type),
            'description' => "Examen {$type} pour le module {$module->module_name}",
            'exam_date_old' => $examDates[$dateIndex],
            'exam_time_old' => $timeSlots[$timeIndex],
            'teacher_id' => null,
            'room_id' => null,
            'duration' => $this->getExamDuration($type),
            'duration_minutes' => $this->getExamDuration($type),
            'max_score' => 20,
            'status' => 'pending',
            'created_by' => 1,
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
