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
                'exame_date' => '2025-01-15',
                'exame_time' => '09:00:00',
                'teacher_id' => 1,
                'id_group' => 1,
                'id_module' => 1,
            ],
            [
                'exam_type' => 'Rattrapage',
                'exame_date' => '2025-01-20',
                'exame_time' => '11:00:00',
                'teacher_id' => 2,
                'id_group' => 2,
                'id_module' => 2,
            ],
            [
                'exam_type' => 'Contrôle',
                'exame_date' => '2025-01-25',
                'exame_time' => '14:00:00',
                'teacher_id' => 3,
                'id_group' => 1,
                'id_module' => 3,
            ],
        ];

        foreach ($exams as $exam) {
            Exam::create($exam);
        }
    }
}
