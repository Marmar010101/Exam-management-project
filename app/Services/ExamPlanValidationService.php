<?php

namespace App\Services;

use App\Models\ExamPlan;
use App\Models\Module;
use Carbon\Carbon;

class ExamPlanValidationService
{
    /**
     * Valide les contraintes de planification d'examen
     */
    public static function validateExamPlan($groupId, $moduleId, $examDate, $startTime, $endTime, $excludeId = null)
    {
        $errors = [];
        
        // Convertir les temps en objets Carbon
        $startDateTime = Carbon::parse($examDate . ' ' . $startTime);
        $endDateTime = Carbon::parse($examDate . ' ' . $endTime);
        $duration = $startDateTime->diffInMinutes($endDateTime);
        
        // 1. Vérifier la durée (entre 30 min et 90 min)
        if ($duration < 30) {
            $errors[] = 'La durée minimale d\'un examen est de 30 minutes.';
        }
        
        if ($duration > 90) {
            $errors[] = 'La durée maximale d\'un examen est de 90 minutes (1h30).';
        }
        
        // 2. Vérifier les modules principaux le même jour
        if (self::isMainModule($moduleId)) {
            $existingMainModule = ExamPlan::where('exam_date', $examDate)
                ->where(function($query) use ($moduleId) {
                    $query->where('module_id', $moduleId)
                          ->orWhere(function($subQuery) {
                              $mainKeywords = self::getMainModules();
                              foreach ($mainKeywords as $keyword) {
                                  $subQuery->whereHas('module', function($moduleQuery) use ($keyword) {
                                      $moduleQuery->where('module_name', 'LIKE', "%{$keyword}%");
                                  });
                              }
                          });
                })
                ->when($excludeId, function($query) use ($excludeId) {
                    return $query->where('id', '!=', $excludeId);
                })
                ->exists();
            
            if ($existingMainModule) {
                $errors[] = 'Un module principal ne peut pas être programmé le même jour qu\'un autre module principal.';
            }
        }
        
        // 3. Vérifier l'intervalle de 2 jours entre les examens du même groupe
        $groupExams = ExamPlan::where('group_id', $groupId)
            ->when($excludeId, function($query) use ($excludeId) {
                return $query->where('id', '!=', $excludeId);
            })
            ->get();
        
        foreach ($groupExams as $existingExam) {
            $existingDate = Carbon::parse($existingExam->exam_date);
            $currentDate = Carbon::parse($examDate);
            
            $daysDiff = abs($currentDate->diffInDays($existingDate));
            
            if ($daysDiff < 2) {
                $errors[] = 'Il doit y avoir au moins 2 jours entre les examens pour le même groupe.';
                break;
            }
        }
        
        // 4. Vérifier le nombre d'examens par jour (max 3)
        $dailyExamCount = ExamPlan::where('exam_date', $examDate)
            ->when($excludeId, function($query) use ($excludeId) {
                return $query->where('id', '!=', $excludeId);
            })
            ->count();
        
        if ($dailyExamCount >= 3) {
            $errors[] = 'Le nombre maximum d\'examens par jour est de 3.';
        }
        
        // 5. Vérifier que l'enseignant ne surveille pas son propre examen (sauf remplacement)
        $module = Module::find($moduleId);
        if ($module && $module->teacher_id) {
            // Cette vérification sera faite au niveau du contrôleur
            // car on ne peut pas savoir ici si c'est un remplacement
        }
        
        return $errors;
    }
    
    /**
     * Récupère la liste des modules principaux
     */
    private static function getMainModules()
    {
        // Mots-clés pour identifier les modules principaux
        return [
            'Algorithmique', 'Bases de Données', 'Systèmes d\'Exploitation', 
            'Algèbre', 'Analyse', 'Génie Logiciel', 
            'Intelligence Artificielle', 'Réseaux', 'Probabilités et Statistiques'
        ];
    }
    
    /**
     * Vérifie si un module est principal
     */
    private static function isMainModule($moduleId)
    {
        $module = Module::find($moduleId);
        if (!$module) return false;
        
        $mainKeywords = self::getMainModules();
        
        foreach ($mainKeywords as $keyword) {
            if (stripos($module->module_name, $keyword) !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Récupère les modules par niveau et spécialité
     */
    public static function getModulesByLevelAndSpeciality($levelId, $specialityId)
    {
        return Module::where('level_id', $levelId)
            ->where('speciality_id', $specialityId)
            ->orderBy('module_name')
            ->get();
    }
    
    /**
     * Vérifie les conflits d'horaires pour un enseignant
     */
    public static function checkTeacherConflict($teacherId, $examDate, $startTime, $endTime, $excludeId = null)
    {
        $conflicts = ExamPlan::where('teacher_id', $teacherId)
            ->where('exam_date', $examDate)
            ->when($excludeId, function($query) use ($excludeId) {
                return $query->where('id', '!=', $excludeId);
            })
            ->get();
        
        $conflictList = [];
        foreach ($conflicts as $conflict) {
            if (self::timeOverlap($startTime, $endTime, $conflict->start_time, $conflict->end_time)) {
                $conflictList[] = $conflict;
            }
        }
        
        return $conflictList;
    }
    
    /**
     * Vérifie si deux plages horaires se chevauchent
     */
    private static function timeOverlap($start1, $end1, $start2, $end2)
    {
        return ($start1 < $end2) && ($start2 < $end1);
    }
}
