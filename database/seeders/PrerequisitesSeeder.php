<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrerequisitesSeeder extends Seeder
{
    public function run()
    {
        // Create required levels if they don't exist
        $levels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

        foreach ($levels as $levelName) {
            DB::table('levels')->updateOrInsert(
                ['name' => $levelName],
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // Create required specialties if they don't exist
        $specialties = [
            'Systèmes d\'Information',
            'Génie Logiciel',
            'Intelligence Artificielle',
            'Réseaux',
            'Systèmes d\'Information et Connaissances'
        ];

        foreach ($specialties as $specialtyName) {
            DB::table('specialities')->updateOrInsert(
                ['name' => $specialtyName],
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('Prerequisites (levels and specialties) seeded successfully!');
    }
}
