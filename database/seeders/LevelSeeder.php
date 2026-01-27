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
        // Récupérer les cycles créés par CycleSeeder
        $licenceCycle = \App\Models\Cycle::where('cycle_name', 'Licence')->first();
        $masterCycle = \App\Models\Cycle::where('cycle_name', 'Master')->first();
        $ingTroncCommunCycle = \App\Models\Cycle::where('cycle_name', 'Engineer_Tronc_commun')->first();
        $ingCycle = \App\Models\Cycle::where('cycle_name', 'Engineer')->first();
        
        $levels = [
            ['name'=>'L1','cycle_id'=>$licenceCycle->id],
            ['name'=>'L2','cycle_id'=>$licenceCycle->id],
            ['name'=>'L3','cycle_id'=>$licenceCycle->id],
            ['name'=>'M1','cycle_id'=>$masterCycle->id],
            ['name'=>'M2','cycle_id'=>$masterCycle->id],
            ['name'=>'ing1','cycle_id'=>$ingTroncCommunCycle->id],
            ['name'=>'ing2','cycle_id'=>$ingTroncCommunCycle->id],
            ['name'=>'ing3','cycle_id'=>$ingCycle->id],
            ['name'=>'ing4','cycle_id'=>$ingCycle->id],
            ['name'=>'ing5','cycle_id'=>$ingCycle->id],
        ];
        
        foreach($levels as $l) {
            Level::create($l);
        }
    }
}
