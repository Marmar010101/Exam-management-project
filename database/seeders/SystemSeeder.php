<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SystemSeeder extends Seeder
{
    public function run(): void
    {
        \DB::table('cycles')->delete();
        
        $systems = [
            [
                'cycle_name' => 'Système Ingénieur',
                'cycle_type' => 'engineer',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cycle_name' => 'Système LMD',
                'cycle_type' => 'lmd',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cycle_name' => 'Licence',
                'cycle_type' => 'LMD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cycle_name' => 'Master',
                'cycle_type' => 'LMD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cycle_name' => 'Engineer_Tronc_commun',
                'cycle_type' => 'ING',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cycle_name' => 'Engineer',
                'cycle_type' => 'ING',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];
        
        \DB::table('cycles')->insert($systems);
        
        $this->command->info('Systèmes créés avec succès.');
    }
}
