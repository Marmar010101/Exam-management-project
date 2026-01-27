<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateModulesSemesterSeeder extends Seeder
{
    public function run(): void
    {
        $modules = DB::table('modules')->get();
        
        echo "Mise à jour des modules avec semester_id...\n";
        
        foreach ($modules as $module) {
            // Logique simple: assigner semester_id basé sur level_id
            $semesterMapping = [
                11 => 23, // L1 -> S1
                12 => 22, // L2 -> S2
                13 => 21, // L3 -> S3
                14 => 20, // M1 -> S4
                15 => 19, // M2 -> S5
                16 => 23, // ing1 -> S1
                17 => 22, // ing2 -> S2
                18 => 21, // ing3 -> S3
                19 => 20, // ing4 -> S4
                20 => 19, // ing5 -> S5
            ];
            
            $semesterId = $semesterMapping[$module->level_id] ?? 23; // Default to S1
            
            DB::table('modules')
                ->where('id', $module->id)
                ->update(['semester_id' => $semesterId]);
            
            echo "Module {$module->module_name} -> semester_id: {$semesterId}\n";
        }
        
        echo "Mise à jour terminée! " . count($modules) . " modules mis à jour.\n";
    }
}
