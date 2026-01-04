<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Module;
use Illuminate\Database\Seeder;

class GroupModuleSeeder extends Seeder
{
    public function run()
    {
        // Get all groups and modules
        $groups = Group::all();
        $modules = Module::all();

        // Assign modules to groups based on level and speciality
        foreach ($groups as $group) {
            // For L1 groups (levels 1-2), assign basic modules
            if (in_array($group->level_id, [1, 2])) {
                $basicModules = $modules->take(3); // First 3 modules
                foreach ($basicModules as $module) {
                    $group->modules()->attach($module->id);
                }
            }
            // For L2 groups (levels 3-4), assign intermediate modules  
            elseif (in_array($group->level_id, [3, 4])) {
                $intermediateModules = $modules->skip(2)->take(3); // Modules 3-5
                foreach ($intermediateModules as $module) {
                    $group->modules()->attach($module->id);
                }
            }
            // For L3/M1 groups (level 5), assign advanced modules
            elseif ($group->level_id == 5) {
                $advancedModules = $modules->skip(4); // Last modules
                foreach ($advancedModules as $module) {
                    $group->modules()->attach($module->id);
                }
            }
        }

        $this->command->info('Group-module relationships created successfully!');
    }
}
