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
    ['name'=>'1ère année','cycle_id'=>1],
    ['name'=>'2ème année','cycle_id'=>1],
    ['name'=>'3ème année','cycle_id'=>1],
    ['name'=>'4ème année','cycle_id'=>2],
    ['name'=>'4ème année','cycle_id'=>2],
];
foreach($levels as $l) Level::create($l);
}
}