<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Speciality;
use App\Models\Level;
use App\Models\Semester;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        Module::query()->delete();
        
        // Récupérer les IDs
        $troncCommun = Speciality::where('name', 'Tronc Commun')->first();
        $ia = Speciality::where('name', 'Intelligence Artificielle')->first();
        $gl = Speciality::where('name', 'Génie Logiciel')->first();
        $res = Speciality::where('name', 'Réseaux')->first();
        $sic = Speciality::where('name', 'Systèmes d\'Information et Communication')->first();
        
        $levels = Level::all()->keyBy('name');
        $semesters = Semester::all();
        
        // Modules complets selon la structure académique
        $modules = [
            // TRONC COMMUN - 1ère Année S1
            ['Mathématiques 1', 'TC101', $troncCommun->id, $levels['ing1']->id, 'Semestre 1', ['Exam', 'Control']],
            ['Algorithmique 1', 'TC102', $troncCommun->id, $levels['ing1']->id, 'Semestre 1', ['Exam', 'Control']],
            ['Architecture des Ordinateurs 1', 'TC103', $troncCommun->id, $levels['ing1']->id, 'Semestre 1', ['Exam', 'Control']],
            ['Électronique Numérique', 'TC104', $troncCommun->id, $levels['ing1']->id, 'Semestre 1', ['Exam', 'Control']],
            ['Initiation à la Programmation (C)', 'TC105', $troncCommun->id, $levels['ing1']->id, 'Semestre 1', ['Exam', 'Control', 'Test_TP']],
            ['Anglais 1', 'TC106', $troncCommun->id, $levels['ing1']->id, 'Semestre 1', ['Control']],
            ['Méthodologie', 'TC107', $troncCommun->id, $levels['ing1']->id, 'Semestre 1', ['Control']],
            
            // TRONC COMMUN - 1ère Année S2
            ['Mathématiques 2', 'TC108', $troncCommun->id, $levels['ing1']->id, 'Semestre 2', ['Exam', 'Control']],
            ['Algorithmique 2', 'TC109', $troncCommun->id, $levels['ing1']->id, 'Semestre 2', ['Exam', 'Control']],
            ['Architecture des Ordinateurs 2', 'TC110', $troncCommun->id, $levels['ing1']->id, 'Semestre 2', ['Exam', 'Control']],
            ['Systèmes d\'Exploitation 1', 'TC111', $troncCommun->id, $levels['ing1']->id, 'Semestre 2', ['Exam', 'Control']],
            ['Programmation Orientée Objet (Java)', 'TC112', $troncCommun->id, $levels['ing1']->id, 'Semestre 2', ['Exam', 'Control']],
            ['Anglais 2', 'TC113', $troncCommun->id, $levels['ing1']->id, 'Semestre 2', ['Control']],
            ['Physique', 'TC114', $troncCommun->id, $levels['ing1']->id, 'Semestre 2', ['Exam', 'Control']],
            
            // TRONC COMMUN - 2ème Année S1
            ['Structures de Données', 'TC201', $troncCommun->id, $levels['ing2']->id, 'Semestre 1'],
            ['Bases de Données 1', 'TC202', $troncCommun->id, $levels['ing2']->id, 'Semestre 1'],
            ['Réseaux 1', 'TC203', $troncCommun->id, $levels['ing2']->id, 'Semestre 1'],
            ['Génie Logiciel 1', 'TC204', $troncCommun->id, $levels['ing2']->id, 'Semestre 1'],
            ['Probabilités/Statistiques', 'TC205', $troncCommun->id, $levels['ing2']->id, 'Semestre 1'],
            ['Programmation Web 1 (HTML/CSS)', 'TC206', $troncCommun->id, $levels['ing2']->id, 'Semestre 1'],
            ['Anglais 3', 'TC207', $troncCommun->id, $levels['ing2']->id, 'Semestre 1'],
            
            // TRONC COMMUN - 2ème Année S2
            ['Graphes et Optimisation', 'TC208', $troncCommun->id, $levels['ing2']->id, 'Semestre 2'],
            ['Bases de Données 2', 'TC209', $troncCommun->id, $levels['ing2']->id, 'Semestre 2'],
            ['Réseaux 2', 'TC210', $troncCommun->id, $levels['ing2']->id, 'Semestre 2'],
            ['Génie Logiciel 2', 'TC211', $troncCommun->id, $levels['ing2']->id, 'Semestre 2'],
            ['Systèmes d\'Exploitation 2', 'TC212', $troncCommun->id, $levels['ing2']->id, 'Semestre 2'],
            ['Programmation Web 2 (PHP/JS)', 'TC213', $troncCommun->id, $levels['ing2']->id, 'Semestre 2'],
            ['Anglais 4', 'TC214', $troncCommun->id, $levels['ing2']->id, 'Semestre 2'],
            
            // INTELLIGENCE ARTIFICIELLE - 3ème Année S1
            ['Introduction à l\'IA', 'IA301', $ia->id, $levels['ing3']->id, 'Semestre 1'],
            ['Apprentissage Automatique 1', 'IA302', $ia->id, $levels['ing3']->id, 'Semestre 1'],
            ['Logique Floue', 'IA303', $ia->id, $levels['ing3']->id, 'Semestre 1'],
            ['Systèmes Multi-Agents', 'IA304', $ia->id, $levels['ing3']->id, 'Semestre 1'],
            ['Traitement d\'Images', 'IA305', $ia->id, $levels['ing3']->id, 'Semestre 1'],
            ['Anglais Technique 5', 'IA306', $ia->id, $levels['ing3']->id, 'Semestre 1'],
            
            // INTELLIGENCE ARTIFICIELLE - 3ème Année S2
            ['Apprentissage Automatique 2', 'IA307', $ia->id, $levels['ing3']->id, 'Semestre 2'],
            ['Réseaux Neuronaux', 'IA308', $ia->id, $levels['ing3']->id, 'Semestre 2'],
            ['Traitement du Langage Naturel 1', 'IA309', $ia->id, $levels['ing3']->id, 'Semestre 2'],
            ['Robotique Intelligente', 'IA310', $ia->id, $levels['ing3']->id, 'Semestre 2'],
            ['Projet IA', 'IA311', $ia->id, $levels['ing3']->id, 'Semestre 2'],
            ['Communication', 'IA312', $ia->id, $levels['ing3']->id, 'Semestre 2'],
            
            // INTELLIGENCE ARTIFICIELLE - 4ème Année S1
            ['Deep Learning', 'IA401', $ia->id, $levels['ing4']->id, 'Semestre 1'],
            ['Vision par Ordinateur', 'IA402', $ia->id, $levels['ing4']->id, 'Semestre 1'],
            ['Fouille de Données Avancée', 'IA403', $ia->id, $levels['ing4']->id, 'Semestre 1'],
            ['Systèmes Experts', 'IA404', $ia->id, $levels['ing4']->id, 'Semestre 1'],
            ['Big Data Analytics', 'IA405', $ia->id, $levels['ing4']->id, 'Semestre 1'],
            
            // INTELLIGENCE ARTIFICIELLE - 4ème Année S2
            ['Apprentissage par Renforcement', 'IA406', $ia->id, $levels['ing4']->id, 'Semestre 2'],
            ['NLP Avancé', 'IA407', $ia->id, $levels['ing4']->id, 'Semestre 2'],
            ['IoT et IA', 'IA408', $ia->id, $levels['ing4']->id, 'Semestre 2'],
            ['Projet Avancé IA', 'IA409', $ia->id, $levels['ing4']->id, 'Semestre 2'],
            ['Gestion de Projet', 'IA410', $ia->id, $levels['ing4']->id, 'Semestre 2'],
            
            // INTELLIGENCE ARTIFICIELLE - M1 S1
            ['Machine Learning', 'IAM101', $ia->id, $levels['M1']->id, 'Semestre 1'],
            ['Réseaux Neuronaux Profonds', 'IAM102', $ia->id, $levels['M1']->id, 'Semestre 1'],
            ['Systèmes Multi-Agents', 'IAM103', $ia->id, $levels['M1']->id, 'Semestre 1'],
            ['Big Data Analytics', 'IAM104', $ia->id, $levels['M1']->id, 'Semestre 1'],
            ['Sécurité Avancée', 'IAM105', $ia->id, $levels['M1']->id, 'Semestre 1'],
            ['Anglais de Recherche', 'IAM106', $ia->id, $levels['M1']->id, 'Semestre 1'],
            ['Méthodologie de Recherche', 'IAM107', $ia->id, $levels['M1']->id, 'Semestre 1'],
            
            // INTELLIGENCE ARTIFICIELLE - M1 S2
            ['Deep Learning Avancé', 'IAM108', $ia->id, $levels['M1']->id, 'Semestre 2'],
            ['Vision par Ordinateur', 'IAM109', $ia->id, $levels['M1']->id, 'Semestre 2'],
            ['Traitement du Langage Naturel', 'IAM110', $ia->id, $levels['M1']->id, 'Semestre 2'],
            ['Data Mining Avancé', 'IAM111', $ia->id, $levels['M1']->id, 'Semestre 2'],
            ['Projet de Recherche IA', 'IAM112', $ia->id, $levels['M1']->id, 'Semestre 2'],
            ['Séminaires IA', 'IAM113', $ia->id, $levels['M1']->id, 'Semestre 2'],
            
            // GÉNIE LOGICIEL - 3ème Année S1
            ['Conception Avancée des Logiciels', 'GL301', $gl->id, $levels['ing3']->id, 'Semestre 1'],
            ['UML/ML Avancé', 'GL302', $gl->id, $levels['ing3']->id, 'Semestre 1'],
            ['Qualité Logicielle', 'GL303', $gl->id, $levels['ing3']->id, 'Semestre 1'],
            ['Test et Validation', 'GL304', $gl->id, $levels['ing3']->id, 'Semestre 1'],
            ['Architecture Logicielle', 'GL305', $gl->id, $levels['ing3']->id, 'Semestre 1'],
            ['Anglais Technique 5', 'GL306', $gl->id, $levels['ing3']->id, 'Semestre 1'],
            
            // GÉNIE LOGICIEL - 3ème Année S2
            ['Méthodes Agiles (Scrum/XP)', 'GL307', $gl->id, $levels['ing3']->id, 'Semestre 2'],
            ['Développement Web Avancé (Full-Stack)', 'GL308', $gl->id, $levels['ing3']->id, 'Semestre 2'],
            ['Développement Mobile (Android/iOS)', 'GL309', $gl->id, $levels['ing3']->id, 'Semestre 2'],
            ['DevOps Intro', 'GL310', $gl->id, $levels['ing3']->id, 'Semestre 2'],
            ['Projet GL', 'GL311', $gl->id, $levels['ing3']->id, 'Semestre 2'],
            ['Communication', 'GL312', $gl->id, $levels['ing3']->id, 'Semestre 2'],
            
            // GÉNIE LOGICIEL - 4ème Année S1
            ['Ingénierie des Exigences', 'GL401', $gl->id, $levels['ing4']->id, 'Semestre 1'],
            ['Architecture SOA/Microservices', 'GL402', $gl->id, $levels['ing4']->id, 'Semestre 1'],
            ['DevOps Avancé (CI/CD)', 'GL403', $gl->id, $levels['ing4']->id, 'Semestre 1'],
            ['Sécurité Logicielle', 'GL404', $gl->id, $levels['ing4']->id, 'Semestre 1'],
            ['Cloud Native Development', 'GL405', $gl->id, $levels['ing4']->id, 'Semestre 1'],
            
            // GÉNIE LOGICIEL - 4ème Année S2
            ['Développement d\'Applications Distribuées', 'GL406', $gl->id, $levels['ing4']->id, 'Semestre 2'],
            ['ERP/CRM', 'GL407', $gl->id, $levels['ing4']->id, 'Semestre 2'],
            ['Logiciel Embarqué', 'GL408', $gl->id, $levels['ing4']->id, 'Semestre 2'],
            ['Projet Intégrateur GL', 'GL409', $gl->id, $levels['ing4']->id, 'Semestre 2'],
            ['Management d\'Équipe', 'GL410', $gl->id, $levels['ing4']->id, 'Semestre 2'],
            
            // GÉNIE LOGICIEL - M1 S1
            ['Architecture Logicielle Avancée', 'GLM101', $gl->id, $levels['M1']->id, 'Semestre 1'],
            ['DevOps et CI/CD', 'GLM102', $gl->id, $levels['M1']->id, 'Semestre 1'],
            ['Qualité Logicielle', 'GLM103', $gl->id, $levels['M1']->id, 'Semestre 1'],
            ['Méthodes Agiles', 'GLM104', $gl->id, $levels['M1']->id, 'Semestre 1'],
            ['Développement Full-Stack', 'GLM105', $gl->id, $levels['M1']->id, 'Semestre 1'],
            ['Gestion de Projet Logiciel', 'GLM106', $gl->id, $levels['M1']->id, 'Semestre 1'],
            ['Anglais Professionnel', 'GLM107', $gl->id, $levels['M1']->id, 'Semestre 1'],
            
            // GÉNIE LOGICIEL - M1 S2
            ['Ingénierie des Exigences', 'GLM108', $gl->id, $levels['M1']->id, 'Semestre 2'],
            ['Cloud Native Development', 'GLM109', $gl->id, $levels['M1']->id, 'Semestre 2'],
            ['Sécurité des Applications', 'GLM110', $gl->id, $levels['M1']->id, 'Semestre 2'],
            ['Projet de Recherche GL', 'GLM111', $gl->id, $levels['M1']->id, 'Semestre 2'],
            ['Séminaires GL', 'GLM112', $gl->id, $levels['M1']->id, 'Semestre 2'],
            ['Communication Professionnelle', 'GLM113', $gl->id, $levels['M1']->id, 'Semestre 2'],
            
            // RÉSEAUX - 3ème Année S1
            ['Réseaux Avancés (TCP/IP Avancé)', 'RES301', $res->id, $levels['ing3']->id, 'Semestre 1'],
            ['Routage et Commutation (CCNA)', 'RES302', $res->id, $levels['ing3']->id, 'Semestre 1'],
            ['Sécurité Réseaux 1', 'RES303', $res->id, $levels['ing3']->id, 'Semestre 1'],
            ['Administration Système (Linux/Windows)', 'RES304', $res->id, $levels['ing3']->id, 'Semestre 1'],
            ['Anglais Technique 5', 'RES305', $res->id, $levels['ing3']->id, 'Semestre 1'],
            
            // RÉSEAUX - 3ème Année S2
            ['Réseaux Sans Fil/WiFi', 'RES306', $res->id, $levels['ing3']->id, 'Semestre 2'],
            ['Réseaux Mobiles (4G/5G)', 'RES307', $res->id, $levels['ing3']->id, 'Semestre 2'],
            ['Virtualisation (VMware/Hyper-V)', 'RES308', $res->id, $levels['ing3']->id, 'Semestre 2'],
            ['Services Réseaux (DNS/DHCP)', 'RES309', $res->id, $levels['ing3']->id, 'Semestre 2'],
            ['Projet Réseaux', 'RES310', $res->id, $levels['ing3']->id, 'Semestre 2'],
            ['Communication', 'RES311', $res->id, $levels['ing3']->id, 'Semestre 2'],
            
            // RÉSEAUX - 4ème Année S1
            ['Réseaux d\'Opérateurs', 'RES401', $res->id, $levels['ing4']->id, 'Semestre 1'],
            ['SDN/NFV', 'RES402', $res->id, $levels['ing4']->id, 'Semestre 1'],
            ['Sécurité Réseaux 2 (Firewalls/IDS)', 'RES403', $res->id, $levels['ing4']->id, 'Semestre 1'],
            ['Cloud Computing', 'RES404', $res->id, $levels['ing4']->id, 'Semestre 1'],
            ['Internet des Objets (IoT)', 'RES405', $res->id, $levels['ing4']->id, 'Semestre 1'],
            
            // RÉSEAUX - 4ème Année S2
            ['Réseaux Haut Débit', 'RES406', $res->id, $levels['ing4']->id, 'Semestre 2'],
            ['Télécommunications', 'RES407', $res->id, $levels['ing4']->id, 'Semestre 2'],
            ['Audit et Supervision Réseaux', 'RES408', $res->id, $levels['ing4']->id, 'Semestre 2'],
            ['Projet Avancé Réseaux', 'RES409', $res->id, $levels['ing4']->id, 'Semestre 2'],
            ['Gestion de Projet IT', 'RES410', $res->id, $levels['ing4']->id, 'Semestre 2'],
            
            // RÉSEAUX - M1 S1
            ['Réseaux Haut Débit et 5G', 'RESM101', $res->id, $levels['M1']->id, 'Semestre 1'],
            ['Virtualisation et Cloud Computing', 'RESM102', $res->id, $levels['M1']->id, 'Semestre 1'],
            ['Internet des Objets (IoT)', 'RESM103', $res->id, $levels['M1']->id, 'Semestre 1'],
            ['Cryptographie Appliquée', 'RESM104', $res->id, $levels['M1']->id, 'Semestre 1'],
            ['SDN/NFV', 'RESM105', $res->id, $levels['M1']->id, 'Semestre 1'],
            ['Anglais Technique Avancé', 'RESM106', $res->id, $levels['M1']->id, 'Semestre 1'],
            
            // RÉSEAUX - M1 S2
            ['Sécurité des Réseaux Avancée', 'RESM107', $res->id, $levels['M1']->id, 'Semestre 2'],
            ['Réseaux Mobiles Avancés', 'RESM108', $res->id, $levels['M1']->id, 'Semestre 2'],
            ['Data Center Design', 'RESM109', $res->id, $levels['M1']->id, 'Semestre 2'],
            ['Projet de Recherche Réseaux', 'RESM110', $res->id, $levels['M1']->id, 'Semestre 2'],
            ['Séminaires Réseaux', 'RESM111', $res->id, $levels['M1']->id, 'Semestre 2'],
            
            // SYSTÈMES D'INFORMATION - 3ème Année S1
            ['Management des SI', 'SIC301', $sic->id, $levels['ing3']->id, 'Semestre 1'],
            ['Conception des SI (Merise/UML)', 'SIC302', $sic->id, $levels['ing3']->id, 'Semestre 1'],
            ['Bases de Données Avancées', 'SIC303', $sic->id, $levels['ing3']->id, 'Semestre 1'],
            ['Intégration des Systèmes', 'SIC304', $sic->id, $levels['ing3']->id, 'Semestre 1'],
            ['Communication d\'Entreprise', 'SIC305', $sic->id, $levels['ing3']->id, 'Semestre 1'],
            ['Anglais Technique 5', 'SIC306', $sic->id, $levels['ing3']->id, 'Semestre 1'],
            
            // SYSTÈMES D'INFORMATION - 3ème Année S2
            ['ERP (SAP/Odoo)', 'SIC307', $sic->id, $levels['ing3']->id, 'Semestre 2'],
            ['Business Intelligence', 'SIC308', $sic->id, $levels['ing3']->id, 'Semestre 2'],
            ['Commerce Électronique', 'SIC309', $sic->id, $levels['ing3']->id, 'Semestre 2'],
            ['Droit des TI', 'SIC310', $sic->id, $levels['ing3']->id, 'Semestre 2'],
            ['Projet SI', 'SIC311', $sic->id, $levels['ing3']->id, 'Semestre 2'],
            ['Communication', 'SIC312', $sic->id, $levels['ing3']->id, 'Semestre 2'],
            
            // SYSTÈMES D'INFORMATION - 4ème Année S1
            ['Audit des SI', 'SIC401', $sic->id, $levels['ing4']->id, 'Semestre 1'],
            ['Sécurité des SI (ISO 27001)', 'SIC402', $sic->id, $levels['ing4']->id, 'Semestre 1'],
            ['Gouvernance des TI (COBIT)', 'SIC403', $sic->id, $levels['ing4']->id, 'Semestre 1'],
            ['Management de Projet SI', 'SIC404', $sic->id, $levels['ing4']->id, 'Semestre 1'],
            ['Stratégie Digitale', 'SIC405', $sic->id, $levels['ing4']->id, 'Semestre 1'],
            
            // SYSTÈMES D'INFORMATION - 4ème Année S2
            ['Data Warehouse', 'SIC406', $sic->id, $levels['ing4']->id, 'Semestre 2'],
            ['CRM', 'SIC407', $sic->id, $levels['ing4']->id, 'Semestre 2'],
            ['Transformation Digitale', 'SIC408', $sic->id, $levels['ing4']->id, 'Semestre 2'],
            ['Projet Intégrateur SIC', 'SIC409', $sic->id, $levels['ing4']->id, 'Semestre 2'],
            ['Entrepreneuriat', 'SIC410', $sic->id, $levels['ing4']->id, 'Semestre 2'],
            
            // SYSTÈMES D'INFORMATION - M1 S1
            ['Management Stratégique des SI', 'SICM101', $sic->id, $levels['M1']->id, 'Semestre 1'],
            ['Gouvernance des TI', 'SICM102', $sic->id, $levels['M1']->id, 'Semestre 1'],
            ['Business Intelligence Avancée', 'SICM103', $sic->id, $levels['M1']->id, 'Semestre 1'],
            ['Commerce Électronique Avancé', 'SICM104', $sic->id, $levels['M1']->id, 'Semestre 1'],
            ['Droit et Éthique des TI', 'SICM105', $sic->id, $levels['M1']->id, 'Semestre 1'],
            ['Anglais des Affaires', 'SICM106', $sic->id, $levels['M1']->id, 'Semestre 1'],
            
            // SYSTÈMES D'INFORMATION - M1 S2
            ['Transformation Digitale', 'SICM107', $sic->id, $levels['M1']->id, 'Semestre 2'],
            ['ERP et Gestion Intégrée', 'SICM108', $sic->id, $levels['M1']->id, 'Semestre 2'],
            ['Audit des Systèmes d\'Information', 'SICM109', $sic->id, $levels['M1']->id, 'Semestre 2'],
            ['Projet de Recherche SIC', 'SICM110', $sic->id, $levels['M1']->id, 'Semestre 2'],
            ['Séminaires SIC', 'SICM111', $sic->id, $levels['M1']->id, 'Semestre 2'],
            
            // LICENCE L1 S1
            ['Algorithmique 1', 'L101', $troncCommun->id, $levels['L1']->id, 'Semestre 1'],
            ['Mathématiques 1', 'L102', $troncCommun->id, $levels['L1']->id, 'Semestre 1'],
            ['Architecture des Ordinateurs 1', 'L103', $troncCommun->id, $levels['L1']->id, 'Semestre 1'],
            ['Systèmes d\'Exploitation 1', 'L104', $troncCommun->id, $levels['L1']->id, 'Semestre 1'],
            ['Initiation aux Réseaux', 'L105', $troncCommun->id, $levels['L1']->id, 'Semestre 1'],
            ['Langage C', 'L106', $troncCommun->id, $levels['L1']->id, 'Semestre 1'],
            ['Logique', 'L107', $troncCommun->id, $levels['L1']->id, 'Semestre 1'],
            ['Anglais 1', 'L108', $troncCommun->id, $levels['L1']->id, 'Semestre 1'],
            
            // LICENCE L1 S2
            ['Algorithmique 2', 'L109', $troncCommun->id, $levels['L1']->id, 'Semestre 2'],
            ['Mathématiques 2', 'L110', $troncCommun->id, $levels['L1']->id, 'Semestre 2'],
            ['Programmation Orientée Objet (Java)', 'L111', $troncCommun->id, $levels['L1']->id, 'Semestre 2'],
            ['Bases de Données 1', 'L112', $troncCommun->id, $levels['L1']->id, 'Semestre 2'],
            ['Électronique Numérique', 'L113', $troncCommun->id, $levels['L1']->id, 'Semestre 2'],
            ['Méthodologie', 'L114', $troncCommun->id, $levels['L1']->id, 'Semestre 2'],
            ['Anglais 2', 'L115', $troncCommun->id, $levels['L1']->id, 'Semestre 2'],
            
            // LICENCE L2 S1
            ['Structures de Données', 'L201', $troncCommun->id, $levels['L2']->id, 'Semestre 1'],
            ['Graphes et Combinatoire', 'L202', $troncCommun->id, $levels['L2']->id, 'Semestre 1'],
            ['Systèmes Logiques', 'L203', $troncCommun->id, $levels['L2']->id, 'Semestre 1'],
            ['Conception Objet (UML)', 'L204', $troncCommun->id, $levels['L2']->id, 'Semestre 1'],
            ['Bases de Données 2', 'L205', $troncCommun->id, $levels['L2']->id, 'Semestre 1'],
            ['Web 1 (HTML/CSS/JS)', 'L206', $troncCommun->id, $levels['L2']->id, 'Semestre 1'],
            ['Anglais 3', 'L207', $troncCommun->id, $levels['L2']->id, 'Semestre 1'],
            
            // LICENCE L2 S2
            ['Réseaux Informatiques', 'L208', $troncCommun->id, $levels['L2']->id, 'Semestre 2'],
            ['Langages Formels et Automates', 'L209', $troncCommun->id, $levels['L2']->id, 'Semestre 2'],
            ['Génie Logiciel', 'L210', $troncCommun->id, $levels['L2']->id, 'Semestre 2'],
            ['Administration Système', 'L211', $troncCommun->id, $levels['L2']->id, 'Semestre 2'],
            ['Programmation Web 2 (PHP/MySQL)', 'L212', $troncCommun->id, $levels['L2']->id, 'Semestre 2'],
            ['Probabilités/Stat', 'L213', $troncCommun->id, $levels['L2']->id, 'Semestre 2'],
            ['Anglais 4', 'L214', $troncCommun->id, $levels['L2']->id, 'Semestre 2'],
            
            // LICENCE L3 S1
            ['Intelligence Artificielle', 'L301', $troncCommun->id, $levels['L3']->id, 'Semestre 1'],
            ['Sécurité Informatique', 'L302', $troncCommun->id, $levels['L3']->id, 'Semestre 1'],
            ['Développement d\'Applications Réparties', 'L303', $troncCommun->id, $levels['L3']->id, 'Semestre 1'],
            ['Data Mining', 'L304', $troncCommun->id, $levels['L3']->id, 'Semestre 1'],
            ['Systèmes Distribués', 'L305', $troncCommun->id, $levels['L3']->id, 'Semestre 1'],
            ['Compilation', 'L306', $troncCommun->id, $levels['L3']->id, 'Semestre 1'],
            ['Anglais 5', 'L307', $troncCommun->id, $levels['L3']->id, 'Semestre 1'],
            
            // LICENCE L3 S2
            ['Cloud Computing', 'L308', $troncCommun->id, $levels['L3']->id, 'Semestre 2'],
            ['Développement Mobile', 'L309', $troncCommun->id, $levels['L3']->id, 'Semestre 2'],
            ['Test et Validation Logicielle', 'L310', $troncCommun->id, $levels['L3']->id, 'Semestre 2'],
            ['Gestion de Projet Informatique', 'L311', $troncCommun->id, $levels['L3']->id, 'Semestre 2'],
            ['Projet de Fin d\'Études (PFE)', 'L312', $troncCommun->id, $levels['L3']->id, 'Semestre 2'],
            ['Éthique et Déontologie', 'L313', $troncCommun->id, $levels['L3']->id, 'Semestre 2'],
            ['Anglais 6', 'L314', $troncCommun->id, $levels['L3']->id, 'Semestre 2'],
        ];
        
        foreach ($modules as [$name, $code, $specialityId, $levelId, $semesterName]) {
            $semester = $semesters->where('level_id', $levelId)
                                ->where('name', $semesterName)
                                ->first();
            
            Module::create([
                'code' => $code,
                'module_name' => $name,
                'description' => "Module $name",
                'credits' => 6,
                'coefficient' => 3.0,
                'volume_cm' => 30,
                'volume_td' => 30,
                'speciality_id' => $specialityId,
                'level_id' => $levelId,
                'semester_id' => $semester?->id,
                'teacher_id' => 1,
                'objectives' => 'Objectifs du module',
                'resources' => 'Ressources du module',
                'evaluation_methods' => json_encode(['exam', 'tp']),
            ]);
        }
        
        $this->command->info(count($modules) . ' modules créés avec succès.');
    }
}
