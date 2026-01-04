<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Level;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       $levels = [
    ['name'=>'L1','cycle_id'=>1],
    ['name'=>'L1','cycle_id'=>1],
    ['name'=>'L3','cycle_id'=>1],
    ['name'=>'M1','cycle_id'=>2],
    ['name'=>'M2','cycle_id'=>2],
];
foreach($levels as $l) Level::create($l);
}
}