<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Speciality;
use App\Models\Level;
use App\Models\Semester;
use Illuminate\Database\Seeder;

class ModuleExamTypesSeeder extends Seeder
{
    public function run(): void
    {
        // Ajouter les types d'examens aux modules existants
        $modules = Module::all();
        
        foreach ($modules as $module) {
            $examTypes = $this->getExamTypesForModule($module);
            $module->exam_types = $examTypes;
            $module->save();
        }
        
        $this->command->info('Types d\'examens ajoutés à ' . $modules->count() . ' modules.');
    }
    
    private function getExamTypesForModule($module): array
    {
        // Logique pour déterminer les types d'examens selon le module
        $moduleName = strtolower($module->module_name);
        $moduleCode = strtolower($module->code);
        $moduleId = $module->id;
        
        // 60% des modules auront des contrôles (basé sur l'ID du module)
        $hasControl = ($moduleId % 100) < 60; // Environ 60% des modules
        
        // Modules avec TP (très peu de modules)
        if (str_contains($moduleName, 'tp') || str_contains($moduleName, 'labo')) {
            return $hasControl ? ['Exam', 'Control', 'Test_TP'] : ['Exam', 'Test_TP'];
        }
        
        // Modules de programmation (certains avec TP)
        if (str_contains($moduleName, 'programmation') || str_contains($moduleCode, 'tc') || 
            str_contains($moduleCode, 'gl') || str_contains($moduleCode, 'res')) {
            return $hasControl ? ['Exam', 'Control', 'Test_TP'] : ['Exam', 'Test_TP'];
        }
        
        // Tous les autres modules ont des examens
        // Seulement 60% ont aussi des contrôles
        return $hasControl ? ['Exam', 'Control'] : ['Exam'];
    }
}
