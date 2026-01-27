<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreateSectionsSeeder extends Seeder
{
    public function run(): void
    {
        // Supprimer les anciens groupes
        DB::table('groups')->delete();
        
        // Récupérer les niveaux
        $levels = DB::table('levels')->pluck('id', 'name');
        
        echo "Available levels: " . $levels->keys()->implode(', ') . PHP_EOL;
        
        // Définition des sections avec leurs modules (ordonnées correctement)
        $sections = [
            [
                'name' => '1ère Année Ingénieur Informatique (SI)',
                'level_name' => 'ing1',
                'modules' => [
                    'Algorithmique',
                    'Systèmes d\'Exploitation',
                    'Algèbre',
                    'Analyse',
                    'Expression Écrite et Bureautique',
                    'Structure Machine',
                    'Électronique Fondamentale'
                ]
            ],
            [
                'name' => '2ème Année Ingénieur Informatique',
                'level_name' => 'ing2',
                'modules' => [
                    'Analyse 3',
                    'Algorithmique 3',
                    'Algèbre 3',
                    'Programmation Orientée Objet (POO 1)',
                    'Probabilités et Statistiques',
                    'Systèmes d\'Information',
                    'Entreprenariat'
                ]
            ],
            [
                'name' => '3ème Année Ingénieur Informatique – Génie Logiciel (GL)',
                'level_name' => 'ing3',
                'modules' => [
                    'Génie Logiciel',
                    'Bases de Données',
                    'Algorithmique',
                    'Systèmes d\'Exploitation',
                    'Technologies Optimales',
                    'Intelligence Artificielle'
                ]
            ],
            [
                'name' => '3ème Année Ingénieur Informatique – Intelligence Artificielle (IA)',
                'level_name' => 'ing3',
                'modules' => [
                    'Génie Logiciel',
                    'Bases de Données',
                    'Analyse Numérique',
                    'Systèmes d\'Exploitation',
                    'Technologies Optimales',
                    'Intelligence Artificielle',
                    'Développement Mobile'
                ]
            ],
            [
                'name' => '3ème Année Ingénieur Informatique – Réseaux',
                'level_name' => 'ing3',
                'modules' => [
                    'Génie Logiciel',
                    'Bases de Données Avancées',
                    'Réseaux Avancés',
                    'Systèmes d\'Exploitation',
                    'Technologies Web',
                    'Modélisation des Systèmes d\'Information'
                ]
            ],
            [
                'name' => '4ème Année Ingénieur Informatique – Génie Logiciel (GL)',
                'level_name' => 'ing4',
                'modules' => [
                    'Conception de Logiciels',
                    'Data Mining',
                    'Compilation 2',
                    'Web Avancé',
                    'Méthodes de Management Agiles',
                    'Réseaux et Protocoles'
                ]
            ],
            [
                'name' => '4ème Année Ingénieur Informatique – Intelligence Artificielle (IA)',
                'level_name' => 'ing4',
                'modules' => [
                    'Recherche Opérationnelle',
                    'Calcul Haute Performance',
                    'Machine Learning',
                    'Représentation des Connaissances',
                    'Business Intelligence',
                    'Modélisation et Simulation',
                    'Techniques de Rédaction'
                ]
            ],
            [
                'name' => '1ère Année Licence Informatique',
                'level_name' => 'L1',
                'modules' => [
                    'Algorithmique',
                    'Analyse',
                    'Algèbre',
                    'Électricité',
                    'Structure Machine',
                    'Logiciels Libres',
                    'Anglais'
                ]
            ],
            [
                'name' => '2ème Année Licence Informatique',
                'level_name' => 'L2',
                'modules' => [
                    'Algorithmique',
                    'Théorie des Graphes',
                    'Architecture des Ordinateurs',
                    'Logique Mathématique',
                    'Systèmes d\'Information',
                    'Mathématiques Numériques',
                    'Anglais'
                ]
            ],
            [
                'name' => '3ème Année Licence Informatique',
                'level_name' => 'L3',
                'modules' => [
                    'Programmation Logique',
                    'Compilation',
                    'Interfaces Homme–Machine (IHM)',
                    'Systèmes d\'Exploitation',
                    'Génie Logiciel',
                    'Probabilités',
                    'Économie Numérique'
                ]
            ],
            [
                'name' => '1ère Année Master Génie Logiciel (GL)',
                'level_name' => 'M1',
                'modules' => [
                    'Ingénierie des Exigences',
                    'Calcul Haute Performance',
                    'Intelligence Artificielle',
                    'Architecture d\'Entreprise',
                    'Web Avancé',
                    'Arduino',
                    'Anglais'
                ]
            ],
            [
                'name' => '1ère Année Master Intelligence Artificielle (IA)',
                'level_name' => 'M1',
                'modules' => [
                    'Analyse de Données',
                    'Bases de Données Avancées',
                    'Applications Automatiques',
                    'Représentation des Connaissances',
                    'Recherche Heuristique',
                    'Réseaux Avancés',
                    'Data Science',
                    'Anglais'
                ]
            ],
            [
                'name' => '1ère Année Master Réseaux et Systèmes Distribués (RSD)',
                'level_name' => 'M1',
                'modules' => [
                    'Protocoles et Concepts',
                    'Téléphonie IP',
                    'Réseaux Avancés',
                    'Algorithmique Avancée',
                    'Modélisation',
                    'Administration des SGBD',
                    'Anglais'
                ]
            ],
            [
                'name' => '1ère Année Master Systèmes d\'Information et Connaissances (SIC)',
                'level_name' => 'M1',
                'modules' => [
                    'Ingénierie des Exigences',
                    'Bases de Données Avancées',
                    'Systèmes d\'Information Avancés',
                    'Algorithmique Avancée',
                    'Intelligence Artificielle',
                    'Réseaux et Connaissances Sémantiques',
                    'Anglais'
                ]
            ],
            [
                'name' => '2ème Année Master Génie Logiciel (GL)',
                'level_name' => 'M2',
                'modules' => [
                    'Ingénierie des Systèmes',
                    'Cloud Computing',
                    'Validation et Vérification (V&V)',
                    'Ingénierie des Exigences et Requêtes (IR)',
                    'ERP',
                    'Architecture Logicielle Avancée',
                    'Éthique et Déontologie'
                ]
            ],
            [
                'name' => '2ème Année Master Intelligence Artificielle (IA)',
                'level_name' => 'M2',
                'modules' => [
                    'Fouille de Données',
                    'Cloud Computing',
                    'Recherche d\'Information',
                    'Traitement Automatique du Langage Naturel (TALN)',
                    'Apprentissage Profond',
                    'Apprentissage par Contraintes (ACL)',
                    'Éthique et Déontologie'
                ]
            ],
            [
                'name' => '2ème Année Master Réseaux et Systèmes Distribués (RSD)',
                'level_name' => 'M2',
                'modules' => [
                    'Pair-à-Pair (P2P)',
                    'Ingénierie des Réseaux',
                    'Réseaux Mobiles',
                    'Systèmes Distribués',
                    'Applications Réparties',
                    'Systèmes Embarqués',
                    'Éthique et Déontologie'
                ]
            ],
            [
                'name' => '2ème Année Master Systèmes d\'Information et Connaissances (SIC)',
                'level_name' => 'M2',
                'modules' => [
                    'Ingénierie des Systèmes',
                    'Représentation des Connaissances Web',
                    'Recherche d\'Information',
                    'Ingénierie des Requêtes',
                    'Business Intelligence',
                    'Management de Projets',
                    'Éthique et Déontologie'
                ]
            ]
        ];
        
        // Insérer les sections
        foreach ($sections as $section) {
            $levelId = $levels[$section['level_name']] ?? null;
            
            if (!$levelId) {
                echo "Warning: Level '{$section['level_name']}' not found for section '{$section['name']}'\n";
                continue;
            }
            
            $sectionId = DB::table('groups')->insertGetId([
                'name' => $section['name'],
                'level_id' => $levelId,
                'semester_id' => 54, // Semestre 1 par défaut
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            echo "Section created: {$section['name']} (ID: {$sectionId})\n";
            echo "Modules: " . implode(', ', $section['modules']) . "\n\n";
        }
        
        echo "\nCréation terminée! " . count($sections) . " sections créées.\n";
    }
}
