<?php

namespace Database\Seeders;
use App\Models\Responsable;
use App\Models\User;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResponsableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       $user = User::create([
            'matricule' => 'RES001',
            'password'  => bcrypt('123456'), 
            'role'      => 'responsable',
        ]);


        Responsable::create([
            'user_id'    => $user->id,
            'first_name' => 'Ahmed',
            'last_name'  => 'Bouzid',
        ]);
    }
}
