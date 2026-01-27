<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class BasicUserSeeder extends Seeder
{
    public function run()
    {
        // Créer des utilisateurs de base
        User::create([
            'matricule' => 'ADMIN001',
            'password' => Hash::make('password', ['rounding' => 12]),
            'role' => 'headdepartment',
            'first_name' => 'Admin',
            'last_name' => 'System',
            'email' => 'admin@examens.com',
        ]);

        User::create([
            'matricule' => 'RES001',
            'password' => Hash::make('password', ['rounding' => 12]),
            'role' => 'responsable',
            'first_name' => 'Responsable',
            'last_name' => 'Test',
            'email' => 'responsable@examens.com',
        ]);

        User::create([
            'matricule' => 'TCH001',
            'password' => Hash::make('password', ['rounding' => 12]),
            'role' => 'teacher',
            'first_name' => 'Teacher',
            'last_name' => 'Test',
            'email' => 'teacher@examens.com',
        ]);

        User::create([
            'matricule' => 'STU001',
            'password' => Hash::make('password', ['rounding' => 12]),
            'role' => 'student',
            'first_name' => 'Student',
            'last_name' => 'Test',
            'email' => 'student@examens.com',
        ]);
    }
}
