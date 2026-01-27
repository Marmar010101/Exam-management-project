<?php

namespace Database\Seeders;
use App\Models\Cycle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CycleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $cycles = [
    ['cycle_name' => 'Licence', 'cycle_type' => 'LMD'],
    ['cycle_name' => 'Master', 'cycle_type' => 'LMD'],
    ['cycle_name' => 'Engineer_Tronc_commun', 'cycle_type' => 'ING'],
    ['cycle_name' => 'Engineer', 'cycle_type' => 'ING'],
];
foreach($cycles as $c) Cycle::create($c);

    }
}
