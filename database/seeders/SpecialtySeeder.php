<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SpecialtySeeder extends Seeder
{
    public function run(): void
    {
        \DB::table('specialities')->delete();
        
        $specialties = [
            [
                'name' => 'Intelligence Artificielle',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Génie Logiciel',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Réseaux',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Systèmes d\'Information et Communication',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tronc Commun',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];
        
        \DB::table('specialities')->insert($specialties);
        
        $this->command->info('Spécialités créées avec succès.');
    }
}
