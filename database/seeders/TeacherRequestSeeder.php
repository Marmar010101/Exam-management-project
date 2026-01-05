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
                    'teacher_id' => $teacher->id,
                    'type' => 'absence',
                    'title' => 'Medical Leave Request',
                    'description' => 'I need to take a medical leave from January 15 to January 20, 2025.',
                    'start_date' => '2025-01-15',
                    'end_date' => '2025-01-20',
                    'status' => 'pending',
                    'created_at' => now()->subDays(2),
                ],
                [
                    'teacher_id' => $teacher->id,
                    'type' => 'room_change',
                    'title' => 'Room Change Request',
                    'description' => 'The current room S101 is too small for my group. I would like to request N303.',
                    'exam_id' => 1,
                    'status' => 'approved',
                    'created_at' => now()->subDays(5),
                ],
                [
                    'teacher_id' => $teacher->id,
                    'type' => 'time_change',
                    'title' => 'Exam Time Change',
                    'description' => 'I would like to change the exam time from 09:00 to 14:00 for better student availability.',
                    'exam_id' => 2,
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
