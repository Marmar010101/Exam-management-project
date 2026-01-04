<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exam;

class ExamSeeder extends Seeder
{
    public function run()
    {
        $exams = [
            [
                'exam_type' => 'Examen',
                'exam_date' => '2025-01-15',
                'exam_time' => '09:00:00',
                'duration' => 90,
                'end_time' => '10:30:00',
                'conflict_warnings' => null,
                'has_conflicts' => false,
                'session_name' => 'Session Janvier',
                'is_batch_created' => false,
                'group_id' => 1,
                'module_id' => 1,
                
            ],
            [
                'exam_type' => 'Rattrapage',
                'exam_date' => '2025-01-20',
                'exam_time' => '11:00:00',
                'duration' => 60,
                'end_time' => '12:00:00',
                'conflict_warnings' => null,
                'has_conflicts' => false,
                'session_name' => 'Session Janvier',
                'is_batch_created' => false,
                'group_id' => 2,
                'module_id' => 2,
                
            ],
        ];

        foreach ($exams as $exam) {
            Exam::create($exam);
        }
    }
}
