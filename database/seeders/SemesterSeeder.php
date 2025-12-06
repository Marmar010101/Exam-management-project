<?php

namespace Database\Seeders;

use App\Models\Semester;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Level;

class SemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $semesters = [
    ['name'=>'Semestre 1','level_id'=>1],
    ['name'=>'Semestre 2','level_id'=>1],
    ['name'=>'Semestre 1','level_id'=>2],
    ['name'=>'Semestre 2','level_id'=>2],
    ['name'=>'Semestre 1','level_id'=>3],
    ['name'=>'Semestre 2','level_id'=>3],
    ['name'=>'Semestre 1','level_id'=>4],
    ['name'=>'Semestre 2','level_id'=>4],
];
foreach($semesters as $s) Semester::create($s);
    }
}
