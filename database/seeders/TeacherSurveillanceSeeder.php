<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TeacherSurveillanceSeeder extends Seeder
{
    public function run()
    {
        // Get teacher IDs from users table where role = 'teacher'
        $teacherOmar = DB::table('users')->where('matricule', 'TCH001')->first();
        $teacherLeila = DB::table('users')->where('matricule', 'TCH002')->first();
        
        if (!$teacherOmar || !$teacherLeila) {
            return; // Skip if teachers don't exist
        }
        
        // Créer des surveillances pour les enseignants
        $surveillances = [
            [
                'module' => 'Algorithmique',
                'module_id' => 1,
                'group' => 'L1 SI A',
                'date' => Carbon::now()->addDays(2),
                'time' => '08:00 - 10:00',
                'room' => 'A101',
                'urgency' => 'normal',
                'teacher_id' => $teacherOmar->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'module' => 'Bases de Données',
                'module_id' => 2,
                'group' => 'L1 SI B',
                'date' => Carbon::now()->addDays(3),
                'time' => '10:00 - 12:00',
                'room' => 'B201',
                'urgency' => 'normal',
                'teacher_id' => $teacherOmar->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'module' => 'Réseaux',
                'module_id' => 3,
                'group' => 'L2 SI A',
                'date' => Carbon::now()->addDays(5),
                'time' => '14:00 - 16:00',
                'room' => 'C301',
                'urgency' => 'high',
                'teacher_id' => $teacherLeila->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'module' => 'Programmation Web',
                'module_id' => 4,
                'group' => 'L2 SI B',
                'date' => Carbon::now()->addDays(7),
                'time' => '08:00 - 10:00',
                'room' => 'D101',
                'urgency' => 'normal',
                'teacher_id' => $teacherLeila->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'module' => 'Intelligence Artificielle',
                'module_id' => 5,
                'group' => 'M1 SI',
                'date' => Carbon::now()->addDays(10),
                'time' => '10:00 - 12:00',
                'room' => 'A102',
                'urgency' => 'normal',
                'teacher_id' => $teacherOmar->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($surveillances as $surveillance) {
            DB::table('teacher_surveillances')->insert($surveillance);
        }
    }
}
