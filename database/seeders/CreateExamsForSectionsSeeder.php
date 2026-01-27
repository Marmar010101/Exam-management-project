<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreateExamsForSectionsSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer toutes les sections (groups)
        $sections = DB::table('groups')->get();
        
        // Récupérer tous les modules
        $modules = DB::table('modules')->get();
        
        // Types d'examens à créer
        $examTypes = [
            'Exam' => ['Exam', 'Control', 'Test_TP'],
            'Control' => ['Control'],
            'Test_TP' => ['Test_TP']
        ];
        
        echo "Création des examens pour " . $sections->count() . " sections et " . $modules->count() . " modules\n";
        
        $createdExams = 0;
        
        foreach ($sections as $section) {
            echo "\n=== Section: " . $section->name . " ===\n";
            
            // Récupérer les modules pour cette section selon le niveau
            $sectionModules = $this->getModulesForSection($modules, $section);
            
            foreach ($sectionModules as $module) {
                echo "Module: " . $module->module_name . "\n";
                
                // Déterminer les types d'examens pour ce module
                $typesForModule = $this->getExamTypesForModule($module);
                
                foreach ($typesForModule as $examType) {
                    // Créer les 3 types d'examen: Normal, Remplacement, Rattrapage
                    $examSubtypes = ['Normal', 'Remplacement', 'Rattrapage'];
                    
                    foreach ($examSubtypes as $subtype) {
                        // Vérifier si l'examen existe déjà
                        $existing = DB::table('exams')
                            ->where('module_id', $module->id)
                            ->where('exam_type', $examType)
                            ->where('exam_subtype', $subtype)
                            ->where('group_id', $section->id)
                            ->first();
                        
                        if (!$existing) {
                            $examId = DB::table('exams')->insertGetId([
                                'module_id' => $module->id,
                                'group_id' => $section->id,
                                'exam_type' => $examType,
                                'exam_subtype' => $subtype,
                                'title' => $this->generateExamTitle($module->module_name, $examType, $subtype),
                                'description' => $this->generateExamDescription($module->module_name, $examType, $subtype),
                                'duration_minutes' => $this->getDefaultDuration($examType),
                                'max_score' => 20,
                                'exam_date_old' => now()->format('Y-m-d'),
                                'exam_time_old' => '08:00:00',
                                'teacher_id' => 18, // Valid teacher ID
                                'group_id_old' => $section->id,
                                'module_id_old' => $module->id,
                                'room_id' => 1,   // Default room
                                'duration' => $this->getDefaultDuration($examType),
                                'status' => 'scheduled',
                                'created_by' => 1,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                            
                            echo "  ✓ Créé: " . $examType . " - " . $subtype . " (ID: " . $examId . ")\n";
                            $createdExams++;
                        } else {
                            echo "  - Existe déjà: " . $examType . " - " . $subtype . "\n";
                        }
                    }
                }
            }
        }
        
        echo "\n=== Résumé ===\n";
        echo "Total des examens créés: " . $createdExams . "\n";
        
        // Afficher le total des examens dans la base de données
        $totalExams = DB::table('exams')->count();
        echo "Total des examens dans la base de données: " . $totalExams . "\n";
    }
    
    private function getModulesForSection($modules, $section)
    {
        // Modules spécifiques selon la section
        $sectionModules = [
            '1ère Année Ingénieur Informatique (SI)' => [
                'Algorithmique',
                'Systèmes d\'Exploitation',
                'Algèbre',
                'Analyse',
                'Expression Écrite et Bureautique',
                'Structure Machine',
                'Électronique Fondamentale'
            ],
            '2ème Année Ingénieur Informatique' => [
                'Analyse 3',
                'Algorithmique 3',
                'Algèbre 3',
                'Programmation Orientée Objet (POO 1)',
                'Probabilités et Statistiques',
                'Systèmes d\'Information',
                'Entreprenariat'
            ],
            '3ème Année Ingénieur Informatique – Génie Logiciel (GL)' => [
                'Génie Logiciel',
                'Bases de Données',
                'Algorithmique',
                'Systèmes d\'Exploitation',
                'Technologies Optimales',
                'Intelligence Artificielle'
            ],
            '3ème Année Ingénieur Informatique – Intelligence Artificielle (IA)' => [
                'Génie Logiciel',
                'Bases de Données',
                'Analyse Numérique',
                'Systèmes d\'Exploitation',
                'Technologies Optimales',
                'Intelligence Artificielle',
                'Développement Mobile'
            ],
            '3ème Année Ingénieur Informatique – Réseaux' => [
                'Génie Logiciel',
                'Bases de Données Avancées',
                'Réseaux Avancés',
                'Systèmes d\'Exploitation',
                'Technologies Web',
                'Modélisation des Systèmes d\'Information'
            ],
            '4ème Année Ingénieur Informatique – Génie Logiciel (GL)' => [
                'Conception de Logiciels',
                'Data Mining',
                'Compilation 2',
                'Web Avancé',
                'Méthodes de Management Agiles',
                'Réseaux et Protocoles'
            ],
            '4ème Année Ingénieur Informatique – Intelligence Artificielle (IA)' => [
                'Recherche Opérationnelle',
                'Calcul Haute Performance',
                'Machine Learning',
                'Représentation des Connaissances',
                'Business Intelligence',
                'Modélisation et Simulation',
                'Techniques de Rédaction'
            ],
            '1ère Année Licence Informatique' => [
                'Algorithmique',
                'Analyse',
                'Algèbre',
                'Électricité',
                'Structure Machine',
                'Logiciels Libres',
                'Anglais'
            ],
            '2ème Année Licence Informatique' => [
                'Algorithmique',
                'Théorie des Graphes',
                'Architecture des Ordinateurs',
                'Logique Mathématique',
                'Systèmes d\'Information',
                'Mathématiques Numériques',
                'Anglais'
            ],
            '3ème Année Licence Informatique' => [
                'Programmation Logique',
                'Compilation',
                'Interfaces Homme–Machine (IHM)',
                'Systèmes d\'Exploitation',
                'Génie Logiciel',
                'Probabilités',
                'Économie Numérique'
            ],
            '1ère Année Master Génie Logiciel (GL)' => [
                'Ingénierie des Exigences',
                'Calcul Haute Performance',
                'Intelligence Artificielle',
                'Architecture d\'Entreprise',
                'Web Avancé',
                'Arduino',
                'Anglais'
            ],
            '1ère Année Master Intelligence Artificielle (IA)' => [
                'Analyse de Données',
                'Bases de Données Avancées',
                'Applications Automatiques',
                'Représentation des Connaissances',
                'Recherche Heuristique',
                'Réseaux Avancés',
                'Data Science',
                'Anglais'
            ],
            '1ère Année Master Réseaux et Systèmes Distribués (RSD)' => [
                'Protocoles et Concepts',
                'Téléphonie IP',
                'Réseaux Avancés',
                'Algorithmique Avancée',
                'Modélisation',
                'Administration des SGBD',
                'Anglais'
            ],
            '1ère Année Master Systèmes d\'Information et Connaissances (SIC)' => [
                'Ingénierie des Exigences',
                'Bases de Données Avancées',
                'Systèmes d\'Information Avancés',
                'Algorithmique Avancée',
                'Intelligence Artificielle',
                'Réseaux et Connaissances Sémantiques',
                'Anglais'
            ],
            '2ème Année Master Génie Logiciel (GL)' => [
                'Ingénierie des Systèmes',
                'Cloud Computing',
                'Validation et Vérification (V&V)',
                'Ingénierie des Exigences et Requêtes (IR)',
                'ERP',
                'Architecture Logicielle Avancée',
                'Éthique et Déontologie'
            ],
            '2ème Année Master Intelligence Artificielle (IA)' => [
                'Fouille de Données',
                'Cloud Computing',
                'Recherche d\'Information',
                'Traitement Automatique du Langage Naturel (TALN)',
                'Apprentissage Profond',
                'Apprentissage par Contraintes (ACL)',
                'Éthique et Déontologie'
            ],
            '2ème Année Master Réseaux et Systèmes Distribués (RSD)' => [
                'Pair-à-Pair (P2P)',
                'Ingénierie des Réseaux',
                'Réseaux Mobiles',
                'Systèmes Distribués',
                'Applications Réparties',
                'Systèmes Embarqués',
                'Éthique et Déontologie'
            ],
            '2ème Année Master Systèmes d\'Information et Connaissances (SIC)' => [
                'Ingénierie des Systèmes',
                'Représentation des Connaissances Web',
                'Recherche d\'Information',
                'Ingénierie des Requêtes',
                'Business Intelligence',
                'Management de Projets',
                'Éthique et Déontologie'
            ]
        ];
        
        $sectionName = $section->name;
        $moduleNames = $sectionModules[$sectionName] ?? [];
        
        return $modules->filter(function($module) use ($moduleNames) {
            return in_array($module->module_name, $moduleNames);
        });
    }
    
    private function getExamTypesForModule($module)
    {
        // Déterminer les types d'examens selon le module
        $moduleName = strtolower($module->module_name);
        
        $types = ['Exam']; // Tous les modules ont des Exam
        
        // Modules avec TD ont des Controls
        if (strpos($moduleName, 'algorithmique') !== false || 
            strpos($moduleName, 'algèbre') !== false || 
            strpos($moduleName, 'analyse') !== false ||
            strpos($moduleName, 'probabilité') !== false ||
            strpos($moduleName, 'mathématique') !== false ||
            strpos($moduleName, 'logique') !== false) {
            $types[] = 'Control';
        }
        
        // Modules avec TP ont des Test_TP
        if (strpos($moduleName, 'programmation') !== false || 
            strpos($moduleName, 'base de données') !== false ||
            strpos($moduleName, 'réseaux') !== false ||
            strpos($moduleName, 'système') !== false ||
            strpos($moduleName, 'logiciel') !== false ||
            strpos($moduleName, 'web') !== false ||
            strpos($moduleName, 'compilation') !== false ||
            strpos($moduleName, 'arduino') !== false) {
            $types[] = 'Test_TP';
        }
        
        return $types;
    }
    
    private function generateExamTitle($moduleName, $examType, $subtype)
    {
        $typeLabels = [
            'Exam' => 'Examen',
            'Control' => 'Contrôle',
            'Test_TP' => 'Test TP'
        ];
        
        $subtypeLabels = [
            'Normal' => 'Normal',
            'Remplacement' => 'Remplacement',
            'Rattrapage' => 'Rattrapage'
        ];
        
        return $moduleName . ' - ' . $typeLabels[$examType] . ' ' . $subtypeLabels[$subtype];
    }
    
    private function generateExamDescription($moduleName, $examType, $subtype)
    {
        $typeDescriptions = [
            'Exam' => 'Examen final pour le module de ' . $moduleName,
            'Control' => 'Contrôle continu pour le module de ' . $moduleName,
            'Test_TP' => 'Test de travaux pratiques pour le module de ' . $moduleName
        ];
        
        return $typeDescriptions[$examType] . ' (' . $subtype . ')';
    }
    
    private function getDefaultDuration($examType)
    {
        $durations = [
            'Exam' => 120, // 2 heures
            'Control' => 60,  // 1 heure
            'Test_TP' => 90   // 1.5 heures
        ];
        
        return $durations[$examType] ?? 120;
    }
}
