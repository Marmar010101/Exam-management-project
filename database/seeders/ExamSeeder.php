<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Module;
use App\Models\Room;
use Illuminate\Database\Seeder;

class ExamSeeder extends Seeder
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
        
        $exams = [];
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
                $exam = $this->createExam($module, $type, $examDates, $timeSlots, $rooms, $examIndex);
                $exams[] = $exam;
                $examIndex++;
            }
            
            // Control types
            foreach ($controlTypes as $type) {
                $exam = $this->createExam($module, $type, $examDates, $timeSlots, $rooms, $examIndex);
                $exams[] = $exam;
                $examIndex++;
            }
            
            // Test_TP types
            foreach ($testTypes as $type) {
                $exam = $this->createExam($module, $type, $examDates, $timeSlots, $rooms, $examIndex);
                $exams[] = $exam;
                $examIndex++;
            }
        }
        
        // Insérer tous les examens un par un pour éviter les erreurs
        $successCount = 0;
        $errorCount = 0;
        
        foreach ($exams as $examData) {
            try {
                Exam::create($examData);
                $successCount++;
            } catch (\Exception $e) {
                $errorCount++;
                $this->command->error("Erreur pour l'examen: " . $e->getMessage());
            }
        }
        
        $this->command->info($successCount . ' examens créés avec succès pour ' . $modules->count() . ' modules.');
        if ($errorCount > 0) {
            $this->command->error($errorCount . ' examens ont échoué');
        }
        $this->command->info('Chaque module a des examens pour: Exam (3 types), Control (2 types), Test_TP (1 type)');
        
        // Afficher les détails
        $this->displayExamDetails();
    }
    
    private function createExam($module, $type, $examDates, $timeSlots, $rooms, $examIndex): array
    {
        // Calculer la date et l'heure
        $dateIndex = $examIndex % count($examDates);
        $timeIndex = ($examIndex % count($timeSlots));
        $roomIndex = ($examIndex % $rooms->count());
        
        // Déterminer le type d'examen correct
        $examType = match($type) {
            'Normal', 'Replacement', 'Retake' => 'Exam',
            'Test' => 'Test_TP',
            default => 'Control'
        };
        
        // Tous les examens sauf un seront acceptés
        $status = ($examIndex === 0) ? 'pending' : 'accepted';
        
        return [
            'module_id' => $module->id,  // Corrigé: module_id au lieu de id_module
            'module_id_old' => $module->id,  // Ajouté: module_id_old
            'group_id' => null,  // Ajouté: group_id peut être null
            'group_id_old' => null,  // Ajouté: group_id_old
            'title' => $examType . ' - ' . $module->module_name,  // Ajouté: title obligatoire
            'exam_date_old' => $examDates[$dateIndex],  // Corrigé: exam_date_old
            'exam_time_old' => $timeSlots[$timeIndex],  // Corrigé: exam_time_old
            'room_id' => $rooms->get($roomIndex)->id,
            'exam_type' => $examType,
            'exam_subtype' => $type,  // Garder le sous-type original
            'duration_minutes' => $this->getExamDuration($type),  // Corrigé: duration_minutes
            'status' => $status,  // 'accepted' pour la plupart, 'pending' pour un seul
            'created_by' => 40, // Responsable user ID
            'validated_by' => ($status === 'accepted') ? 41 : null, // Head Department ID si accepté
            'validated_at' => ($status === 'accepted') ? now() : null,
            'validation_notes' => ($status === 'accepted') ? 'Validé automatiquement' : null,
            'created_at' => now(),
            'updated_at' => now()
        ];
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
    
    private function displayExamDetails(): void
    {
        $this->command->info("\n=== DÉTAILS DES EXAMENS CRÉÉS ===\n");
        
        $modules = Module::all();
        $examCount = 0;
        $pendingCount = 0;
        $acceptedCount = 0;
        
        foreach ($modules as $module) {
            $moduleExams = Exam::where('module_id', $module->id)->get();  // Corrigé: module_id
            
            $this->command->info("Module: {$module->module_name} ({$module->code})");
            
            foreach ($moduleExams as $exam) {
                $examCount++;
                $room = $exam->room;
                $statusIcon = $exam->status === 'accepted' ? '✅' : '⏳';
                if ($exam->status === 'pending') $pendingCount++;
                if ($exam->status === 'accepted') $acceptedCount++;
                
                $this->command->info(sprintf(
                    "  %s - %s | %s | %s | %s | %d min | %s",
                    $statusIcon,
                    $exam->exam_type,
                    $exam->exam_date_old,  // Corrigé: exam_date_old
                    substr($exam->exam_time_old, 0, 5),  // Corrigé: exam_time_old
                    $room ? $room->room_name : 'Unknown',
                    $exam->duration_minutes,  // Corrigé: duration_minutes
                    $exam->status
                ));
            }
            
            $this->command->info(""); // Ligne vide entre les modules
        }
        
        $this->command->info("Total: {$examCount} examens créés");
        $this->command->info("✅ Acceptés: {$acceptedCount} | ⏳ En attente: {$pendingCount}");
        
        // Statistiques par type
        $examCount = Exam::where('exam_type', 'Exam')->count();
        $controlCount = Exam::where('exam_type', 'Control')->count();
        $testTPCount = Exam::where('exam_type', 'Test_TP')->count();
        
        $this->command->info("\nRépartition par type:");
        $this->command->info("- Exam: {$examCount}");
        $this->command->info("- Control: {$controlCount}");
        $this->command->info("- Test_TP: {$testTPCount}");
    }
}
