<?php

namespace Database\Seeders;

use App\Models\InvigilationSchedule;
use App\Models\Exam;
use App\Models\Teacher;
use App\Models\Room;
use Illuminate\Database\Seeder;

class InvigilationScheduleSeeder extends Seeder
{
    public function run()
    {
        $exams = Exam::all();
        $teachers = Teacher::all();
        $rooms = Room::all();
        
        foreach ($exams as $exam) {
            // Assigner 1-2 surveillants par examen
            $numSupervisors = rand(1, 2);
            $selectedTeachers = $teachers->random($numSupervisors);
            $selectedRoom = $rooms->random();
            
            foreach ($selectedTeachers as $teacher) {
                InvigilationSchedule::create([
                    'exam_id' => $exam->id,
                    'teacher_id' => $teacher->id,
                    'room_id' => $selectedRoom->id,
                    'exam_date' => $exam->exame_date,
                    'start_time' => $exam->exame_time,
                    'end_time' => date('H:i:s', strtotime($exam->exame_time) + 7200), // +2 heures
                    'status' => rand(0, 1) ? 'confirmed' : 'pending',
                    'room_name' => $selectedRoom->room_name,
                ]);
            }
        }
    }
}
