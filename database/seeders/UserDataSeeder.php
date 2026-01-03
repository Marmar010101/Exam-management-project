<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserDataSeeder extends Seeder
{
    public function run()
    {
        // Créer les utilisateurs
        $users = [
            [
                'matricule' => 'STU001',
                'first_name' => 'Ahmed',
                'last_name' => 'Benali',
                'email' => 'ahmed.benali@univ.dz',
                'password' => Hash::make('password123'),
                'role' => 'student',
            ],
            [
                'matricule' => 'STU002',
                'first_name' => 'Fatima',
                'last_name' => 'Mohamed',
                'email' => 'fatima.mohamed@univ.dz',
                'password' => Hash::make('password123'),
                'role' => 'student',
            ],
            [
                'matricule' => 'STU003',
                'first_name' => 'Mohamed',
                'last_name' => 'Ali',
                'email' => 'mohamed.ali@univ.dz',
                'password' => Hash::make('password123'),
                'role' => 'student',
            ],
            [
                'matricule' => 'TCH001',
                'first_name' => 'Dr. Omar',
                'last_name' => 'Brahimi',
                'email' => 'omar.brahimi@univ.dz',
                'password' => Hash::make('password123'),
                'role' => 'teacher',
            ],
            [
                'matricule' => 'TCH002',
                'first_name' => 'Dr. Leila',
                'last_name' => 'Khaled',
                'email' => 'leila.khaled@univ.dz',
                'password' => Hash::make('password123'),
                'role' => 'teacher',
            ],
            [
                'matricule' => 'RES001',
                'first_name' => 'M. Karim',
                'last_name' => 'Bensalem',
                'email' => 'karim.bensalem@univ.dz',
                'password' => Hash::make('password123'),
                'role' => 'responsable',
            ],
            [
                'matricule' => 'HD001',
                'first_name' => 'Pr. Nadia',
                'last_name' => 'Brahimi',
                'email' => 'nadia.brahimi@univ.dz',
                'password' => Hash::make('password123'),
                'role' => 'head_department',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
