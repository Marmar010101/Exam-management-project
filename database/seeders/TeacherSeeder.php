<?php

namespace Database\Seeders;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
         $user1 = User::create([
            'matricule' => '202537016650',
            'password'  => bcrypt('123456'),
            'role'      => 'teacher',
        ]);

        Teacher::create([
            'user_id'    => $user1->id,
            'first_name' => 'Mohammed',
            'last_name'  => 'Benkhelifa',
            'grade'      => 'MAA',
            'is_responsable' => true,
            'unavailable_dates' => ['2025-01-10', '2025-01-12'],
            'max_exams_per_day' => 2,
            'max_exams_per_week' => 5,
        ]);

        // Teacher 2
        $user2 = User::create([
            'matricule' => '202537016651',
            'password'  => bcrypt('123456'),
            'role'      => 'teacher',
        ]);

        Teacher::create([
            'user_id'    => $user2->id,
            'first_name' => 'Asma',
            'last_name'  => 'Brahimi',
            'grade'      => 'MAB',
            'is_responsable' => false,
            'unavailable_dates' => ['2025-01-15'],
            'max_exams_per_day' => 1,
            'max_exams_per_week' => 4,
        ]);

        // Teacher 3
        $user3 = User::create([
            'matricule' => '202537016652',
            'password'  => bcrypt('123456'),
            'role'      => 'teacher',
        ]);

        Teacher::create([
            'user_id'    => $user3->id,
            'first_name' => 'Sara',
            'last_name'  => 'Moussa',
            'grade'      => 'MAA',
            'is_responsable' => false,
            'unavailable_dates' => ['2025-01-15'],
            'max_exams_per_day' => 1,
            'max_exams_per_week' => 4,
        ]);
    }
}
