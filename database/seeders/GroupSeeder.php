<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\Level;
use App\Models\Semester;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    $groups = [
    // Années 1-3 sans speciality
    ['name'=>'L1 S1 G1','cycle_id'=>1,'level_id'=>1,'speciality_id'=>null,'semester_id' =>1,'students_count' =>30,],
    ['name'=>'L1 S1 G2','cycle_id'=>1,'level_id'=>1, 'speciality_id'=>null,'semester_id' =>1,'students_count' =>45,],
    ['name'=>'L1 S2 G1','cycle_id'=>1,'level_id'=>2, 'speciality_id'=>null,'semester_id' =>1,'students_count' =>32,],
    ['name'=>'L1 S2 G2','cycle_id'=>1,'level_id'=>2, 'speciality_id'=>null,'semester_id' =>1,'students_count' =>35,],
    
    // Année 4 avec speciality
    ['name'=>'Groupe Génie Logiciel','cycle_id'=>1,'level_id'=>4,'speciality_id'=>1,'semester_id' =>1,'students_count' =>30,],
    ['name'=>'Groupe Réseau','cycle_id'=>1,'level_id'=>4,'speciality_id'=>2,'semester_id' =>1,'students_count' =>30,],
    ['name'=>'Groupe SIC','cycle_id'=>1,'level_id'=>4,'speciality_id'=>3,'semester_id' =>1,'students_count' =>30,],
    ['name'=>'Groupe IA','cycle_id'=>1,'level_id'=>4,'speciality_id'=>4,'semester_id' =>1,'students_count' =>30,],
];
foreach($groups as $g) Group::create($g);

    }
}