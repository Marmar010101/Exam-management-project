<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ExamPlan;
use App\Models\User;
use App\Models\Group;
use App\Models\Module;
use App\Models\Teacher;
use App\Models\Room;

class ExamPlanSeeder extends Seeder
{
    public function run(): void
    {
        // Get users for responsible and headdepartment
        $responsable = User::where('role', 'responsable')->first();
        $headdepartment = User::where('role', 'headdepartment')->first();

        // Get sample data
        $groups = Group::with(['level', 'speciality'])->get();
        $modules = Module::all();
        $teachers = Teacher::with('user')->get();
        $rooms = Room::all();

        // Check if we have enough data
        if ($groups->count() < 4 || $modules->count() < 4 || $teachers->count() < 4) {
            $this->command->error('Insufficient data for exam plans seeding. Please ensure you have at least 4 groups, modules, and teachers.');
            return;
        }

        $examTypes = ['Final', 'Midterm', 'Quiz', 'Practical', 'Oral'];
        $statuses = ['pending', 'validated', 'rejected', 'scheduled'];

        // Create sample exam plans
        $examPlans = [
            [
                'group_id' => $groups->first()->id,
                'module_id' => $modules->first()->id,
                'teacher_id' => $teachers->first()->id,
                'room_id' => $rooms->first()->id,
                'exam_type' => 'Final',
                'exam_date' => now()->addDays(10)->format('Y-m-d'),
                'start_time' => '09:00',
                'end_time' => '11:00',
                'duration_minutes' => 120,
                'description' => 'Final examination for Algorithm module',
                'status' => 'pending',
                'created_by' => $responsable->id,
                'validated_by' => null,
                'validation_notes' => null,
                'validated_at' => null,
            ],
            [
                'group_id' => $groups->skip(1)->first()->id,
                'module_id' => $modules->skip(1)->first()->id,
                'teacher_id' => $teachers->skip(1)->first()->id,
                'room_id' => $rooms->skip(1)->first()->id,
                'exam_type' => 'Midterm',
                'exam_date' => now()->addDays(15)->format('Y-m-d'),
                'start_time' => '14:00',
                'end_time' => '16:00',
                'duration_minutes' => 120,
                'description' => 'Midterm examination for Database Systems',
                'status' => 'validated',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Approved schedule and room allocation',
                'validated_at' => now()->subDays(2),
            ],
            [
                'group_id' => $groups->skip(2)->first()->id,
                'module_id' => $modules->skip(2)->first()->id,
                'teacher_id' => $teachers->skip(2)->first()->id,
                'room_id' => $rooms->skip(2)->first()->id,
                'exam_type' => 'Quiz',
                'exam_date' => now()->addDays(20)->format('Y-m-d'),
                'start_time' => '10:00',
                'end_time' => '11:30',
                'duration_minutes' => 90,
                'description' => 'Quiz for Web Development module',
                'status' => 'rejected',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Room conflict with another exam. Please reschedule.',
                'validated_at' => now()->subDays(1),
            ],
            [
                'group_id' => $groups->skip(3)->first()->id,
                'module_id' => $modules->skip(3)->first()->id,
                'teacher_id' => $teachers->skip(3)->first()->id,
                'room_id' => $rooms->skip(3)->first()->id,
                'exam_type' => 'Practical',
                'exam_date' => now()->addDays(25)->format('Y-m-d'),
                'start_time' => '08:00',
                'end_time' => '12:00',
                'duration_minutes' => 240,
                'description' => 'Practical examination for Computer Networks',
                'status' => 'scheduled',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Approved for practical lab session',
                'validated_at' => now()->subHours(6),
            ],
            [
                'group_id' => $groups->skip(4)->first()->id,
                'module_id' => $modules->skip(4)->first()->id,
                'teacher_id' => $teachers->skip(4)->first()->id,
                'room_id' => $rooms->skip(4)->first()->id,
                'exam_type' => 'Oral',
                'exam_date' => now()->addDays(30)->format('Y-m-d'),
                'start_time' => '15:00',
                'end_time' => '17:00',
                'duration_minutes' => 120,
                'description' => 'Oral examination for Software Engineering',
                'status' => 'pending',
                'created_by' => $responsable->id,
                'validated_by' => null,
                'validation_notes' => null,
                'validated_at' => null,
            ],
        ];

        foreach ($examPlans as $plan) {
            ExamPlan::create($plan);
        }

        $this->command->info('Exam plans seeded successfully!');
    }
}
