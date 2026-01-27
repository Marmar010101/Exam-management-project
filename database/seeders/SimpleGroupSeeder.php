<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\Level;
use App\Models\Specialty;
use App\Models\Semester;

class SimpleGroupSeeder extends Seeder
{
    public function run()
    {
        $levels = Level::all();
        $specialties = Specialty::all();
        $semesters = Semester::all();

        if ($levels->isEmpty() || $specialties->isEmpty()) {
            echo "Aucun niveau ou spécialité trouvé.\n";
            return;
        }

        // Créer quelques groupes simples
        $groupNames = ['Groupe A', 'Groupe B', 'Groupe C', 'Groupe D', 'Groupe E'];
        
        foreach ($levels->take(3) as $index => $level) {
            $specialty = $specialties->random();
            $semester = $semesters->random();
            
            Group::create([
                'name' => $groupNames[$index] ?? 'Groupe ' . ($index + 1),
                'level_id' => $level->id,
                'speciality_id' => $specialty->id,
                'semester_id' => $semester->id,
            ]);
        }

        echo "Groupes créés avec succès!\n";
    }
}
