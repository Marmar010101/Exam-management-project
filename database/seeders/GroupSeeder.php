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
    ['name'=>'Groupe A','cycle_id'=>1,'level_id'=>1,'semester_id'=>1,'speciality_id'=>null],
    ['name'=>'Groupe B','cycle_id'=>1,'level_id'=>1,'semester_id'=>2,'speciality_id'=>null],
    ['name'=>'Groupe C','cycle_id'=>1,'level_id'=>2,'semester_id'=>1,'speciality_id'=>null],
    ['name'=>'Groupe D','cycle_id'=>1,'level_id'=>2,'semester_id'=>2,'speciality_id'=>null],
    
    // Année 4 avec speciality
    ['name'=>'Groupe Génie Logiciel','cycle_id'=>1,'level_id'=>4,'semester_id'=>1,'speciality_id'=>1],
    ['name'=>'Groupe Réseau','cycle_id'=>1,'level_id'=>4,'semester_id'=>1,'speciality_id'=>2],
    ['name'=>'Groupe SIC','cycle_id'=>1,'level_id'=>4,'semester_id'=>2,'speciality_id'=>3],
    ['name'=>'Groupe IA','cycle_id'=>1,'level_id'=>4,'semester_id'=>2,'speciality_id'=>4],
];
foreach($groups as $g) Group::create($g);

    }
}
