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

        if (!$responsable || !$headdepartment) {
            $this->command->error('No responsible or headdepartment users found. Please run UserDataSeeder first.');
            return;
        }

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

        // Create comprehensive exam plans with different statuses
        $examPlans = [
            // Pending exams (waiting for validation)
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
                'exam_date' => now()->addDays(12)->format('Y-m-d'),
                'start_time' => '14:00',
                'end_time' => '16:00',
                'duration_minutes' => 120,
                'description' => 'Midterm examination for Database Systems',
                'status' => 'pending',
                'created_by' => $responsable->id,
                'validated_by' => null,
                'validation_notes' => null,
                'validated_at' => null,
            ],
            [
                'group_id' => $groups->skip(2)->first()->id,
                'module_id' => $modules->skip(2)->first()->id,
                'teacher_id' => $teachers->skip(2)->first()->id,
                'room_id' => $rooms->skip(2)->first()->id,
                'exam_type' => 'Quiz',
                'exam_date' => now()->addDays(14)->format('Y-m-d'),
                'start_time' => '10:00',
                'end_time' => '11:30',
                'duration_minutes' => 90,
                'description' => 'Quiz for Web Development module',
                'status' => 'pending',
                'created_by' => $responsable->id,
                'validated_by' => null,
                'validation_notes' => null,
                'validated_at' => null,
            ],

            // Validated exams (approved by headdepartment)
            [
                'group_id' => $groups->skip(3)->first()->id,
                'module_id' => $modules->skip(3)->first()->id,
                'teacher_id' => $teachers->skip(3)->first()->id,
                'room_id' => $rooms->skip(3)->first()->id,
                'exam_type' => 'Practical',
                'exam_date' => now()->addDays(15)->format('Y-m-d'),
                'start_time' => '08:00',
                'end_time' => '12:00',
                'duration_minutes' => 240,
                'description' => 'Practical examination for Computer Networks',
                'status' => 'validated',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Approved schedule and room allocation',
                'validated_at' => now()->subDays(2),
            ],
            [
                'group_id' => $groups->first()->id,
                'module_id' => $modules->skip(1)->first()->id,
                'teacher_id' => $teachers->skip(1)->first()->id,
                'room_id' => $rooms->skip(1)->first()->id,
                'exam_type' => 'Final',
                'exam_date' => now()->addDays(20)->format('Y-m-d'),
                'start_time' => '09:00',
                'end_time' => '12:00',
                'duration_minutes' => 180,
                'description' => 'Final examination for Data Structures',
                'status' => 'validated',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Schedule confirmed. All resources available.',
                'validated_at' => now()->subHours(6),
            ],

            // Rejected exams (rejected by headdepartment)
            [
                'group_id' => $groups->skip(1)->first()->id,
                'module_id' => $modules->skip(2)->first()->id,
                'teacher_id' => $teachers->skip(2)->first()->id,
                'room_id' => $rooms->skip(2)->first()->id,
                'exam_type' => 'Oral',
                'exam_date' => now()->addDays(18)->format('Y-m-d'),
                'start_time' => '15:00',
                'end_time' => '17:00',
                'duration_minutes' => 120,
                'description' => 'Oral examination for Software Engineering',
                'status' => 'rejected',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Room conflict with another exam. Please reschedule.',
                'validated_at' => now()->subDay(),
            ],
            [
                'group_id' => $groups->skip(2)->first()->id,
                'module_id' => $modules->skip(3)->first()->id,
                'teacher_id' => $teachers->skip(3)->first()->id,
                'room_id' => $rooms->skip(3)->first()->id,
                'exam_type' => 'Quiz',
                'exam_date' => now()->addDays(22)->format('Y-m-d'),
                'start_time' => '11:00',
                'end_time' => '12:00',
                'duration_minutes' => 60,
                'description' => 'Quiz for Operating Systems',
                'status' => 'rejected',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Insufficient time allocation. Quiz should be 30 minutes max.',
                'validated_at' => now()->subHours(12),
            ],

            // Scheduled exams (fully scheduled and confirmed)
            [
                'group_id' => $groups->skip(3)->first()->id,
                'module_id' => $modules->first()->id,
                'teacher_id' => $teachers->first()->id,
                'room_id' => $rooms->first()->id,
                'exam_type' => 'Final',
                'exam_date' => now()->addDays(25)->format('Y-m-d'),
                'start_time' => '14:00',
                'end_time' => '17:00',
                'duration_minutes' => 180,
                'description' => 'Final examination for Artificial Intelligence',
                'status' => 'scheduled',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Approved and scheduled. All logistics confirmed.',
                'validated_at' => now()->subDays(3),
            ],
            [
                'group_id' => $groups->first()->id,
                'module_id' => $modules->skip(2)->first()->id,
                'teacher_id' => $teachers->skip(2)->first()->id,
                'room_id' => $rooms->skip(2)->first()->id,
                'exam_type' => 'Midterm',
                'exam_date' => now()->addDays(30)->format('Y-m-d'),
                'start_time' => '10:00',
                'end_time' => '12:00',
                'duration_minutes' => 120,
                'description' => 'Midterm examination for Machine Learning',
                'status' => 'scheduled',
                'created_by' => $responsable->id,
                'validated_by' => $headdepartment->id,
                'validation_notes' => 'Schedule confirmed. Room and time allocated.',
                'validated_at' => now()->subDays(1),
            ],
        ];

        foreach ($examPlans as $plan) {
            ExamPlan::create($plan);
        }

        $this->command->info('Exam plans seeded successfully!');
        $this->command->info('Created ' . count($examPlans) . ' exam plans with different statuses:');
        $this->command->info('- Pending: ' . ExamPlan::where('status', 'pending')->count() . ' (waiting for validation)');
        $this->command->info('- Validated: ' . ExamPlan::where('status', 'validated')->count() . ' (approved by headdepartment)');
        $this->command->info('- Rejected: ' . ExamPlan::where('status', 'rejected')->count() . ' (rejected by headdepartment)');
        $this->command->info('- Scheduled: ' . ExamPlan::where('status', 'scheduled')->count() . ' (fully scheduled)');
    }
}
