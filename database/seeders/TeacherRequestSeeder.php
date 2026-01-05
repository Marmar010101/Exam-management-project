<?php

namespace Database\Seeders;

use App\Models\Teacher;
use App\Models\TeacherRequest;
use Illuminate\Database\Seeder;

class TeacherRequestSeeder extends Seeder
{
    public function run()
    {
        $teachers = Teacher::all();
        
        foreach ($teachers as $teacher) {
            // Créer différentes types de demandes pour chaque enseignant
            $requests = [
                [
                    'user_id' => $teacher->user_id,
                    'module_id' => 1,
                    'type' => 'absence',
                    'title' => 'Medical Leave Request',
                    'description' => 'I need to take a medical leave from January 15 to January 20, 2025.',
                    'date' => '2025-01-15',
                    'time' => '09:00',
                    'room' => null,
                    'urgency' => 'high',
                    'status' => 'pending',
                    'created_at' => now()->subDays(2),
                ],
                [
                    'user_id' => $teacher->user_id,
                    'module_id' => 2,
                    'type' => 'room_change',
                    'title' => 'Room Change Request',
                    'description' => 'The current room S101 is too small for my group. I would like to request N303.',
                    'date' => '2025-01-25',
                    'time' => '14:00',
                    'room' => 'N303',
                    'urgency' => 'normal',
                    'status' => 'approved',
                    'created_at' => now()->subDays(5),
                ],
                [
                    'user_id' => $teacher->user_id,
                    'module_id' => 3,
                    'type' => 'time_change',
                    'title' => 'Exam Time Change',
                    'description' => 'I would like to change exam time from 09:00 to 14:00 for better student availability.',
                    'date' => '2025-01-30',
                    'time' => '14:00',
                    'room' => null,
                    'urgency' => 'low',
                    'status' => 'rejected',
                    'created_at' => now()->subWeek(),
                ],
            ];
            
            // Ajouter seulement 2-3 demandes par enseignant
            $numRequests = rand(2, 3);
            for ($i = 0; $i < $numRequests; $i++) {
                TeacherRequest::create($requests[$i]);
            }
        }
    }
}
