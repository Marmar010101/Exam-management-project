<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Semester;
use Illuminate\Database\Seeder;

class CompleteModuleSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing modules
        Module::query()->delete();
        
        // Add semester_id to existing modules and create new ones
        $modules = [
            // INGÉNIEUR 1ÈRE ANNÉE (level_id: 26, speciality_id: 10)
            // Semestre 1 (semester_id: 37)
            ['code' => 'ING101', 'module_name' => 'Algorithmique', 'description' => 'Fondements de l\'algorithmique et programmation', 'credits' => 6, 'coefficient' => 2.0, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 26, 'speciality_id' => 10, 'semester_id' => 37],
            ['code' => 'ING102', 'module_name' => 'Systèmes d\'Exploitation', 'description' => 'Introduction aux systèmes d\'exploitation', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 26, 'speciality_id' => 10, 'semester_id' => 37],
            ['code' => 'ING103', 'module_name' => 'Algèbre', 'description' => 'Algèbre linéaire et structures algébriques', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 30, 'volume_td' => 20, 'level_id' => 26, 'speciality_id' => 10, 'semester_id' => 37],
            ['code' => 'ING104', 'module_name' => 'Analyse', 'description' => 'Analyse mathématique', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 30, 'volume_td' => 20, 'level_id' => 26, 'speciality_id' => 10, 'semester_id' => 37],
            ['code' => 'ING105', 'module_name' => 'Expression Écrite et Bureautique', 'description' => 'Communication écrite et outils bureautiques', 'credits' => 4, 'coefficient' => 1.5, 'volume_cm' => 20, 'volume_td' => 20, 'level_id' => 26, 'speciality_id' => 10, 'semester_id' => 37],
            
            // Semestre 2 (semester_id: 38)
            ['code' => 'ING106', 'module_name' => 'Structure Machine', 'description' => 'Architecture des ordinateurs', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 26, 'speciality_id' => 10, 'semester_id' => 38],
            ['code' => 'ING107', 'module_name' => 'Électronique Fondamentale', 'description' => 'Bases de l\'électronique', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 26, 'speciality_id' => 10, 'semester_id' => 38],
            ['code' => 'ING108', 'module_name' => 'Probabilités 1', 'description' => 'Probabilités élémentaires', 'credits' => 4, 'coefficient' => 1.5, 'volume_cm' => 20, 'volume_td' => 20, 'level_id' => 26, 'speciality_id' => 10, 'semester_id' => 38],
            ['code' => 'ING109', 'module_name' => 'Logique Mathématique', 'description' => 'Logique propositionnelle et prédicats', 'credits' => 4, 'coefficient' => 1.5, 'volume_cm' => 20, 'volume_td' => 20, 'level_id' => 26, 'speciality_id' => 10, 'semester_id' => 38],
            ['code' => 'ING110', 'module_name' => 'Langage C', 'description' => 'Programmation en C', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 26, 'speciality_id' => 10, 'semester_id' => 38],
            
            // INGÉNIEUR 2ÈME ANNÉE (level_id: 27, speciality_id: 10)
            // Semestre 3 (semester_id: 39)
            ['code' => 'ING201', 'module_name' => 'Analyse 3', 'description' => 'Analyse avancée', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 30, 'volume_td' => 20, 'level_id' => 27, 'speciality_id' => 10, 'semester_id' => 39],
            ['code' => 'ING202', 'module_name' => 'Algorithmique 3', 'description' => 'Algorithmique avancée', 'credits' => 6, 'coefficient' => 2.5, 'volume_cm' => 25, 'volume_td' => 35, 'level_id' => 27, 'speciality_id' => 10, 'semester_id' => 39],
            ['code' => 'ING203', 'module_name' => 'Algèbre 3', 'description' => 'Algèbre avancée', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 30, 'volume_td' => 20, 'level_id' => 27, 'speciality_id' => 10, 'semester_id' => 39],
            ['code' => 'ING204', 'module_name' => 'Programmation Orientée Objet (POO 1)', 'description' => 'Programmation orientée objet', 'credits' => 6, 'coefficient' => 2.5, 'volume_cm' => 25, 'volume_td' => 35, 'level_id' => 27, 'speciality_id' => 10, 'semester_id' => 39],
            ['code' => 'ING205', 'module_name' => 'Probabilités et Statistiques', 'description' => 'Probabilités et statistiques appliquées', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 27, 'speciality_id' => 10, 'semester_id' => 39],
            
            // Semestre 4 (semester_id: 40)
            ['code' => 'ING206', 'module_name' => 'Systèmes d\'Information', 'description' => 'Introduction aux systèmes d\'information', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 27, 'speciality_id' => 10, 'semester_id' => 40],
            ['code' => 'ING207', 'module_name' => 'Entreprenariat', 'description' => 'Fondements de l\'entreprenariat', 'credits' => 4, 'coefficient' => 1.5, 'volume_cm' => 20, 'volume_td' => 20, 'level_id' => 27, 'speciality_id' => 10, 'semester_id' => 40],
            ['code' => 'ING208', 'module_name' => 'Bases de Données 1', 'description' => 'Introduction aux bases de données', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 27, 'speciality_id' => 10, 'semester_id' => 40],
            ['code' => 'ING209', 'module_name' => 'Réseaux 1', 'description' => 'Introduction aux réseaux', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 27, 'speciality_id' => 10, 'semester_id' => 40],
            ['code' => 'ING210', 'module_name' => 'Compilation', 'description' => 'Théorie et pratique de la compilation', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 27, 'speciality_id' => 10, 'semester_id' => 40],
            
            // GÉNIE LOGICIEL 3ÈME ANNÉE (level_id: 28, speciality_id: 7)
            // Semestre 5 (semester_id: 41)
            ['code' => 'GL301', 'module_name' => 'Génie Logiciel', 'description' => 'Fondements du génie logiciel', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 28, 'speciality_id' => 7, 'semester_id' => 41],
            ['code' => 'GL302', 'module_name' => 'Bases de Données', 'description' => 'Bases de données relationnelles', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7, 'semester_id' => 41],
            ['code' => 'GL303', 'module_name' => 'Algorithmique Avancée', 'description' => 'Algorithmique avancée', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7, 'semester_id' => 41],
            ['code' => 'GL304', 'module_name' => 'Systèmes d\'Exploitation Avancés', 'description' => 'Systèmes d\'exploitation avancés', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7, 'semester_id' => 41],
            ['code' => 'GL305', 'module_name' => 'Technologies Web', 'description' => 'Développement web moderne', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7, 'semester_id' => 41],
            ['code' => 'GL306', 'module_name' => 'Conception de Systèmes', 'description' => 'Conception architecturale', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7, 'semester_id' => 41],
            
            // Semestre 6 (semester_id: 42)
            ['code' => 'GL307', 'module_name' => 'Qualité Logicielle', 'description' => 'Qualité et tests logiciels', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7, 'semester_id' => 42],
            ['code' => 'GL308', 'module_name' => 'Gestion de Projet', 'description' => 'Management de projet logiciel', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7, 'semester_id' => 42],
            ['code' => 'GL309', 'module_name' => 'Intelligence Artificielle', 'description' => 'Introduction à l\'IA', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7, 'semester_id' => 42],
            ['code' => 'GL310', 'module_name' => 'Sécurité Informatique', 'description' => 'Sécurité des systèmes', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 7, 'semester_id' => 42],
            ['code' => 'GL311', 'module_name' => 'Projet GL', 'description' => 'Projet de génie logiciel', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 20, 'volume_td' => 40, 'level_id' => 28, 'speciality_id' => 7, 'semester_id' => 42],
            
            // INTELLIGENCE ARTIFICIELLE 3ÈME ANNÉE (level_id: 28, speciality_id: 6)
            // Semestre 5 (semester_id: 41)
            ['code' => 'IA301', 'module_name' => 'Machine Learning', 'description' => 'Apprentissage automatique', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 28, 'speciality_id' => 6, 'semester_id' => 41],
            ['code' => 'IA302', 'module_name' => 'Réseaux de Neurones', 'description' => 'Réseaux de neurones artificiels', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6, 'semester_id' => 41],
            ['code' => 'IA303', 'module_name' => 'Traitement du Signal', 'description' => 'Traitement numérique du signal', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6, 'semester_id' => 41],
            ['code' => 'IA304', 'module_name' => 'Vision par Ordinateur', 'description' => 'Traitement d\'images et vision', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6, 'semester_id' => 41],
            ['code' => 'IA305', 'module_name' => 'Big Data', 'description' => 'Gestion des grandes données', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6, 'semester_id' => 41],
            ['code' => 'IA306', 'module_name' => 'Algorithmique IA', 'description' => 'Algorithmes pour l\'IA', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6, 'semester_id' => 41],
            
            // Semestre 6 (semester_id: 42)
            ['code' => 'IA307', 'module_name' => 'Deep Learning', 'description' => 'Apprentissage profond', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6, 'semester_id' => 42],
            ['code' => 'IA308', 'module_name' => 'Traitement du Langage', 'description' => 'NLP et traitement du langage naturel', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6, 'semester_id' => 42],
            ['code' => 'IA309', 'module_name' => 'Robotique', 'description' => 'Introduction à la robotique', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6, 'semester_id' => 42],
            ['code' => 'IA310', 'module_name' => 'Optimisation', 'description' => 'Techniques d\'optimisation', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 6, 'semester_id' => 42],
            ['code' => 'IA311', 'module_name' => 'Projet IA', 'description' => 'Projet d\'intelligence artificielle', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 20, 'volume_td' => 40, 'level_id' => 28, 'speciality_id' => 6, 'semester_id' => 42],
            
            // RÉSEAUX 3ÈME ANNÉE (level_id: 28, speciality_id: 8)
            // Semestre 5 (semester_id: 41)
            ['code' => 'RES301', 'module_name' => 'Réseaux Informatiques', 'description' => 'Fondements des réseaux', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 28, 'speciality_id' => 8, 'semester_id' => 41],
            ['code' => 'RES302', 'module_name' => 'Sécurité des Réseaux', 'description' => 'Sécurité informatique', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8, 'semester_id' => 41],
            ['code' => 'RES303', 'module_name' => 'Administration Système', 'description' => 'Administration Linux/Windows', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8, 'semester_id' => 41],
            ['code' => 'RES304', 'module_name' => 'Virtualisation et Cloud', 'description' => 'Virtualisation et cloud computing', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8, 'semester_id' => 41],
            ['code' => 'RES305', 'module_name' => 'Protocoles Réseaux', 'description' => 'Protocoles TCP/IP et routage', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8, 'semester_id' => 41],
            ['code' => 'RES306', 'module_name' => 'Infrastructures Réseaux', 'description' => 'Infrastructure et équipements', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8, 'semester_id' => 41],
            
            // Semestre 6 (semester_id: 42)
            ['code' => 'RES307', 'module_name' => 'Réseaux Sans Fil', 'description' => 'Réseaux WiFi et mobiles', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8, 'semester_id' => 42],
            ['code' => 'RES308', 'module_name' => 'VoIP et ToIP', 'description' => 'Téléphonie sur IP', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8, 'semester_id' => 42],
            ['code' => 'RES309', 'module_name' => 'Monitoring Réseaux', 'description' => 'Supervision et monitoring', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8, 'semester_id' => 42],
            ['code' => 'RES310', 'module_name' => 'Cybersécurité Avancée', 'description' => 'Sécurité avancée des réseaux', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 8, 'semester_id' => 42],
            ['code' => 'RES311', 'module_name' => 'Projet Réseaux', 'description' => 'Projet de réseaux', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 20, 'volume_td' => 40, 'level_id' => 28, 'speciality_id' => 8, 'semester_id' => 42],
            
            // SYSTÈMES D'INFORMATION 3ÈME ANNÉE (level_id: 28, speciality_id: 9)
            // Semestre 5 (semester_id: 41)
            ['code' => 'SIC301', 'module_name' => 'Analyse et Conception SI', 'description' => 'Analyse et conception de systèmes', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 30, 'volume_td' => 30, 'level_id' => 28, 'speciality_id' => 9, 'semester_id' => 41],
            ['code' => 'SIC302', 'module_name' => 'Gestion de Projet SI', 'description' => 'Management de projets informatiques', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9, 'semester_id' => 41],
            ['code' => 'SIC303', 'module_name' => 'ERP et Systèmes Intégrés', 'description' => 'Systèmes ERP et intégration', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9, 'semester_id' => 41],
            ['code' => 'SIC304', 'module_name' => 'Business Intelligence', 'description' => 'Intelligence d\'affaires', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9, 'semester_id' => 41],
            ['code' => 'SIC305', 'module_name' => 'Qualité et Audit SI', 'description' => 'Qualité des systèmes d\'information', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9, 'semester_id' => 41],
            ['code' => 'SIC306', 'module_name' => 'Architecture d\'Entreprise', 'description' => 'Architecture des systèmes d\'entreprise', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9, 'semester_id' => 41],
            
            // Semestre 6 (semester_id: 42)
            ['code' => 'SIC307', 'module_name' => 'Data Warehousing', 'description' => 'Entrepôts de données', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9, 'semester_id' => 42],
            ['code' => 'SIC308', 'module_name' => 'Gestion des Données', 'description' => 'Data governance', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9, 'semester_id' => 42],
            ['code' => 'SIC309', 'module_name' => 'Transformation Digitale', 'description' => 'Transformation numérique', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9, 'semester_id' => 42],
            ['code' => 'SIC310', 'module_name' => 'Audit et Conformité', 'description' => 'Audit SI et conformité', 'credits' => 5, 'coefficient' => 2.0, 'volume_cm' => 25, 'volume_td' => 25, 'level_id' => 28, 'speciality_id' => 9, 'semester_id' => 42],
            ['code' => 'SIC311', 'module_name' => 'Projet SIC', 'description' => 'Projet de systèmes d\'information', 'credits' => 6, 'coefficient' => 3.0, 'volume_cm' => 20, 'volume_td' => 40, 'level_id' => 28, 'speciality_id' => 9, 'semester_id' => 42],
        ];
        
        // Create all modules
        foreach ($modules as $moduleData) {
            Module::create($moduleData);
        }
        
        $this->command->info('Complete modules with semesters created successfully!');
    }
}
