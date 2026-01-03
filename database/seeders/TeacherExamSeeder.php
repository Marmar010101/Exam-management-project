<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TeacherExamSeeder extends Seeder
{
    public function run()
    {
        // Get teacher IDs from users table where role = 'teacher'
        $teacherOmar = DB::table('users')->where('matricule', 'TCH001')->first();
        $teacherLeila = DB::table('users')->where('matricule', 'TCH002')->first();
        
        if (!$teacherOmar || !$teacherLeila) {
            return; // Skip if teachers don't exist
        }
        
        // Créer des examens pour les enseignants
        $exams = [
            [
                'module' => 'Algorithmique',
                'module_id' => 1,
                'type' => 'normal',
                'date' => Carbon::now()->addDays(15),
                'duration' => '2 heures',
                'group' => 'L1 SI A',
                'room' => 'A101',
                'teacher_id' => $teacherOmar->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'module' => 'Bases de Données',
                'module_id' => 2,
                'type' => 'normal',
                'date' => Carbon::now()->addDays(18),
                'duration' => '2 heures',
                'group' => 'L1 SI B',
                'room' => 'B201',
                'teacher_id' => $teacherOmar->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'module' => 'Réseaux',
                'module_id' => 3,
                'type' => 'rattrapage',
                'date' => Carbon::now()->addDays(20),
                'duration' => '3 heures',
                'group' => 'L2 SI A',
                'room' => 'C301',
                'teacher_id' => $teacherLeila->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'module' => 'Programmation Web',
                'module_id' => 4,
                'type' => 'normal',
                'date' => Carbon::now()->addDays(22),
                'duration' => '2 heures',
                'group' => 'L2 SI B',
                'room' => 'D101',
                'teacher_id' => $teacherLeila->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'module' => 'Intelligence Artificielle',
                'module_id' => 5,
                'type' => 'normal',
                'date' => Carbon::now()->addDays(25),
                'duration' => '3 heures',
                'group' => 'M1 SI',
                'room' => 'A102',
                'teacher_id' => $teacherOmar->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($exams as $exam) {
            DB::table('teacher_exams')->insert($exam);
        }
    }
}
