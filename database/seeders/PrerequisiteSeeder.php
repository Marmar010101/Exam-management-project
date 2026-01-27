<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class PrerequisiteSeeder extends Seeder
{
    public function run(): void
    {
        \DB::table('module_prerequisites')->delete();
        
        // Get some modules for prerequisites
        $modules = Module::all()->keyBy('code');
        
        $prerequisites = [
            // Advanced algorithms require basic algorithms
            [
                'module_code' => 'L201',
                'prerequisite_code' => 'L102',
            ],
            [
                'module_code' => 'ING201',
                'prerequisite_code' => 'ING102',
            ],
            
            // Machine Learning requires AI introduction
            [
                'module_code' => 'IA302',
                'prerequisite_code' => 'IA301',
            ],
            
            // Database requires data structures
            [
                'module_code' => 'ING202',
                'prerequisite_code' => 'ING201',
            ],
            [
                'module_code' => 'L202',
                'prerequisite_code' => 'L201',
            ],
            
            // Network security requires introduction to networks
            [
                'module_code' => 'M301',
                'prerequisite_code' => 'L102',
            ],
            
            // Cloud computing requires network security
            [
                'module_code' => 'M302',
                'prerequisite_code' => 'M301',
            ],
        ];
        
        foreach ($prerequisites as $prereq) {
            $module = $modules->get($prereq['module_code']);
            $prerequisite = $modules->get($prereq['prerequisite_code']);
            
            if ($module && $prerequisite) {
                $module->prerequisites()->attach($prerequisite->id);
            }
        }
        
        $this->command->info(count($prerequisites) . ' relations de prérequis créées avec succès.');
    }
}
