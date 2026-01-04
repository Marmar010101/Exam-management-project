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
        $exam = Exam::first();
        $teacher = Teacher::first();
        $room = Room::first();

        if ($exam && $teacher && $room) {
            InvigilationSchedule::create([
                'exam_id' => $exam->id,
                'teacher_id' => $teacher->id,
                'room_id' => $room->id,
                'exam_date' => now()->addDays(7),
                'start_time' => '09:00:00',
                'end_time' => '11:00:00',
                'status' => 'pending',
                'room_name' => $room->name,
            ]);

            InvigilationSchedule::create([
                'exam_id' => $exam->id,
                'teacher_id' => $teacher->id,
                'room_id' => $room->id,
                'exam_date' => now()->addDays(14),
                'start_time' => '14:00:00',
                'end_time' => '16:00:00',
                'status' => 'confirmed',
                'room_name' => $room->name,
            ]);
        }
    }
}
