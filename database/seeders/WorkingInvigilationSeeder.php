<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkingInvigilationSeeder extends Seeder
{
    public function run()
    {
        // Vérifier si des examens existent
        $examCount = DB::table('exams')->count();
        $teacherCount = DB::table('teachers')->count();
        $roomCount = DB::table('rooms')->count();
        
        echo "Exams: $examCount, Teachers: $teacherCount, Rooms: $roomCount\n";
        
        if ($examCount == 0 || $teacherCount == 0 || $roomCount == 0) {
            echo "Création des données de base...\n";
            
            // Créer des examens de base
            for ($i = 1; $i <= 5; $i++) {
                DB::table('exams')->insert([
                    'exam_type' => 'Normal',
                    'exame_date' => date('Y-m-d', strtotime("+$i days")),
                    'exame_time' => '09:00:00',
                    'teacher_id' => 1,
                    'id_group' => 1,
                    'id_module' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            
            $examCount = DB::table('exams')->count();
            echo "Exams créés: $examCount\n";
        }
        
        // Créer des schedules d'invigilation
        $exams = DB::table('exams')->get();
        $teachers = DB::table('teachers')->get();
        $rooms = DB::table('rooms')->get();
        
        foreach ($exams as $exam) {
            // Assigner 1-2 surveillants par examen
            $numSupervisors = rand(1, 2);
            $selectedTeachers = $teachers->random(min($numSupervisors, $teachers->count()));
            $selectedRoom = $rooms->random();
            
            if (!is_array($selectedTeachers)) {
                $selectedTeachers = [$selectedTeachers];
            }
            
            foreach ($selectedTeachers as $teacher) {
                DB::table('invigilation_schedules')->insert([
                    'exam_id' => $exam->id,
                    'teacher_id' => $teacher->id,
                    'room_id' => $selectedRoom->id,
                    'exam_date' => $exam->exame_date,
                    'start_time' => $exam->exame_time,
                    'end_time' => date('H:i:s', strtotime($exam->exame_time) + 7200), // +2 heures
                    'status' => rand(0, 1) ? 'confirmed' : 'pending',
                    'room_name' => $selectedRoom->room_name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        
        $scheduleCount = DB::table('invigilation_schedules')->count();
        echo "Schedules d'invigilation créés: $scheduleCount\n";
    }
}
