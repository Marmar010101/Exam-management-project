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
                'matricule' => 'STU001',
                'first_name' => 'Mourad',
                'last_name' => 'Almi',
                'email' => 'mourad.almi@university.edu',
                'password' => 'password123', 
                'group' => 'G1'
            ],
            [
                'matricule' => 'STU002',
                'first_name' => 'Sara',
                'last_name' => 'Farah',
                'email' => 'sara.farah@university.edu',
                'password' => 'password123',
                'group' => 'G2'
            ],
            [
                'matricule' => 'STU003',
                'first_name' => 'Ali',
                'last_name' => 'Benkhelifa',
                'email' => 'ali.benkhelifa@university.edu',
                'password' => 'password123',
                'group' => 'G1'
            ],
            [
                'matricule' => 'STU004',
                'first_name' => 'Meriem',
                'last_name' => 'Arvaoui',
                'email' => 'meriem.arvaoui@university.edu',
                'password' => 'password123',
                'group' => 'G1'
            ],
        ];

        foreach ($students as $s) {
            
            $user = User::create([
                'matricule' => $s['matricule'],
                'email' => $s['email'],
                'password'  => bcrypt($s['password']),
                'role'      => 'student',
                'first_name' => $s['first_name'],
                'last_name' => $s['last_name'],
            ]);

            $group = Group::where('name', 'like', '%' . $s['group'] . '%')->first();

            if ($group) {
                Student::create([
                    'user_id'     => $user->id,
                    'first_name'  => $s['first_name'],
                    'last_name'   => $s['last_name'],
                    'group_id'    => $group->id,
                ]);
            }
        }
    }
}