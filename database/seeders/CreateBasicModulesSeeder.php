<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreateBasicModulesSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer les IDs des spécialités et niveaux
        $specialities = DB::table('specialities')->pluck('id', 'name');
        $levels = DB::table('levels')->pluck('id', 'name');
        
        // Mapping des semestres
        $semesterMapping = [
            11 => 54, // L1 -> Semestre 1
            12 => 53, // L2 -> Semestre 2
            13 => 54, // L3 -> Semestre 1 (alternance)
            14 => 53, // M1 -> Semestre 2 (alternance)
            15 => 54, // M2 -> Semestre 1 (alternance)
            16 => 54, // ing1 -> Semestre 1
            17 => 53, // ing2 -> Semestre 2
            18 => 54, // ing3 -> Semestre 1
            19 => 53, // ing4 -> Semestre 2
            20 => 54, // ing5 -> Semestre 1
        ];
        
        // Modules de base pour chaque spécialité et niveau
        $modules = [
            // Génie Logiciel
            ['Algorithmique', 'ALG101', $specialities['Génie Logiciel'] ?? 2, $levels['L1'] ?? 11, 'Algorithmes et structures de données'],
            ['Bases de Données', 'BD102', $specialities['Génie Logiciel'] ?? 2, $levels['L1'] ?? 11, 'Introduction aux bases de données'],
            ['Programmation Web', 'WEB101', $specialities['Génie Logiciel'] ?? 2, $levels['L1'] ?? 11, 'Développement web frontend'],
            ['Réseaux', 'RES101', $specialities['Génie Logiciel'] ?? 2, $levels['L1'] ?? 11, 'Réseaux et protocoles'],
            
            ['Algorithmique Avancée', 'ALG201', $specialities['Génie Logiciel'] ?? 2, $levels['L2'] ?? 12, 'Algorithmes avancés'],
            ['Bases de Données Avancées', 'BD201', $specialities['Génie Logiciel'] ?? 2, $levels['L2'] ?? 12, 'SGBD avancés'],
            ['Développement Web Avancé', 'WEB201', $specialities['Génie Logiciel'] ?? 2, $levels['L2'] ?? 12, 'Frameworks web modernes'],
            ['Sécurité Informatique', 'SEC201', $specialities['Génie Logiciel'] ?? 2, $levels['L2'] ?? 12, 'Sécurité des systèmes'],
            
            ['Intelligence Artificielle', 'IA301', $specialities['Intelligence Artificielle'] ?? 3, $levels['L1'] ?? 11, 'Introduction à l\'IA'],
            ['Machine Learning', 'ML301', $specialities['Intelligence Artificielle'] ?? 3, $levels['L1'] ?? 11, 'Apprentissage automatique'],
            ['Deep Learning', 'DL301', $specialities['Intelligence Artificielle'] ?? 3, $levels['L1'] ?? 11, 'Réseaux de neurones'],
            ['Traitement du Langage', 'NLP301', $specialities['Intelligence Artificielle'] ?? 3, $levels['L1'] ?? 11, 'NLP et text mining'],
            
            ['Réseaux Avancés', 'RES301', $specialities['Réseaux'] ?? 4, $levels['L1'] ?? 11, 'Réseaux avancés et protocoles'],
            ['Sécurité Réseaux', 'SEC301', $specialities['Réseaux'] ?? 4, $levels['L1'] ?? 11, 'Sécurité des réseaux'],
            ['Cloud Computing', 'CLOUD301', $specialities['Réseaux'] ?? 4, $levels['L1'] ?? 11, 'Infrastructure cloud'],
            ['Administration Systèmes', 'ADMIN301', $specialities['Réseaux'] ?? 4, $levels['L1'] ?? 11, 'Administration Linux/Windows'],
            
            ['Systèmes d\'Information', 'SIC301', $specialities['Systèmes d\'Information et Communication'] ?? 5, $levels['L1'] ?? 11, 'Analyse et conception SI'],
            ['Gestion de Projet', 'PM301', $specialities['Systèmes d\'Information et Communication'] ?? 5, $levels['L1'] ?? 11, 'Management de projet'],
            ['Business Intelligence', 'BI301', $specialities['Systèmes d\'Information et Communication'] ?? 5, $levels['L1'] ?? 11, 'Outils décisionnels'],
            ['ERP et SI', 'ERP301', $specialities['Systèmes d\'Information et Communication'] ?? 5, $levels['L1'] ?? 11, 'Systèmes ERP'],
        ];
        
        foreach ($modules as [$name, $code, $specialtyId, $levelId, $description]) {
            $semesterId = $semesterMapping[$levelId] ?? 54; // Default to Semestre 1
            
            DB::table('modules')->insert([
                'module_name' => $name,
                'code' => $code,
                'description' => $description,
                'credits' => 6,
                'coefficient' => 3.0,
                'volume_cm' => 30,
                'volume_td' => 30,
                'speciality_id' => $specialtyId,
                'level_id' => $levelId,
                'semester_id' => $semesterId,
                'teacher_id' => 18, // Kamel (premier teacher existant)
                'objectives' => 'Objectifs du module',
                'resources' => 'Ressources du module',
                'evaluation_methods' => json_encode(['exam', 'tp']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            echo "Module créé: {$name} ({$code}) - semester_id: {$semesterId}\n";
        }
        
        echo "\nCréation terminée! " . count($modules) . " modules créés.\n";
    }
}
