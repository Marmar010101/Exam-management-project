<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SimpleInvigilationSeeder extends Seeder
{
    public function run()
    {
        // Créer des schedules d'invigilation directement avec des données factices
        $schedules = [
            [
                'exam_id' => 1,
                'teacher_id' => 1,
                'room_id' => 1,
                'exam_date' => '2026-01-25',
                'start_time' => '09:00:00',
                'end_time' => '11:00:00',
                'status' => 'confirmed',
                'room_name' => 'Salle A101',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'exam_id' => 2,
                'teacher_id' => 2,
                'room_id' => 2,
                'exam_date' => '2026-01-26',
                'start_time' => '10:00:00',
                'end_time' => '12:00:00',
                'status' => 'pending',
                'room_name' => 'Salle B201',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'exam_id' => 3,
                'teacher_id' => 3,
                'room_id' => 3,
                'exam_date' => '2026-01-27',
                'start_time' => '14:00:00',
                'end_time' => '16:00:00',
                'status' => 'confirmed',
                'room_name' => 'Salle C301',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
        
        foreach ($schedules as $schedule) {
            DB::table('invigilation_schedules')->insert($schedule);
        }
        
        echo "Schedules d'invigilation créés: " . count($schedules) . "\n";
    }
}
