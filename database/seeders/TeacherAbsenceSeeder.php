<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\TeacherAbsence;
use Carbon\Carbon;

class TeacherAbsenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les enseignants
        $teachers = User::where('role', 'teacher')->get();
        
        if ($teachers->isEmpty()) {
            $this->command->warn('No teachers found. Please run TeacherSeeder first.');
            return;
        }

        // Créer quelques absences d'exemple
        $absences = [
            [
                'teacher_id' => $teachers->first()->id,
                'start_date' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(7)->format('Y-m-d'),
                'reason' => 'Congé personnel',
                'status' => 'approved',
                'admin_notes' => 'Approuvé par le département'
            ],
            [
                'teacher_id' => $teachers->skip(1)->first()->id ?? $teachers->first()->id,
                'start_date' => Carbon::now()->addDays(10)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(10)->format('Y-m-d'),
                'reason' => 'Rendez-vous médical',
                'status' => 'approved',
                'admin_notes' => 'Justification médicale fournie'
            ],
            [
                'teacher_id' => $teachers->skip(2)->first()->id ?? $teachers->first()->id,
                'start_date' => Carbon::now()->addDays(15)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(16)->format('Y-m-d'),
                'reason' => 'Formation professionnelle',
                'status' => 'pending',
                'admin_notes' => null
            ]
        ];

        foreach ($absences as $absence) {
            TeacherAbsence::create($absence);
        }

        $this->command->info('Teacher absences seeded successfully!');
    }
}
