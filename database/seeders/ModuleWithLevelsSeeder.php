<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Level;
use App\Models\Speciality;
use Illuminate\Database\Seeder;

class ModuleWithLevelsSeeder extends Seeder
{
    public function run(): void
    {
        // Get levels and specialities
        $levels = Level::all()->keyBy('id');
        $specialities = Speciality::all()->keyBy('id');
        
        // Clear existing modules
        Module::query()->delete();
        
        $modules = [
            // SYSTÈME INGÉNIEUR - TRONC COMMUN (level_id: 26-27, speciality_id: 10)
            
            // 1ère Année Ingénieur (level_id: 26)
            ['code' => 'ING101', 'module_name' => 'Algorithmique', 'description' => 'Fondements de l\'algorithmique et programmation', 'credits' => 6, 'coefficient' => 2.0, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 26, 'speciality_id' => 10],
            ['code' => 'ING102', 'module_name' => 'Systèmes d\'Exploitation', 'description' => 'Introduction aux systèmes d\'exploitation', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 26, 'speciality_id' => 10],
            ['code' => 'ING103', 'module_name' => 'Algèbre', 'description' => 'Algèbre linéaire et structures algébriques', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 30, 'volume_td' => 20, 'level_id' => 26, 'speciality_id' => 10],
            ['code' => 'ING104', 'module_name' => 'Analyse', 'description' => 'Analyse mathématique', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 30, 'volume_td' => 20, 'level_id' => 26, 'speciality_id' => 10],
            ['code' => 'ING105', 'module_name' => 'Expression Écrite et Bureautique', 'description' => 'Communication écrite et outils bureautiques', 'credits' => 4, 'coefficient' => 1.5, 'volume_cm' => 20, 'volume_td' => 20, 'level_id' => 26, 'speciality_id' => 10],
            ['code' => 'ING106', 'module_name' => 'Structure Machine', 'description' => 'Architecture des ordinateurs', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 26, 'speciality_id' => 10],
            ['code' => 'ING107', 'module_name' => 'Électronique Fondamentale', 'description' => 'Bases de l\'électronique', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 26, 'speciality_id' => 10],
            
            // 2ème Année Ingénieur (level_id: 27)
            ['code' => 'ING201', 'module_name' => 'Analyse 3', 'description' => 'Analyse avancée', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 30, 'volume_td' => 20, 'level_id' => 27, 'speciality_id' => 10],
            ['code' => 'ING202', 'module_name' => 'Algorithmique 3', 'description' => 'Algorithmique avancée', 'credits' => 6, 'coefficient' => 2.5, 'volume_cm' => 25, 'volume_td' => 35, 'level_id' => 27, 'speciality_id' => 10],
            ['code' => 'ING203', 'module_name' => 'Algèbre 3', 'description' => 'Algèbre avancée', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 30, 'volume_td' => 20, 'level_id' => 27, 'speciality_id' => 10],
            ['code' => 'ING204', 'module_name' => 'Programmation Orientée Objet (POO 1)', 'description' => 'Programmation orientée objet', 'credits' => 6, 'coefficient' => 2.5, 'volume_cm' => 25, 'volume_td' => 35, 'level_id' => 27, 'speciality_id' => 10],
            ['code' => 'ING205', 'module_name' => 'Probabilités et Statistiques', 'description' => 'Probabilités et statistiques appliquées', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 27, 'speciality_id' => 10],
            ['code' => 'ING206', 'module_name' => 'Systèmes d\'Information', 'description' => 'Introduction aux systèmes d\'information', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 27, 'speciality_id' => 10],
            ['code' => 'ING207', 'module_name' => 'Entreprenariat', 'description' => 'Fondements de l\'entreprenariat', 'credits' => 4, 'coefficient' => 1.5, 'volume_cm' => 20, 'volume_td' => 20, 'level_id' => 27, 'speciality_id' => 10],
            
            // SPÉCIALITÉS (Années 3-4)
            
            // 3ème Année - Génie Logiciel (level_id: 28, speciality_id: 7)
            ['code' => 'GL301', 'module_name' => 'Génie Logiciel', 'description' => 'Fondements du génie logiciel', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 28, 'speciality_id' => 7],
            ['code' => 'GL302', 'module_name' => 'Bases de Données', 'description' => 'Bases de données relationnelles', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7],
            ['code' => 'GL303', 'module_name' => 'Algorithmique Avancée', 'description' => 'Algorithmique avancée', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7],
            ['code' => 'GL304', 'module_name' => 'Systèmes d\'Exploitation Avancés', 'description' => 'Systèmes d\'exploitation avancés', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7],
            ['code' => 'GL305', 'module_name' => 'Technologies Web', 'description' => 'Développement web moderne', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7],
            ['code' => 'GL306', 'module_name' => 'Intelligence Artificielle', 'description' => 'Introduction à l\'IA', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7],
            
            // 3ème Année - Intelligence Artificielle (level_id: 28, speciality_id: 6)
            ['code' => 'IA301', 'module_name' => 'Machine Learning', 'description' => 'Apprentissage automatique', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 28, 'speciality_id' => 6],
            ['code' => 'IA302', 'module_name' => 'Réseaux de Neurones', 'description' => 'Réseaux de neurones artificiels', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6],
            ['code' => 'IA303', 'module_name' => 'Traitement du Signal', 'description' => 'Traitement numérique du signal', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6],
            ['code' => 'IA304', 'module_name' => 'Vision par Ordinateur', 'description' => 'Traitement d\'images et vision', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6],
            ['code' => 'IA305', 'module_name' => 'Big Data', 'description' => 'Gestion des grandes données', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6],
            ['code' => 'IA306', 'module_name' => 'Algorithmique IA', 'description' => 'Algorithmes pour l\'IA', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6],
            
            // 3ème Année - Réseaux (level_id: 28, speciality_id: 8)
            ['code' => 'RES301', 'module_name' => 'Réseaux Informatiques', 'description' => 'Fondements des réseaux', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 28, 'speciality_id' => 8],
            ['code' => 'RES302', 'module_name' => 'Sécurité des Réseaux', 'description' => 'Sécurité informatique', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8],
            ['code' => 'RES303', 'module_name' => 'Administration Système', 'description' => 'Administration Linux/Windows', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8],
            ['code' => 'RES304', 'module_name' => 'Virtualisation et Cloud', 'description' => 'Virtualisation et cloud computing', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8],
            ['code' => 'RES305', 'module_name' => 'Protocoles Réseaux', 'description' => 'Protocoles TCP/IP et routage', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8],
            ['code' => 'RES306', 'module_name' => 'Infrastructures Réseaux', 'description' => 'Infrastructure et équipements', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8],
            
            // 3ème Année - Systèmes d'Information (level_id: 28, speciality_id: 9)
            ['code' => 'SIC301', 'module_name' => 'Analyse et Conception SI', 'description' => 'Analyse et conception de systèmes', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 28, 'speciality_id' => 9],
            ['code' => 'SIC302', 'module_name' => 'Gestion de Projet SI', 'description' => 'Management de projets informatiques', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9],
            ['code' => 'SIC303', 'module_name' => 'ERP et Systèmes Intégrés', 'description' => 'Systèmes ERP et intégration', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9],
            ['code' => 'SIC304', 'module_name' => 'Business Intelligence', 'description' => 'Intelligence d\'affaires', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9],
            ['code' => 'SIC305', 'module_name' => 'Qualité et Audit SI', 'description' => 'Qualité des systèmes d\'information', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9],
            ['code' => 'SIC306', 'module_name' => 'Architecture d\'Entreprise', 'description' => 'Architecture des systèmes d\'entreprise', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9],
            
            // LICENCE (level_id: 21-23, speciality_id: 10)
            
            // Licence 1 (level_id: 21)
            ['code' => 'L101', 'module_name' => 'Mathématiques Fondamentales', 'description' => 'Mathématiques de base', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 40, 'volume_td' => 40, 'level_id' => 21, 'speciality_id' => 10],
            ['code' => 'L102', 'module_name' => 'Programmation Structurée', 'description' => 'Introduction à la programmation', 'credits' => 5, 'coefficient' => 2.5, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 21, 'speciality_id' => 10],
            ['code' => 'L103', 'module_name' => 'Logique et Ensembles', 'description' => 'Logique mathématique', 'credits' => 5, 'coefficient' => 2.5, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 21, 'speciality_id' => 10],
            ['code' => 'L104', 'module_name' => 'Algorithmique de Base', 'description' => 'Algorithmes fondamentaux', 'credits' => 5, 'coefficient' => 2.5, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 21, 'speciality_id' => 10],
            ['code' => 'L105', 'module_name' => 'Bureautique et Internet', 'description' => 'Outils bureautiques et internet', 'credits' => 4, 'coefficient' => 2.0, 'volume_cm' => 20, 'volume_td' => 20, 'level_id' => 21, 'speciality_id' => 10],
            
            // Licence 2 (level_id: 22)
            ['code' => 'L201', 'module_name' => 'Structures de Données', 'description' => 'Structures de données et algorithmes', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 35, 'volume_td' => 35, 'level_id' => 22, 'speciality_id' => 10],
            ['code' => 'L202', 'module_name' => 'Programmation Orientée Objet', 'description' => 'POO avec Java/C++', 'credits' => 5, 'coefficient' => 2.5, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 22, 'speciality_id' => 10],
            ['code' => 'L203', 'module_name' => 'Bases de Données', 'description' => 'Introduction aux bases de données', 'credits' => 5, 'coefficient' => 2.5, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 22, 'speciality_id' => 10],
            ['code' => 'L204', 'module_name' => 'Réseaux et Internet', 'description' => 'Fondements des réseaux', 'credits' => 5, 'coefficient' => 2.5, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 22, 'speciality_id' => 10],
            ['code' => 'L205', 'module_name' => 'Développement Web', 'description' => 'HTML/CSS/JavaScript', 'credits' => 5, 'coefficient' => 2.5, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 22, 'speciality_id' => 10],
            
            // Licence 3 (level_id: 23)
            ['code' => 'L301', 'module_name' => 'Algorithmique Avancée', 'description' => 'Algorithmes complexes', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 35, 'volume_td' => 35, 'level_id' => 23, 'speciality_id' => 10],
            ['code' => 'L302', 'module_name' => 'Programmation Web Avancée', 'description' => 'Frameworks web modernes', 'credits' => 5, 'coefficient' => 2.5, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 23, 'speciality_id' => 10],
            ['code' => 'L303', 'module_name' => 'Systèmes d\'Exploitation', 'description' => 'Linux et Windows', 'credits' => 5, 'coefficient' => 2.5, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 23, 'speciality_id' => 10],
            ['code' => 'L304', 'module_name' => 'Sécurité Informatique', 'description' => 'Sécurité des systèmes', 'credits' => 5, 'coefficient' => 2.5, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 23, 'speciality_id' => 10],
            ['code' => 'L305', 'module_name' => 'Projet de Fin d\'Études', 'description' => 'Projet intégrateur', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 20, 'volume_td' => 40, 'level_id' => 23, 'speciality_id' => 10],
        ];
        
        foreach ($modules as $moduleData) {
            Module::create($moduleData);
        }
        
        $this->command->info('Modules with levels and specialities created successfully!');
    }
}
