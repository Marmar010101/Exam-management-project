<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use App\Models\Speciality;
use App\Models\Level;
use App\Models\Teacher;

class ModulesAcademiquesSeeder extends Seeder
{
    public function run()
    {
        echo "🧹 Nettoyage des modules et examens existants...\n";

        // Supprimer tous les examens existants
        \App\Models\Exam::query()->delete();
        echo "✅ Tous les examens supprimés\n";

        // Supprimer tous les modules existants
        \App\Models\Module::query()->delete();
        echo "✅ Tous les modules supprimés\n";

        echo "🚀 Création des 132 modules académiques (sans stage et soutenance)...\n";

        // Récupérer les données de référence
        $specialties = Speciality::pluck('id', 'name');
        $levels = Level::pluck('id', 'name');
        $teachers = Teacher::pluck('id', 'first_name');

        // SYSTÈME INGÉNIEUR (65 modules)
        
        // TRONC COMMUN - 1ère année (20 modules)
        $troncCommun1A = [
            ['MATH101', 'Mathématiques 1', 'Algèbre linéaire et analyse', 6, 4, 90, 45, 45, 'Tronc Commun', 'ing1', 's1'],
            ['PHYS101', 'Physique 1', 'Mécanique et thermodynamique', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing1', 's1'],
            ['INFO101', 'Informatique 1', 'Introduction à la programmation', 6, 4, 90, 45, 45, 'Tronc Commun', 'ing1', 's1'],
            ['CHIM101', 'Chimie 1', 'Chimie générale et organique', 4, 2, 60, 30, 30, 'Tronc Commun', 'ing1', 's1'],
            ['ENG101', 'Anglais 1', 'Anglais technique et scientifique', 2, 1, 30, 15, 15, 'Tronc Commun', 'ing1', 's1'],
            ['MATH102', 'Mathématiques 2', 'Analyse avancée et probabilités', 6, 4, 90, 45, 45, 'Tronc Commun', 'ing1', 's2'],
            ['PHYS102', 'Physique 2', 'Électricité et magnétisme', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing1', 's2'],
            ['INFO102', 'Informatique 2', 'Structures de données et algorithmes', 6, 4, 90, 45, 45, 'Tronc Commun', 'ing1', 's2'],
            ['CHIM102', 'Chimie 2', 'Chimie physique et analytique', 4, 2, 60, 30, 30, 'Tronc Commun', 'ing1', 's2'],
            ['ENG102', 'Anglais 2', 'Communication scientifique', 2, 1, 30, 15, 15, 'Tronc Commun', 'ing1', 's2'],
            ['MATH103', 'Mathématiques 3', 'Calcul différentiel et intégral', 6, 4, 90, 45, 45, 'Tronc Commun', 'ing1', 's1'],
            ['PHYS103', 'Physique 3', 'Optique et physique moderne', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing1', 's1'],
            ['INFO103', 'Informatique 3', 'Programmation orientée objet', 6, 4, 90, 45, 45, 'Tronc Commun', 'ing1', 's1'],
            ['CHIM103', 'Chimie 3', 'Chimie industrielle', 4, 2, 60, 30, 30, 'Tronc Commun', 'ing1', 's1'],
            ['ENG103', 'Anglais 3', 'Rédaction technique', 2, 1, 30, 15, 15, 'Tronc Commun', 'ing1', 's1'],
            ['MATH104', 'Mathématiques 4', 'Équations différentielles', 6, 4, 90, 45, 45, 'Tronc Commun', 'ing1', 's2'],
            ['PHYS104', 'Physique 4', 'Physique quantique', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing1', 's2'],
            ['INFO104', 'Informatique 4', 'Bases de données', 6, 4, 90, 45, 45, 'Tronc Commun', 'ing1', 's2'],
            ['CHIM104', 'Chimie 4', 'Matériaux et polymères', 4, 2, 60, 30, 30, 'Tronc Commun', 'ing1', 's2'],
            ['ENG104', 'Anglais 4', 'Présentation scientifique', 2, 1, 30, 15, 15, 'Tronc Commun', 'ing1', 's2'],
        ];

        // TRONC COMMUN - 2ème année (15 modules)
        $troncCommun2A = [
            ['MATH201', 'Mathématiques appliquées 1', 'Statistiques et probabilités', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing2', 's1'],
            ['PHYS201', 'Physique appliquée 1', 'Électronique analogique', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing2', 's1'],
            ['INFO201', 'Informatique appliquée 1', 'Réseaux informatiques', 6, 4, 90, 45, 45, 'Tronc Commun', 'ing2', 's1'],
            ['MECA201', 'Mécanique 1', 'Mécanique des solides', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing2', 's1'],
            ['THERM201', 'Thermodynamique 1', 'Thermodynamique appliquée', 4, 2, 60, 30, 30, 'Tronc Commun', 'ing2', 's1'],
            ['MATH202', 'Mathématiques appliquées 2', 'Analyse numérique', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing2', 's2'],
            ['PHYS202', 'Physique appliquée 2', 'Électronique numérique', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing2', 's2'],
            ['INFO202', 'Informatique appliquée 2', 'Systèmes d\'exploitation', 6, 4, 90, 45, 45, 'Tronc Commun', 'ing2', 's2'],
            ['MECA202', 'Mécanique 2', 'Mécanique des fluides', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing2', 's2'],
            ['THERM202', 'Thermodynamique 2', 'Transferts thermiques', 4, 2, 60, 30, 30, 'Tronc Commun', 'ing2', 's2'],
            ['MATH203', 'Mathématiques appliquées 3', 'Optimisation', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing2', 's1'],
            ['PHYS203', 'Physique appliquée 3', 'Automatique', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing2', 's1'],
            ['INFO203', 'Informatique appliquée 3', 'Intelligence artificielle', 6, 4, 90, 45, 45, 'Tronc Commun', 'ing2', 's1'],
            ['MECA203', 'Mécanique 3', 'Résistance des matériaux', 5, 3, 75, 45, 30, 'Tronc Commun', 'ing2', 's1'],
            ['THERM203', 'Thermodynamique 3', 'Énergétique', 4, 2, 60, 30, 30, 'Tronc Commun', 'ing2', 's1'],
        ];

        // SPÉCIALITÉS - 3ème année (30 modules - 5 branches × 6 modules)
        $specialites3A = [
            // Intelligence Artificielle
            ['GINF301', 'Algorithmique avancée', 'Algorithmes complexes et structures', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'ing3', 's1'],
            ['GINF302', 'Programmation web', 'Développement full-stack', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'ing3', 's1'],
            ['GINF303', 'Sécurité informatique', 'Cybersécurité et cryptographie', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'ing3', 's2'],
            ['GINF304', 'Cloud computing', 'Infrastructures cloud', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'ing3', 's2'],
            ['GINF305', 'Machine learning', 'Apprentissage automatique', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'ing3', 's1'],
            ['GINF306', 'Big data', 'Gestion des données massives', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'ing3', 's2'],

            // Réseaux
            ['GELE301', 'Électronique de puissance', 'Convertisseurs et commandes', 6, 4, 90, 45, 45, 'Réseaux', 'ing3', 's1'],
            ['GELE302', 'Machines électriques', 'Moteurs et générateurs', 6, 4, 90, 45, 45, 'Réseaux', 'ing3', 's1'],
            ['GELE303', 'Automatique industrielle', 'Contrôle et régulation', 5, 3, 75, 45, 30, 'Réseaux', 'ing3', 's2'],
            ['GELE304', 'Réseaux électriques', 'Distribution et transport', 5, 3, 75, 45, 30, 'Réseaux', 'ing3', 's2'],
            ['GELE305', 'Énergies renouvelables', 'Solaire et éolien', 6, 4, 90, 45, 45, 'Réseaux', 'ing3', 's1'],
            ['GELE306', 'Smart grid', 'Réseaux intelligents', 5, 3, 75, 45, 30, 'Réseaux', 'ing3', 's2'],

            // Génie Logiciel
            ['GMEC301', 'CAO/DAO', 'Conception assistée', 6, 4, 90, 45, 45, 'Génie Logiciel', 'ing3', 's1'],
            ['GMEC302', 'Fabrication mécanique', 'Usinage et procédés', 6, 4, 90, 45, 45, 'Génie Logiciel', 'ing3', 's1'],
            ['GMEC303', 'Mécanique des fluides avancée', 'CFD et simulation', 5, 3, 75, 45, 30, 'Génie Logiciel', 'ing3', 's2'],
            ['GMEC304', 'Matériaux avancés', 'Composites et alliages', 5, 3, 75, 45, 30, 'Génie Logiciel', 'ing3', 's2'],
            ['GMEC305', 'Robotique', 'Automatisation et robots', 6, 4, 90, 45, 45, 'Génie Logiciel', 'ing3', 's1'],
            ['GMEC306', 'Maintenance industrielle', 'Fiabilité et maintenance', 5, 3, 75, 45, 30, 'Génie Logiciel', 'ing3', 's2'],

            // Systèmes d'Information et Communication
            ['GCIV301', 'Béton armé', 'Calcul et dimensionnement', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'ing3', 's1'],
            ['GCIV302', 'Structures métalliques', 'Charpentes et ossatures', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'ing3', 's1'],
            ['GCIV303', 'Géotechnique', 'Mécanique des sols', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'ing3', 's2'],
            ['GCIV304', 'Hydraulique', 'Écoulements et canaux', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'ing3', 's2'],
            ['GCIV305', 'Bâtiment', 'Construction et normes', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'ing3', 's1'],
            ['GCIV306', 'Urbanisme', 'Aménagement urbain', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'ing3', 's2'],

            // Intelligence Artificielle (deuxième groupe)
            ['GCHI301', 'Opérations unitaires', 'Procédés industriels', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'ing3', 's1'],
            ['GCHI302', 'Génie de la réaction', 'Cinétique et réacteurs', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'ing3', 's1'],
            ['GCHI303', 'Procédés de séparation', 'Distillation et extraction', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'ing3', 's2'],
            ['GCHI304', 'Catalyse', 'Catalyseurs et réactions', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'ing3', 's2'],
            ['GCHI305', 'Polymères', 'Science des polymères', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'ing3', 's1'],
            ['GCHI306', 'Environnement', 'Traitement des effluents', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'ing3', 's2'],
        ];

        // SYSTÈME LMD (67 modules)
        
        // LICENCE (20 modules)
        $licenceModules = [
            ['L1MATH101', 'Algèbre', 'Structures algébriques fondamentales', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'L1', 's1'],
            ['L1MATH102', 'Analyse', 'Fonctions et limites', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'L1', 's1'],
            ['L1INFO101', 'Algorithmique', 'Introduction aux algorithmes', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'L1', 's1'],
            ['L1INFO102', 'Programmation', 'C et C++', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'L1', 's1'],
            ['L1PHYS101', 'Physique générale', 'Mécanique et électricité', 4, 2, 60, 30, 30, 'Intelligence Artificielle', 'L1', 's1'],
            ['L1MATH201', 'Probabilités', 'Statistiques et probabilités', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'L1', 's2'],
            ['L1MATH202', 'Calcul intégral', 'Intégration et dérivation', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'L1', 's2'],
            ['L1INFO201', 'Structures de données', 'Listes, piles, files', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'L1', 's2'],
            ['L1INFO202', 'Bases de données', 'SQL et modèles', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'L1', 's2'],
            ['L1PHYS201', 'Électronique', 'Circuits et composants', 4, 2, 60, 30, 30, 'Intelligence Artificielle', 'L1', 's2'],
            ['L2INFO301', 'Programmation web', 'HTML, CSS, JavaScript', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'L2', 's1'],
            ['L2INFO302', 'Réseaux', 'TCP/IP et protocoles', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'L2', 's1'],
            ['L2INFO303', 'Systèmes d\'exploitation', 'Linux et Windows', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'L2', 's1'],
            ['L2INFO304', 'Logiciel', 'Génie logiciel', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'L2', 's1'],
            ['L2INFO305', 'Anglais technique', 'Communication technique', 2, 1, 30, 15, 15, 'Systèmes d\'Information et Communication', 'L2', 's1'],
            ['L2INFO401', 'Intelligence artificielle', 'Machine learning basics', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'L2', 's2'],
            ['L2INFO402', 'Data science', 'Analyse de données', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'L2', 's2'],
            ['L2INFO403', 'Sécurité', 'Cybersécurité', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'L2', 's2'],
            ['L2INFO404', 'Mobile', 'Développement mobile', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'L2', 's2'],
            ['L2INFO405', 'Projet', 'Projet de fin d\'année', 3, 2, 45, 0, 45, 'Intelligence Artificielle', 'L2', 's2'],
        ];

        // MASTER (47 modules)
        $masterModules = [
            // M1 - Systèmes d'Information (12 modules)
            ['M1SI601', 'Architecture distribuée', 'Microservices et cloud', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'M1', 's1'],
            ['M1SI602', 'Big data', 'Hadoop et Spark', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'M1', 's1'],
            ['M1SI603', 'DevOps', 'CI/CD et conteneurs', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'M1', 's1'],
            ['M1SI604', 'Sécurité avancée', 'Sécurité des systèmes', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'M1', 's1'],
            ['M1SI605', 'IoT', 'Internet des objets', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'M1', 's1'],
            ['M1SI606', 'Blockchain', 'Technologies blockchain', 4, 2, 60, 30, 30, 'Systèmes d\'Information et Communication', 'M1', 's1'],
            ['M1SI607', 'Cloud natif', 'Kubernetes et Docker', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'M1', 's2'],
            ['M1SI608', 'Data engineering', 'Pipelines de données', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'M1', 's2'],
            ['M1SI609', 'API REST', 'Conception d\'API', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'M1', 's2'],
            ['M1SI610', 'Monitoring', 'Supervision et métriques', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'M1', 's2'],
            ['M1SI611', 'Recherche SI', 'Méthodologie de recherche', 4, 2, 60, 30, 30, 'Systèmes d\'Information et Communication', 'M1', 's2'],
            ['M1SI612', 'Projet SI', 'Projet de recherche', 6, 4, 90, 0, 90, 'Systèmes d\'Information et Communication', 'M1', 's2'],

            // M2 - Systèmes d'Information (11 modules)
            ['M2SI701', 'Edge computing', 'Calcul de périphérie', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'M2', 's1'],
            ['M2SI702', 'Serverless', 'Architecture serverless', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'M2', 's1'],
            ['M2SI703', 'ML Ops', 'Machine learning ops', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'M2', 's1'],
            ['M2SI704', 'Quantique', 'Informatique quantique', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'M2', 's1'],
            ['M2SI705', '5G/6G', 'Réseaux nouvelle génération', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'M2', 's1'],
            ['M2SI706', 'Green IT', 'Informatique verte', 4, 2, 60, 30, 30, 'Systèmes d\'Information et Communication', 'M2', 's1'],
            ['M2SI707', 'Web3', 'Décentralisation web', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'M2', 's2'],
            ['M2SI708', 'Cyber résilience', 'Résilience cyber', 6, 4, 90, 45, 45, 'Systèmes d\'Information et Communication', 'M2', 's2'],
            ['M2SI709', 'Digital twin', 'Jumeaux numériques', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'M2', 's2'],
            ['M2SI710', 'Ethique IA', 'Éthique et IA', 5, 3, 75, 45, 30, 'Systèmes d\'Information et Communication', 'M2', 's2'],
            ['M2SI712', 'Publication', 'Article scientifique', 4, 2, 60, 0, 60, 'Systèmes d\'Information et Communication', 'M2', 's2'],

            // M1 - Logiciels Intelligents (12 modules)
            ['M1LI701', 'Deep learning', 'Réseaux de neurones profonds', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'M1', 's1'],
            ['M1LI702', 'NLP', 'Traitement du langage naturel', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'M1', 's1'],
            ['M1LI703', 'Computer vision', 'Vision par ordinateur', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'M1', 's1'],
            ['M1LI704', 'Reinforcement learning', 'Apprentissage par renforcement', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'M1', 's1'],
            ['M1LI705', 'Robotique IA', 'Robotique intelligente', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'M1', 's1'],
            ['M1LI706', 'Ethique IA', 'Éthique de l\'IA', 4, 2, 60, 30, 30, 'Intelligence Artificielle', 'M1', 's1'],
            ['M1LI707', 'Transformers', 'Modèles transformers', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'M1', 's2'],
            ['M1LI708', 'GANs', 'Réseaux génératifs', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'M1', 's2'],
            ['M1LI709', 'Explainable AI', 'IA explicable', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'M1', 's2'],
            ['M1LI710', 'Edge AI', 'IA en périphérie', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'M1', 's2'],
            ['M1LI711', 'Recherche IA', 'Méthodes de recherche', 4, 2, 60, 30, 30, 'Intelligence Artificielle', 'M1', 's2'],
            ['M1LI712', 'Projet IA', 'Projet de recherche IA', 6, 4, 90, 0, 90, 'Intelligence Artificielle', 'M1', 's2'],

            // M2 - Logiciels Intelligents (12 modules)
            ['M2LI801', 'AGI', 'Intelligence artificielle générale', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'M2', 's1'],
            ['M2LI802', 'Quantum ML', 'Machine learning quantique', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'M2', 's1'],
            ['M2LI803', 'Neuromorphic', 'Calcul neuromorphique', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'M2', 's1'],
            ['M2LI804', 'Federated learning', 'Apprentissage fédéré', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'M2', 's1'],
            ['M2LI805', 'Meta learning', 'Méta-apprentissage', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'M2', 's1'],
            ['M2LI806', 'AI governance', 'Gouvernance de l\'IA', 4, 2, 60, 30, 30, 'Intelligence Artificielle', 'M2', 's1'],
            ['M2LI807', 'Multimodal AI', 'IA multimodale', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'M2', 's2'],
            ['M2LI808', 'AI safety', 'Sécurité de l\'IA', 6, 4, 90, 45, 45, 'Intelligence Artificielle', 'M2', 's2'],
            ['M2LI809', 'Human-AI interaction', 'Interaction humain-IA', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'M2', 's2'],
            ['M2LI810', 'AI economics', 'Économie de l\'IA', 5, 3, 75, 45, 30, 'Intelligence Artificielle', 'M2', 's2'],
            ['M2LI812', 'Publication IA', 'Publication scientifique IA', 4, 2, 60, 0, 60, 'Intelligence Artificielle', 'M2', 's2'],
        ];

        // Fusionner tous les modules
        $allModules = array_merge($troncCommun1A, $troncCommun2A, $specialites3A, $licenceModules, $masterModules);

        $createdCount = 0;
        foreach ($allModules as $moduleData) {
            [$code, $name, $description, $credits, $coefficient, $volume_horaire, $cm, $td, $specialtyName, $levelName, $semester] = $moduleData;

            // Récupérer les IDs
            $specialtyId = $specialties[$specialtyName] ?? null;
            $levelId = $levels[$levelName] ?? null;
            $teacherId = $teachers->first() ?? 1; // Premier enseignant par défaut

            if ($specialtyId && $levelId) {
                Module::create([
                    'code' => $code,
                    'module_name' => $name,
                    'description' => $description,
                    'credits' => $credits,
                    'coefficient' => $coefficient,
                    'volume_cm' => $cm,
                    'volume_td' => $td,
                    'speciality_id' => $specialtyId,
                    'level_id' => $levelId,
                    'teacher_id' => $teacherId,
                    'semester' => $semester,
                ]);
                $createdCount++;
            } else {
                echo "⚠️ Module non créé: $code - Spécialité: $specialtyName (ID: " . ($specialtyId ?? 'NULL') . "), Niveau: $levelName (ID: " . ($levelId ?? 'NULL') . ")\n";
            }
        }

        echo "✅ {$createdCount} modules académiques créés avec succès\n";
        echo "📊 Répartition: Ingénieur (65) + Licence (20) + Master (47) = 132 modules (sans stage et soutenance)\n";
    }
}
