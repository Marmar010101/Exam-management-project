<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BasicGroupSeeder extends Seeder
{
    public function run()
    {
        // Créer quelques groupes simples sans relations complexes
        $groups = [
            ['name' => 'Groupe 1', 'level_id' => 1, 'speciality_id' => 1, 'semester_id' => 1],
            ['name' => 'Groupe 2', 'level_id' => 2, 'speciality_id' => 2, 'semester_id' => 2],
            ['name' => 'Groupe 3', 'level_id' => 3, 'speciality_id' => 3, 'semester_id' => 3],
        ];

        foreach ($groups as $group) {
            DB::table('groups')->insert(array_merge($group, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        echo "Groupes créés avec succès!\n";
    }
}
