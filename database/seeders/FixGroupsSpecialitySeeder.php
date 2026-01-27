<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Speciality;
use Illuminate\Database\Seeder;

class FixGroupsSpecialitySeeder extends Seeder
{
    public function run(): void
    {
        // Get specialities
        $specialities = Speciality::all()->keyBy('id');
        
        // Update groups with correct speciality_id based on their names
        $groups = Group::all();
        
        foreach ($groups as $group) {
            $specialityId = null;
            
            // Determine speciality based on group name
            if (strpos($group->name, 'Génie Logiciel') !== false || strpos($group->name, 'GL') !== false) {
                $specialityId = 7; // Génie Logiciel
            } elseif (strpos($group->name, 'Intelligence Artificielle') !== false || strpos($group->name, 'IA') !== false) {
                $specialityId = 6; // Intelligence Artificielle
            } elseif (strpos($group->name, 'Réseaux') !== false || strpos($group->name, 'RSD') !== false) {
                $specialityId = 8; // Réseaux
            } elseif (strpos($group->name, 'Systèmes d\'Information') !== false || strpos($group->name, 'SIC') !== false) {
                $specialityId = 9; // Systèmes d'Information
            } else {
                // Tronc Commun (Ingénieur 1ère/2ème année et Licence)
                $specialityId = 10; // Tronc Commun
            }
            
            $group->update(['speciality_id' => $specialityId]);
            
            echo "Updated group {$group->name} with speciality_id {$specialityId}\n";
        }
        
        $this->command->info('Groups speciality_id updated successfully!');
    }
}
