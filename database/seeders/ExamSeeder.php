<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exam;
use App\Models\User;
use App\Models\Group;
use App\Models\Module;
use App\Models\Teacher;
use App\Models\Room;

class ExamSeeder extends Seeder
{
    public function run()
    {
        // Get users for responsible and headdepartment
        $responsable = User::where('role', 'responsable')->first();
        $headdepartment = User::where('role', 'headdepartment')->first();

        if (!$responsable || !$headdepartment) {
            $this->command->error('No responsible or headdepartment users found. Please run UserDataSeeder first.');
            return;
        }

        // Get sample data
        $groups = Group::with(['level', 'speciality'])->get();
        $modules = Module::all();
        $teachers = Teacher::all();
        $rooms = Room::all();

        // Check if we have enough data
        if ($groups->count() < 3 || $modules->count() < 3 || $teachers->count() < 3 || $rooms->count() < 3) {
            $this->command->error('Insufficient data for exams seeding. Please ensure you have at least 3 groups, modules, teachers, and rooms.');
            return;
        }

        // Create comprehensive exams with different statuses
        $exams = [
            // Pending exams (waiting for validation)
            [
                'exam_type' => 'Examen',
                'exame_date' => now()->addDays(8)->format('Y-m-d'),
                'exame_time' => now()->setTime(9, 0)->format('Y-m-d H:i:s'),
                'teacher_id' => $teachers->first()->id,
                'id_group' => $groups->first()->id,
                'id_module' => $modules->first()->id,
                'room_id' => $rooms->first()->id,
                'duration' => 120,
                'status' => 'pending',
                'created_by' => $responsable->id,
                'validated_by' => null,
                'validation_notes' => null,
                'validated_at' => null,
            ],
            [
                'exam_type' => 'Contrôle',
                'exame_date' => now()->addDays(10)->format('Y-m-d'),
                'exame_time' => now()->setTime(14, 0)->format('Y-m-d H:i:s'),
                'teacher_id' => $teachers->skip(1)->first()->id,
                'id_group' => $groups->skip(1)->first()->id,
                'id_module' => $modules->skip(1)->first()->id,
                'room_id' => $rooms->skip(1)->first()->id,
                'duration' => 90,
                'status' => 'pending',
                'created_by' => $responsable->id,
                'validated_by' => null,
                'validation_notes' => null,
                'validated_at' => null,
            ],

            // Validated exams (approved by headdepartment)
            [
                'exam_type' => 'Rattrapage',
                'exame_date' => now()->addDays(12)->format('Y-m-d'),
                'exame_time' => now()->setTime(10, 0)->format('Y-m-d H:i:s'),
                'teacher_id' => $teachers->skip(2)->first()->id,
                'id_group' => $groups->skip(2)->first()->id,
                'id_module' => $modules->skip(2)->first()->id,
                'room_id' => $rooms->skip(2)->first()->id,
                'duration' => 150,
                'status' => 'validated',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Approved schedule and room allocation',
                'validated_at' => now()->subDays(1),
            ],
            [
                'exam_type' => 'Examen',
                'exame_date' => now()->addDays(15)->format('Y-m-d'),
                'exame_time' => now()->setTime(9, 0)->format('Y-m-d H:i:s'),
                'teacher_id' => $teachers->first()->id,
                'id_group' => $groups->first()->id,
                'id_module' => $modules->skip(1)->first()->id,
                'room_id' => $rooms->first()->id,
                'duration' => 180,
                'status' => 'validated',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Schedule confirmed. All resources available.',
                'validated_at' => now()->subHours(6),
            ],

            // Rejected exams (rejected by headdepartment)
            [
                'exam_type' => 'Contrôle',
                'exame_date' => now()->addDays(14)->format('Y-m-d'),
                'exame_time' => now()->setTime(15, 0)->format('Y-m-d H:i:s'),
                'teacher_id' => $teachers->skip(1)->first()->id,
                'id_group' => $groups->skip(1)->first()->id,
                'id_module' => $modules->skip(2)->first()->id,
                'room_id' => $rooms->skip(1)->first()->id,
                'duration' => 60,
                'status' => 'rejected',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Room conflict with another exam. Please reschedule.',
                'validated_at' => now()->subHours(12),
            ],

            // Scheduled exams (fully scheduled and confirmed)
            [
                'exam_type' => 'Examen',
                'exame_date' => now()->addDays(20)->format('Y-m-d'),
                'exame_time' => now()->setTime(14, 0)->format('Y-m-d H:i:s'),
                'teacher_id' => $teachers->skip(2)->first()->id,
                'id_group' => $groups->skip(2)->first()->id,
                'id_module' => $modules->first()->id,
                'room_id' => $rooms->skip(2)->first()->id,
                'duration' => 120,
                'status' => 'scheduled',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Approved and scheduled. All logistics confirmed.',
                'validated_at' => now()->subDays(2),
            ],
            [
                'exam_type' => 'Rattrapage',
                'exame_date' => now()->addDays(25)->format('Y-m-d'),
                'exame_time' => now()->setTime(10, 0)->format('Y-m-d H:i:s'),
                'teacher_id' => $teachers->first()->id,
                'id_group' => $groups->first()->id,
                'id_module' => $modules->skip(2)->first()->id,
                'room_id' => $rooms->first()->id,
                'duration' => 180,
                'status' => 'scheduled',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Schedule confirmed. Room and time allocated.',
                'validated_at' => now()->subDays(1),
            ],
        ];

        foreach ($exams as $exam) {
            Exam::create($exam);
        }

        $this->command->info('Exams seeded successfully!');
        $this->command->info('Created ' . count($exams) . ' exams with different statuses:');
        $this->command->info('- Pending: ' . Exam::where('status', 'pending')->count() . ' (waiting for validation)');
        $this->command->info('- Validated: ' . Exam::where('status', 'validated')->count() . ' (approved by headdepartment)');
        $this->command->info('- Rejected: ' . Exam::where('status', 'rejected')->count() . ' (rejected by headdepartment)');
        $this->command->info('- Scheduled: ' . Exam::where('status', 'scheduled')->count() . ' (fully scheduled)');
    }
}
