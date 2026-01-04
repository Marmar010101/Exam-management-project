<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateHeadDepartmentUser extends Command
{
    protected $signature = 'create:headdepartment-user';
    protected $description = 'Create a head department user for testing';

    public function handle()
    {
        $user = User::create([
            'matricule' => 'HD001',
            'first_name' => 'Admin',
            'last_name' => 'HeadDepartment',
            'email' => 'admin@exam-management.com',
            'password' => Hash::make('password'),
            'role' => 'headdepartment',
        ]);

        $this->info('HeadDepartment user created successfully!');
        $this->info('Matricule: HD001');
        $this->info('Password: password');
        $this->info('Email: admin@exam-management.com');
        
        return 0;
    }
}
