<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DirectInvigilationSeeder extends Seeder
{
    public function run()
    {
        // D'abord, créer des données de base si nécessaire
        $this->createBasicData();
        
        // Ensuite, créer les schedules d'invigilation
        $this->createInvigilationSchedules();
    }
    
    private function createBasicData()
    {
        // Créer des niveaux de base
        if (DB::table('levels')->count() == 0) {
            DB::table('levels')->insert([
                ['name' => 'L1', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'L2', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'L3', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
        
        // Créer des spécialités de base
        if (DB::table('specialities')->count() == 0) {
            DB::table('specialities')->insert([
                ['name' => 'Informatique', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Mathématiques', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Physique', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
        
        // Créer des semestres de base
        if (DB::table('semesters')->count() == 0) {
            DB::table('semesters')->insert([
                ['name' => 'S1', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'S2', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'S3', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
        
        // Créer des modules de base
        if (DB::table('modules')->count() == 0) {
            DB::table('modules')->insert([
                ['module_name' => 'Algorithmique', 'code' => 'ALG101', 'level_id' => 1, 'speciality_id' => 1, 'semester_id' => 1, 'created_at' => now(), 'updated_at' => now()],
                ['module_name' => 'Bases de Données', 'code' => 'BD101', 'level_id' => 1, 'speciality_id' => 1, 'semester_id' => 2, 'created_at' => now(), 'updated_at' => now()],
                ['module_name' => 'Programmation', 'code' => 'PROG101', 'level_id' => 2, 'speciality_id' => 1, 'semester_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
        
        // Créer des groupes de base
        if (DB::table('groups')->count() == 0) {
            DB::table('groups')->insert([
                ['name' => 'Groupe A', 'level_id' => 1, 'speciality_id' => 1, 'semester_id' => 1, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Groupe B', 'level_id' => 1, 'speciality_id' => 1, 'semester_id' => 2, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Groupe C', 'level_id' => 2, 'speciality_id' => 1, 'semester_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
        
        // Créer des examens de base
        if (DB::table('exams')->count() == 0) {
            $teachers = DB::table('teachers')->get();
            $groups = DB::table('groups')->get();
            $modules = DB::table('modules')->get();
            
            foreach ($modules->take(3) as $index => $module) {
                $teacher = $teachers->get($index % $teachers->count());
                $group = $groups->get($index % $groups->count());
                
                DB::table('exams')->insert([
                    'exam_type' => 'Normal',
                    'exame_date' => date('Y-m-d', strtotime("+$index days")),
                    'exame_time' => '09:00:00',
                    'teacher_id' => $teacher->id,
                    'id_group' => $group->id,
                    'id_module' => $module->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        
        echo "Données de base créées avec succès!\n";
    }
    
    private function createInvigilationSchedules()
    {
        $exams = DB::table('exams')->get();
        $teachers = DB::table('teachers')->get();
        $rooms = DB::table('rooms')->get();
        
        foreach ($exams as $exam) {
            // Assigner 1-2 surveillants par examen
            $numSupervisors = rand(1, 2);
            
            for ($i = 0; $i < $numSupervisors && $i < $teachers->count(); $i++) {
                $teacher = $teachers[$i];
                $room = $rooms[$i % $rooms->count()];
                
                DB::table('invigilation_schedules')->insert([
                    'exam_id' => $exam->id,
                    'teacher_id' => $teacher->id,
                    'room_id' => $room->id,
                    'exam_date' => $exam->exame_date,
                    'start_time' => $exam->exame_time,
                    'end_time' => date('H:i:s', strtotime($exam->exame_time) + 7200), // +2 heures
                    'status' => rand(0, 1) ? 'confirmed' : 'pending',
                    'room_name' => $room->room_name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        
        $scheduleCount = DB::table('invigilation_schedules')->count();
        echo "Schedules d'invigilation créés: $scheduleCount\n";
    }
}
