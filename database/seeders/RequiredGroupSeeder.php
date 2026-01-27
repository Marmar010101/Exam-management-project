<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RequiredGroupSeeder extends Seeder
{
    public function run()
    {
        // Créer un groupe de base pour les examens
        DB::table('groups')->insert([
            'name' => 'Groupe A',
            'level_id' => 1,
            'speciality_id' => 1,
            'semester_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        echo "Groupe de base créé pour les examens\n";
    }
}
