<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Level;
use App\Models\Speciality;

class SpecialitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $specialities = [
    ['name'=>'Génie Logiciel'],
    ['name'=>'Réseau'],
    ['name'=>'SIC'],
    ['name'=>'IA'],
];
foreach($specialities as $s) Speciality::create($s);
        
    }
}
