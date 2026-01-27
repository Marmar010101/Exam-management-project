<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\Level;
use App\Models\Semester;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    $groups = [
            // Utiliser les premiers niveaux disponibles (1-5)
            ['name' => 'Groupe 1-1', 'level_id' => 1, 'speciality_id' => 1],
            ['name' => 'Groupe 1-2', 'level_id' => 2, 'speciality_id' => 1],
            ['name' => 'Groupe 2-1', 'level_id' => 3, 'speciality_id' => 2],
            ['name' => 'Groupe 2-2', 'level_id' => 4, 'speciality_id' => 2],
            ['name' => 'Groupe 3-1', 'level_id' => 5, 'speciality_id' => 3],
            ['name' => 'Groupe 3-2', 'level_id' => 1, 'speciality_id' => 3],
        ];
        
        foreach($groups as $g) {
            Group::create(array_merge($g, ['semester_id' => 211]));
        }

    }
}
