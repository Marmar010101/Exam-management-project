<?php

namespace Database\Seeders;
use App\Models\Student;
use App\Models\User;
use App\Models\Level;
use App\Models\Semester;
use App\Models\Group;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
   
    { $students = [
            [
                'matricule' => '202537016701',
                'first_name' => 'Mourad',
                'last_name' => 'Almi',
                'password' => 'Mourad123', 
                'level' => 'L1',
                'semester' => 'S1',
                'group' => 'G1'
            ],
            [
                'matricule' => '202537016702',
                'first_name' => 'Sara',
                'last_name' => 'Farah',
                'password' => 'Sara123',
                'level' => 'L2',
                'semester' => 'S3',
                'group' => 'G2'
            ],
            [
                'matricule' => '202537016703',
                'first_name' => 'Ali',
                'last_name' => 'Benkhelifa',
                'password' => 'Ali123',
                'level' => 'M1',
                'semester' => 'S7',
                'group' => 'G1'
            ],
            [
                'matricule' => '202537016704',
                'first_name' => 'Arvaoui',
                'last_name' => 'Meriem',
                'password' => 'Meriem123',
                'level' => 'M1',
                'semester' => 'S7',
                'group' => 'G1'
            ],
        ];

        foreach ($students as $s) {
            
            $user = User::create([
                'matricule' => $s['matricule'],
                'password'  => bcrypt($s['password']),
                'role'      => 'student',
            ]);

            $level = Level::where('name', $s['level'])->first();
            $semester = Semester::where('name', $s['semester'])->first();
            $group = Group::where('name', $s['group'])->first();

            if ($level && $semester) {
                Student::create([
                    'user_id'     => $user->id,
                    'level_id'    => $level->id,
                    'semester_id' => $semester->id,
                    'group_id'    => $group?->id,
                ]);
            }
        }
    }
}