<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TeacherModuleSeeder extends Seeder
{
    public function run()
    {
        // Get teacher IDs from users table where role = 'teacher'
        $teacherOmar = DB::table('users')->where('matricule', 'TCH001')->first();
        $teacherLeila = DB::table('users')->where('matricule', 'TCH002')->first();
        
        if (!$teacherOmar || !$teacherLeila) {
            return; // Skip if teachers don't exist
        }
        
        // Assigner des modules aux enseignants
        $teacherModules = [
            // Dr. Omar (teacher_id = 2)
            ['teacher_id' => $teacherOmar->id, 'module_id' => 1], // Algorithmique
            ['teacher_id' => $teacherOmar->id, 'module_id' => 2], // Bases de Données
            ['teacher_id' => $teacherOmar->id, 'module_id' => 5], // Intelligence Artificielle
            
            // Dr. Leila (teacher_id = 3)
            ['teacher_id' => $teacherLeila->id, 'module_id' => 3], // Réseaux
            ['teacher_id' => $teacherLeila->id, 'module_id' => 4], // Programmation Web
        ];

        foreach ($teacherModules as $assignment) {
            DB::table('teacher_modules')->insert([
                'teacher_id' => $assignment['teacher_id'],
                'module_id' => $assignment['module_id'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
