<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreateGroupsSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer les IDs des niveaux et spécialités
        $levels = DB::table('levels')->pluck('id', 'name');
        $specialities = DB::table('specialities')->pluck('id', 'name');
        
        echo "Available levels: " . $levels->keys()->implode(', ') . PHP_EOL;
        echo "Available specialities: " . $specialities->keys()->implode(', ') . PHP_EOL;
        
        // Mapping des semestres
        $semesterMapping = [
            11 => 54, // L1 -> Semestre 1
            12 => 53, // L2 -> Semestre 2
            13 => 54, // L3 -> Semestre 1
            14 => 53, // M1 -> Semestre 2
            15 => 54, // M2 -> Semestre 1
            16 => 54, // ing1 -> Semestre 1
            17 => 53, // ing2 -> Semestre 2
            18 => 54, // ing3 -> Semestre 1
            19 => 53, // ing4 -> Semestre 2
            20 => 54, // ing5 -> Semestre 1
        ];
        
        // Créer des groupes pour chaque spécialité et niveau
        $groups = [];
        
        // Génie Logiciel
        if (isset($specialities['Génie Logiciel'])) {
            $glId = $specialities['Génie Logiciel'];
            $groups[] = ['GL-L1-G1', 'Génie Logiciel L1 Groupe 1', $glId, $levels['L1'] ?? 11, $semesterMapping[11] ?? 54];
            $groups[] = ['GL-L1-G2', 'Génie Logiciel L1 Groupe 2', $glId, $levels['L1'] ?? 11, $semesterMapping[11] ?? 54];
            $groups[] = ['GL-L2-G1', 'Génie Logiciel L2 Groupe 1', $glId, $levels['L2'] ?? 12, $semesterMapping[12] ?? 53];
            $groups[] = ['GL-L2-G2', 'Génie Logiciel L2 Groupe 2', $glId, $levels['L2'] ?? 12, $semesterMapping[12] ?? 53];
            $groups[] = ['GL-L3-G1', 'Génie Logiciel L3 Groupe 1', $glId, $levels['L3'] ?? 13, $semesterMapping[13] ?? 54];
            $groups[] = ['GL-L3-G2', 'Génie Logiciel L3 Groupe 2', $glId, $levels['L3'] ?? 13, $semesterMapping[13] ?? 54];
        }
        
        // Intelligence Artificielle
        if (isset($specialities['Intelligence Artificielle'])) {
            $iaId = $specialities['Intelligence Artificielle'];
            $groups[] = ['IA-L1-G1', 'Intelligence Artificielle L1 Groupe 1', $iaId, $levels['L1'] ?? 11, $semesterMapping[11] ?? 54];
            $groups[] = ['IA-L1-G2', 'Intelligence Artificielle L1 Groupe 2', $iaId, $levels['L1'] ?? 11, $semesterMapping[11] ?? 54];
            $groups[] = ['IA-L2-G1', 'Intelligence Artificielle L2 Groupe 1', $iaId, $levels['L2'] ?? 12, $semesterMapping[12] ?? 53];
            $groups[] = ['IA-L2-G2', 'Intelligence Artificielle L2 Groupe 2', $iaId, $levels['L2'] ?? 12, $semesterMapping[12] ?? 53];
            $groups[] = ['IA-L3-G1', 'Intelligence Artificielle L3 Groupe 1', $iaId, $levels['L3'] ?? 13, $semesterMapping[13] ?? 54];
            $groups[] = ['IA-L3-G2', 'Intelligence Artificielle L3 Groupe 2', $iaId, $levels['L3'] ?? 13, $semesterMapping[13] ?? 54];
        }
        
        // Réseaux
        if (isset($specialities['Réseaux'])) {
            $resId = $specialities['Réseaux'];
            $groups[] = ['RES-L1-G1', 'Réseaux L1 Groupe 1', $resId, $levels['L1'] ?? 11, $semesterMapping[11] ?? 54];
            $groups[] = ['RES-L1-G2', 'Réseaux L1 Groupe 2', $resId, $levels['L1'] ?? 11, $semesterMapping[11] ?? 54];
            $groups[] = ['RES-L2-G1', 'Réseaux L2 Groupe 1', $resId, $levels['L2'] ?? 12, $semesterMapping[12] ?? 53];
            $groups[] = ['RES-L2-G2', 'Réseaux L2 Groupe 2', $resId, $levels['L2'] ?? 12, $semesterMapping[12] ?? 53];
            $groups[] = ['RES-L3-G1', 'Réseaux L3 Groupe 1', $resId, $levels['L3'] ?? 13, $semesterMapping[13] ?? 54];
            $groups[] = ['RES-L3-G2', 'Réseaux L3 Groupe 2', $resId, $levels['L3'] ?? 13, $semesterMapping[13] ?? 54];
        }
        
        // Systèmes d'Information
        if (isset($specialities['Systèmes d\'Information et Communication'])) {
            $sicId = $specialities['Systèmes d\'Information et Communication'];
            $groups[] = ['SIC-L1-G1', 'Systèmes d\'Information L1 Groupe 1', $sicId, $levels['L1'] ?? 11, $semesterMapping[11] ?? 54];
            $groups[] = ['SIC-L1-G2', 'Systèmes d\'Information L1 Groupe 2', $sicId, $levels['L1'] ?? 11, $semesterMapping[11] ?? 54];
            $groups[] = ['SIC-L2-G1', 'Systèmes d\'Information L2 Groupe 1', $sicId, $levels['L2'] ?? 12, $semesterMapping[12] ?? 53];
            $groups[] = ['SIC-L2-G2', 'Systèmes d\'Information L2 Groupe 2', $sicId, $levels['L2'] ?? 12, $semesterMapping[12] ?? 53];
            $groups[] = ['SIC-L3-G1', 'Systèmes d\'Information L3 Groupe 1', $sicId, $levels['L3'] ?? 13, $semesterMapping[13] ?? 54];
            $groups[] = ['SIC-L3-G2', 'Systèmes d\'Information L3 Groupe 2', $sicId, $levels['L3'] ?? 13, $semesterMapping[13] ?? 54];
        }
        
        // Insérer les groupes
        foreach ($groups as [$name, $description, $specialtyId, $levelId, $semesterId]) {
            DB::table('groups')->insert([
                'name' => $name,
                'speciality_id' => $specialtyId,
                'level_id' => $levelId,
                'semester_id' => $semesterId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            echo "Group created: {$name} (Level: {$levelId}, Specialty: {$specialtyId}, Semester: {$semesterId})\n";
        }
        
        echo "\nCréation terminée! " . count($groups) . " groupes créés.\n";
    }
}
