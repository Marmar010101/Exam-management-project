<?php

namespace Database\Seeders;

use App\Models\Semester;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Level;
use Illuminate\Support\Facades\DB;

class SemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Vider les semestres existants
        Semester::query()->delete();
        
        // Récupérer les IDs des niveaux
        $levels = DB::table('levels')->get();
        
        $L1 = $levels->firstWhere('name', 'L1');
        $L2 = $levels->firstWhere('name', 'L2');
        $L3 = $levels->firstWhere('name', 'L3');
        $M1 = $levels->firstWhere('name', 'M1');
        $M2 = $levels->firstWhere('name', 'M2');
        $ing1 = $levels->firstWhere('name', 'ing1');
        $ing2 = $levels->firstWhere('name', 'ing2');
        $ing3 = $levels->firstWhere('name', 'ing3');
        $ing4 = $levels->firstWhere('name', 'ing4');
        $ing5 = $levels->firstWhere('name', 'ing5');
        
        $semesters = [];
        
        // Licence 1 - 2 semestres
        if ($L1) {
            $semesters[] = ['name' => 'Semestre 1', 'level_id' => $L1->id];
            $semesters[] = ['name' => 'Semestre 2', 'level_id' => $L1->id];
        }
        
        // Licence 2 - 2 semestres
        if ($L2) {
            $semesters[] = ['name' => 'Semestre 1', 'level_id' => $L2->id];
            $semesters[] = ['name' => 'Semestre 2', 'level_id' => $L2->id];
        }
        
        // Licence 3 - 2 semestres
        if ($L3) {
            $semesters[] = ['name' => 'Semestre 1', 'level_id' => $L3->id];
            $semesters[] = ['name' => 'Semestre 2', 'level_id' => $L3->id];
        }
        
        // Master 1 - 2 semestres
        if ($M1) {
            $semesters[] = ['name' => 'Semestre 1', 'level_id' => $M1->id];
            $semesters[] = ['name' => 'Semestre 2', 'level_id' => $M1->id];
        }
        
        // Master 2 - 1 semestre (S1 seulement)
        if ($M2) {
            $semesters[] = ['name' => 'Semestre 1', 'level_id' => $M2->id];
        }
        
        // Ingénieur 1 - 2 semestres
        if ($ing1) {
            $semesters[] = ['name' => 'Semestre 1', 'level_id' => $ing1->id];
            $semesters[] = ['name' => 'Semestre 2', 'level_id' => $ing1->id];
        }
        
        // Ingénieur 2 - 2 semestres
        if ($ing2) {
            $semesters[] = ['name' => 'Semestre 1', 'level_id' => $ing2->id];
            $semesters[] = ['name' => 'Semestre 2', 'level_id' => $ing2->id];
        }
        
        // Ingénieur 3 - 2 semestres
        if ($ing3) {
            $semesters[] = ['name' => 'Semestre 1', 'level_id' => $ing3->id];
            $semesters[] = ['name' => 'Semestre 2', 'level_id' => $ing3->id];
        }
        
        // Ingénieur 4 - 2 semestres
        if ($ing4) {
            $semesters[] = ['name' => 'Semestre 1', 'level_id' => $ing4->id];
            $semesters[] = ['name' => 'Semestre 2', 'level_id' => $ing4->id];
        }
        
        // Ingénieur 5 - 1 semestre (S1 seulement)
        if ($ing5) {
            $semesters[] = ['name' => 'Semestre 1', 'level_id' => $ing5->id];
        }
        
        foreach($semesters as $s) {
            Semester::create($s);
        }
        
        $this->command->info('Semestres créés avec succès!');
        $this->command->info('Total semestres créés: ' . count($semesters));
    }
}
