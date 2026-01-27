<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Group;
use App\Models\Module;

class CompleteAcademicSeeder extends Seeder
{
    public function run()
    {
        DB::table('groups')->delete();
        DB::table('modules')->delete();

        // Get levels, specialities and semesters from existing seeders
        $level1 = DB::table('levels')->where('name', 'L1')->first();
        $level2 = DB::table('levels')->where('name', 'L2')->first();
        $level3 = DB::table('levels')->where('name', 'L3')->first();
        $level4 = DB::table('levels')->where('name', 'M1')->first(); // Use M1 for 4th year
        $level5 = DB::table('levels')->where('name', 'M2')->first(); // Use M2 for 5th year
        $level6 = DB::table('levels')->where('name', 'ing5')->first(); // Use ing5 for 6th year
        
        $semester1 = DB::table('semesters')->where('name', 'Semestre 1')->first();
        $semester2 = DB::table('semesters')->where('name', 'Semestre 2')->first();
        
        $siSpeciality = DB::table('specialities')->where('name', 'Systèmes d\'Information et Communication')->first();
        $glSpeciality = DB::table('specialities')->where('name', 'Génie Logiciel')->first();
        $iaSpeciality = DB::table('specialities')->where('name', 'Intelligence Artificielle')->first();
        $networkSpeciality = DB::table('specialities')->where('name', 'Réseaux')->first();
        $sicSpeciality = DB::table('specialities')->where('name', 'Systèmes d\'Information et Connaissances')->first();

        // Debug: Check if all required data exists
        if (!$level1 || !$level2 || !$level3 || !$level4 || !$level5 || !$level6) {
            $this->command->error('Levels not found! Please run LevelSeeder first.');
            $this->command->info('Available levels: ' . implode(', ', DB::table('levels')->pluck('name')->toArray()));
            return;
        }

        if (!$siSpeciality || !$glSpeciality || !$iaSpeciality || !$networkSpeciality) {
            $this->command->error('Specialties not found! Please run SpecialtySeeder first.');
            $this->command->info('Available specialties: ' . implode(', ', DB::table('specialities')->pluck('name')->toArray()));
            return;
        }
        
        // For SIC specialty, use SI if not found
        if (!$sicSpeciality) {
            $sicSpeciality = $siSpeciality;
            $this->command->info('Using Systèmes d\'Information et Communication for SIC specialty');
        }

        $academicStructure = [
            // Ingénieur Informatique
            [
                'name' => '1ère Année Ingénieur Informatique (SI)',
                'level' => $level1->id,
                'speciality' => $siSpeciality->id,
                'modules' => [
                    ['Algorithmique', 'ALG101'],
                    ['Systèmes d\'Exploitation', 'OS101'],
                    ['Algèbre', 'ALG101'],
                    ['Analyse', 'ANA101'],
                    ['Expression Écrite et Bureautique', 'BUREAU101'],
                    ['Structure Machine', 'SM101'],
                    ['Électronique Fondamentale', 'ELEC101']
                ]
            ],
            [
                'name' => '2ème Année Ingénieur Informatique',
                'level' => $level2->id,
                'speciality' => $siSpeciality->id,
                'modules' => [
                    ['Analyse 3', 'ANA201'],
                    ['Algorithmique 3', 'ALG201'],
                    ['Algèbre 3', 'ALG201'],
                    ['Programmation Orientée Objet (POO 1)', 'POO201'],
                    ['Probabilités et Statistiques', 'STAT201'],
                    ['Systèmes d\'Information', 'SI201'],
                    ['Entreprenariat', 'ENT201']
                ]
            ],
            [
                'name' => '3ème Année Ingénieur Informatique – Génie Logiciel (GL)',
                'level' => $level3->id,
                'speciality' => $glSpeciality->id,
                'modules' => [
                    ['Génie Logiciel', 'GL301'],
                    ['Bases de Données', 'DB301'],
                    ['Algorithmique', 'ALG301'],
                    ['Systèmes d\'Exploitation', 'OS301'],
                    ['Technologies Optimales', 'TECH301'],
                    ['Intelligence Artificielle', 'IA301']
                ]
            ],
            [
                'name' => '3ème Année Ingénieur Informatique – Intelligence Artificielle (IA)',
                'level' => $level3->id,
                'speciality' => $iaSpeciality->id,
                'modules' => [
                    ['Génie Logiciel', 'GL302'],
                    ['Bases de Données', 'DB302'],
                    ['Analyse Numérique', 'AN302'],
                    ['Systèmes d\'Exploitation', 'OS302'],
                    ['Technologies Optimales', 'TECH302'],
                    ['Intelligence Artificielle', 'IA302'],
                    ['Développement Mobile', 'MOB302']
                ]
            ],
            [
                'name' => '3ème Année Ingénieur Informatique – Réseaux',
                'level' => $level3->id,
                'speciality' => $networkSpeciality->id,
                'modules' => [
                    ['Génie Logiciel', 'GL303'],
                    ['Bases de Données Avancées', 'DB303'],
                    ['Réseaux Avancés', 'NET303'],
                    ['Systèmes d\'Exploitation', 'OS303'],
                    ['Technologies Web', 'WEB303'],
                    ['Modélisation des Systèmes d\'Information', 'SI303']
                ]
            ],
            [
                'name' => '4ème Année Ingénieur Informatique – Génie Logiciel (GL)',
                'level' => $level4->id,
                'speciality' => $glSpeciality->id,
                'modules' => [
                    ['Conception de Logiciels', 'SW401'],
                    ['Data Mining', 'DM401'],
                    ['Compilation 2', 'COMP401'],
                    ['Web Avancé', 'WEB401'],
                    ['Méthodes de Management Agiles', 'AGILE401'],
                    ['Réseaux et Protocoles', 'NET401']
                ]
            ],
            [
                'name' => '4ème Année Ingénieur Informatique – Intelligence Artificielle (IA)',
                'level' => $level4->id,
                'speciality' => $iaSpeciality->id,
                'modules' => [
                    ['Recherche Opérationnelle', 'OR402'],
                    ['Calcul Haute Performance', 'HPC402'],
                    ['Machine Learning', 'ML402'],
                    ['Représentation des Connaissances', 'KR402'],
                    ['Business Intelligence', 'BI402'],
                    ['Modélisation et Simulation', 'SIM402'],
                    ['Techniques de Rédaction', 'WRIT402']
                ]
            ],

            // Licence Informatique
            [
                'name' => '1ère Année Licence Informatique',
                'level' => $level1->id,
                'speciality' => $siSpeciality->id,
                'modules' => [
                    ['Algorithmique', 'ALG102'],
                    ['Analyse', 'ANA102'],
                    ['Algèbre', 'ALG102'],
                    ['Électricité', 'ELEC102'],
                    ['Structure Machine', 'SM102'],
                    ['Logiciels Libres', 'FREE102'],
                    ['Anglais', 'ENG102']
                ]
            ],
            [
                'name' => '2ème Année Licence Informatique',
                'level' => $level2->id,
                'speciality' => $siSpeciality->id,
                'modules' => [
                    ['Algorithmique', 'ALG202'],
                    ['Théorie des Graphes', 'GRAPH202'],
                    ['Architecture des Ordinateurs', 'ARCH202'],
                    ['Logique Mathématique', 'LOG202'],
                    ['Systèmes d\'Information', 'SI202'],
                    ['Mathématiques Numériques', 'MATH202'],
                    ['Anglais', 'ENG202']
                ]
            ],
            [
                'name' => '3ème Année Licence Informatique',
                'level' => $level3->id,
                'speciality' => $siSpeciality->id,
                'modules' => [
                    ['Programmation Logique', 'LOG303'],
                    ['Compilation', 'COMP303'],
                    ['Interfaces Homme–Machine (IHM)', 'IHM303'],
                    ['Systèmes d\'Exploitation', 'OS303'],
                    ['Génie Logiciel', 'GL303'],
                    ['Probabilités', 'PROB303'],
                    ['Économie Numérique', 'ECON303']
                ]
            ],

            // Master Génie Logiciel
            [
                'name' => '1ère Année Master Génie Logiciel (GL)',
                'level' => $level5->id,
                'speciality' => $glSpeciality->id,
                'modules' => [
                    ['Ingénierie des Exigences', 'RE501'],
                    ['Calcul Haute Performance', 'HPC501'],
                    ['Intelligence Artificielle', 'IA501'],
                    ['Architecture d\'Entreprise', 'EA501'],
                    ['Web Avancé', 'WEB501'],
                    ['Arduino', 'ARD501'],
                    ['Anglais', 'ENG501']
                ]
            ],
            [
                'name' => '2ème Année Master Génie Logiciel (GL)',
                'level' => $level6->id,
                'speciality' => $glSpeciality->id,
                'modules' => [
                    ['Ingénierie des Systèmes', 'SE502'],
                    ['Cloud Computing', 'CLOUD502'],
                    ['Validation et Vérification (V&V)', 'VV502'],
                    ['Ingénierie des Exigences et Requêtes (IR)', 'IR502'],
                    ['ERP', 'ERP502'],
                    ['Architecture Logicielle Avancée', 'ARCH502'],
                    ['Éthique et Déontologie', 'ETHIC502']
                ]
            ],

            // Master Intelligence Artificielle
            [
                'name' => '1ère Année Master Intelligence Artificielle (IA)',
                'level' => $level5->id,
                'speciality' => $iaSpeciality->id,
                'modules' => [
                    ['Analyse de Données', 'DA501'],
                    ['Bases de Données Avancées', 'DB501'],
                    ['Applications Automatiques', 'AUTO501'],
                    ['Représentation des Connaissances', 'KR501'],
                    ['Recherche Heuristique', 'HEUR501'],
                    ['Réseaux Avancés', 'NET501'],
                    ['Data Science', 'DS501'],
                    ['Anglais', 'ENG501']
                ]
            ],
            [
                'name' => '2ème Année Master Intelligence Artificielle (IA)',
                'level' => $level6->id,
                'speciality' => $iaSpeciality->id,
                'modules' => [
                    ['Fouille de Données', 'DM502'],
                    ['Cloud Computing', 'CLOUD502'],
                    ['Recherche d\'Information', 'IR502'],
                    ['Traitement Automatique du Langage Naturel (TALN)', 'NLP502'],
                    ['Apprentissage Profond', 'DL502'],
                    ['Apprentissage par Contraintes (ACL)', 'ACL502'],
                    ['Éthique et Déontologie', 'ETHIC502']
                ]
            ],

            // Master Réseaux et Systèmes Distribués
            [
                'name' => '1ère Année Master Réseaux et Systèmes Distribués (RSD)',
                'level' => $level5->id,
                'speciality' => $networkSpeciality->id,
                'modules' => [
                    ['Protocoles et Concepts', 'PROT501'],
                    ['Téléphonie IP', 'VOIP501'],
                    ['Réseaux Avancés', 'NET501'],
                    ['Algorithmique Avancée', 'ALG501'],
                    ['Modélisation', 'MODEL501'],
                    ['Administration des SGBD', 'DBA501'],
                    ['Anglais', 'ENG501']
                ]
            ],
            [
                'name' => '2ème Année Master Réseaux et Systèmes Distribués (RSD)',
                'level' => $level6->id,
                'speciality' => $networkSpeciality->id,
                'modules' => [
                    ['Pair-à-Pair (P2P)', 'P2P502'],
                    ['Ingénierie des Réseaux', 'NETENG502'],
                    ['Réseaux Mobiles', 'MOB502'],
                    ['Systèmes Distribués', 'DIST502'],
                    ['Applications Réparties', 'DISTAPP502'],
                    ['Systèmes Embarqués', 'EMBED502'],
                    ['Éthique et Déontologie', 'ETHIC502']
                ]
            ],

            // Master Systèmes d'Information et Connaissances
            [
                'name' => '1ère Année Master Systèmes d\'Information et Connaissances (SIC)',
                'level' => $level5->id,
                'speciality' => $sicSpeciality->id,
                'modules' => [
                    ['Ingénierie des Exigences', 'RE503'],
                    ['Bases de Données Avancées', 'DB503'],
                    ['Systèmes d\'Information Avancés', 'SI503'],
                    ['Algorithmique Avancée', 'ALG503'],
                    ['Intelligence Artificielle', 'IA503'],
                    ['Réseaux et Connaissances Sémantiques', 'SEM503'],
                    ['Anglais', 'ENG503']
                ]
            ],
            [
                'name' => '2ème Année Master Systèmes d\'Information et Connaissances (SIC)',
                'level' => $level6->id,
                'speciality' => $sicSpeciality->id,
                'modules' => [
                    ['Ingénierie des Systèmes', 'SE504'],
                    ['Représentation des Connaissances Web', 'WEB504'],
                    ['Recherche d\'Information', 'IR504'],
                    ['Ingénierie des Requêtes', 'REQ504'],
                    ['Business Intelligence', 'BI504'],
                    ['Management de Projets', 'PM504'],
                    ['Éthique et Déontologie', 'ETHIC504']
                ]
            ]
        ];

        foreach ($academicStructure as $groupData) {
            // Create group
            $group = Group::create([
                'name' => $groupData['name'],
                'level_id' => $groupData['level'],
                'speciality_id' => $groupData['speciality'],
                'semester_id' => $semester1->id, // Use S1 by default
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create modules for this group
            foreach ($groupData['modules'] as $moduleData) {
                Module::create([
                    'module_name' => $moduleData[0],
                    'code' => $moduleData[1],
                    'description' => "Module: {$moduleData[0]} ({$moduleData[1]})",
                    'credits' => 4,
                    'semester' => 'S1',
                    'level_id' => $groupData['level'],
                    'speciality_id' => $groupData['speciality'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Complete academic structure seeded successfully!');
    }
}
