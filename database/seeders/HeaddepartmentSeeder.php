<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HeadDepartment;
use App\Models\User;
class HeaddepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::create([
            'matricule' => 'ADMIN001',
            'password'  => bcrypt('password123'), 
            'role' => 'headdepartment',
            'first_name' => 'Ahmed',
            'last_name' => 'Afraoui',
        ]);

       
        Headdepartment::create([
            'user_id'    => $user->id,
            'first_name' => 'Ahmed',
            'last_name'  => 'Afraoui',
        ]);
    }
}
