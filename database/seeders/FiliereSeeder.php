<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filiere;

class FiliereSeeder extends Seeder
{
    public function run()
    {
        $filieres = [
            [
                'name' => 'Informatique Fondamentale',
                'description' => 'Filière axée sur les fondements de l\'informatique',
                'code' => 'IF'
            ],
            [
                'name' => 'Systèmes d\'Information',
                'description' => 'Filière axée sur les systèmes d\'information et réseaux',
                'code' => 'SI'
            ],
            [
                'name' => 'Logiciels Intelligents',
                'description' => 'Filière axée sur l\'intelligence artificielle et les logiciels',
                'code' => 'LI'
            ],
            [
                'name' => 'Ingénierie Informatique',
                'description' => 'Filière axée sur l\'ingénierie informatique',
                'code' => 'II'
            ],
            [
                'name' => 'Science des Données',
                'description' => 'Filière axée sur la gestion et l\'analyse des données',
                'code' => 'SD'
            ]
        ];

        foreach ($filieres as $filiere) {
            Filiere::create($filiere);
        }

        $this->command->info('Filières créées avec succès !');
    }
}
