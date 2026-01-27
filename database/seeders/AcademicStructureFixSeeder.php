<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Speciality;
use App\Models\Level;
use App\Models\Semester;
use Illuminate\Database\Seeder;

class AcademicStructureFixSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer les spécialités et niveaux existants
        $troncCommun = Speciality::where('name', 'Tronc Commun')->first();
        $ia = Speciality::where('name', 'Intelligence Artificielle')->first();
        $gl = Speciality::where('name', 'Génie Logiciel')->first();
        $res = Speciality::where('name', 'Réseaux')->first();
        $sic = Speciality::where('name', 'Systèmes d\'Information et Communication')->first();
        
        $levels = Level::all()->keyBy('name');
        
        // Mettre à jour les modules existants avec les bons level_id et speciality_id
        $this->updateIngenieurModules($troncCommun, $ia, $gl, $res, $sic, $levels);
        $this->updateLMDModules($troncCommun, $ia, $gl, $res, $sic, $levels);
        
        $this->command->info('Structure académique mise à jour avec succès');
    }
    
    private function updateIngenieurModules($troncCommun, $ia, $gl, $res, $sic, $levels)
    {
        // SYSTÈME INGÉNIEUR - TRONC COMMUN
        
        // 1ère année - S1
        $this->updateModule('Mathématiques 1', $troncCommun->id, $levels['ing1']->id);
        $this->updateModule('Algorithmique 1', $troncCommun->id, $levels['ing1']->id);
        $this->updateModule('Architecture des Ordinateurs 1', $troncCommun->id, $levels['ing1']->id);
        $this->updateModule('Électronique Numérique', $troncCommun->id, $levels['ing1']->id);
        $this->updateModule('Initiation à la Programmation (C)', $troncCommun->id, $levels['ing1']->id);
        $this->updateModule('Anglais 1', $troncCommun->id, $levels['ing1']->id);
        $this->updateModule('Méthodologie', $troncCommun->id, $levels['ing1']->id);
        
        // 1ère année - S2
        $this->updateModule('Mathématiques 2', $troncCommun->id, $levels['ing1']->id);
        $this->updateModule('Algorithmique 2', $troncCommun->id, $levels['ing1']->id);
        $this->updateModule('Architecture des Ordinateurs 2', $troncCommun->id, $levels['ing1']->id);
        $this->updateModule('Systèmes d\'Exploitation 1', $troncCommun->id, $levels['ing1']->id);
        $this->updateModule('Programmation Orientée Objet (Java)', $troncCommun->id, $levels['ing1']->id);
        $this->updateModule('Anglais 2', $troncCommun->id, $levels['ing1']->id);
        $this->updateModule('Physique', $troncCommun->id, $levels['ing1']->id);
        
        // 2ème année - S1
        $this->updateModule('Structures de Données', $troncCommun->id, $levels['ing2']->id);
        $this->updateModule('Bases de Données 1', $troncCommun->id, $levels['ing2']->id);
        $this->updateModule('Réseaux 1', $troncCommun->id, $levels['ing2']->id);
        $this->updateModule('Génie Logiciel 1', $troncCommun->id, $levels['ing2']->id);
        $this->updateModule('Probabilités/Statistiques', $troncCommun->id, $levels['ing2']->id);
        $this->updateModule('Programmation Web 1 (HTML/CSS)', $troncCommun->id, $levels['ing2']->id);
        $this->updateModule('Anglais 3', $troncCommun->id, $levels['ing2']->id);
        
        // 2ème année - S2
        $this->updateModule('Graphes et Optimisation', $troncCommun->id, $levels['ing2']->id);
        $this->updateModule('Bases de Données 2', $troncCommun->id, $levels['ing2']->id);
        $this->updateModule('Réseaux 2', $troncCommun->id, $levels['ing2']->id);
        $this->updateModule('Génie Logiciel 2', $troncCommun->id, $levels['ing2']->id);
        $this->updateModule('Systèmes d\'Exploitation 2', $troncCommun->id, $levels['ing2']->id);
        $this->updateModule('Programmation Web 2 (PHP/JS)', $troncCommun->id, $levels['ing2']->id);
        $this->updateModule('Anglais 4', $troncCommun->id, $levels['ing2']->id);
        
        // SPÉCIALITÉS - 3ème année
        $this->updateModule('Introduction à l\'IA', $ia->id, $levels['ing3']->id);
        $this->updateModule('Apprentissage Automatique 1', $ia->id, $levels['ing3']->id);
        $this->updateModule('Conception Avancée des Logiciels', $gl->id, $levels['ing3']->id);
        $this->updateModule('Réseaux Avancés (TCP/IP Avancé)', $res->id, $levels['ing3']->id);
        $this->updateModule('Management des SI', $sic->id, $levels['ing3']->id);
        
        // SPÉCIALITÉS - 4ème année
        $this->updateModule('Deep Learning', $ia->id, $levels['ing4']->id);
        $this->updateModule('Ingénierie des Exigences', $gl->id, $levels['ing4']->id);
        $this->updateModule('Réseaux d\'Opérateurs', $res->id, $levels['ing4']->id);
        $this->updateModule('Audit des SI', $sic->id, $levels['ing4']->id);
        
        // SPÉCIALITÉS - 5ème année (Stage PFE)
        $this->updateModule('Stage PFE Ingénieur', $ia->id, $levels['ing5']->id);
        $this->updateModule('Stage PFE Ingénieur', $gl->id, $levels['ing5']->id);
        $this->updateModule('Stage PFE Ingénieur', $res->id, $levels['ing5']->id);
        $this->updateModule('Stage PFE Ingénieur', $sic->id, $levels['ing5']->id);
    }
    
    private function updateLMDModules($troncCommun, $ia, $gl, $res, $sic, $levels)
    {
        // SYSTÈME LMD - LICENCE (Tronc Commun)
        
        // L1 - S1
        $this->updateModule('Algorithmique 1', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Mathématiques 1', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Architecture des Ordinateurs 1', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Systèmes d\'Exploitation 1', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Initiation aux Réseaux', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Langage C', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Logique', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Anglais 1', $troncCommun->id, $levels['L1']->id);
        
        // L1 - S2
        $this->updateModule('Algorithmique 2', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Mathématiques 2', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Programmation Orientée Objet (Java)', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Bases de Données 1', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Électronique Numérique', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Méthodologie', $troncCommun->id, $levels['L1']->id);
        $this->updateModule('Anglais 2', $troncCommun->id, $levels['L1']->id);
        
        // L2
        $this->updateModule('Structures de Données', $troncCommun->id, $levels['L2']->id);
        $this->updateModule('Graphes et Combinatoire', $troncCommun->id, $levels['L2']->id);
        $this->updateModule('Systèmes Logiques', $troncCommun->id, $levels['L2']->id);
        $this->updateModule('Conception Objet (UML)', $troncCommun->id, $levels['L2']->id);
        $this->updateModule('Bases de Données 2', $troncCommun->id, $levels['L2']->id);
        $this->updateModule('Web 1 (HTML/CSS/JS)', $troncCommun->id, $levels['L2']->id);
        $this->updateModule('Anglais 3', $troncCommun->id, $levels['L2']->id);
        
        // L3
        $this->updateModule('Intelligence Artificielle', $troncCommun->id, $levels['L3']->id);
        $this->updateModule('Sécurité Informatique', $troncCommun->id, $levels['L3']->id);
        $this->updateModule('Développement d\'Applications Réparties', $troncCommun->id, $levels['L3']->id);
        $this->updateModule('Data Mining', $troncCommun->id, $levels['L3']->id);
        $this->updateModule('Systèmes Distribués', $troncCommun->id, $levels['L3']->id);
        $this->updateModule('Compilation', $troncCommun->id, $levels['L3']->id);
        $this->updateModule('Anglais 5', $troncCommun->id, $levels['L3']->id);
        
        // MASTER - Spécialités
        $this->updateModule('Machine Learning', $ia->id, $levels['M1']->id);
        $this->updateModule('Architecture Logicielle Avancée', $gl->id, $levels['M1']->id);
        $this->updateModule('Réseaux Haut Débit et 5G', $res->id, $levels['M1']->id);
        $this->updateModule('Management Stratégique des SI', $sic->id, $levels['M1']->id);
        
        $this->updateModule('Deep Learning Avancé', $ia->id, $levels['M2']->id);
        $this->updateModule('Ingénierie des Exigences', $gl->id, $levels['M2']->id);
        $this->updateModule('Sécurité des Réseaux Avancée', $res->id, $levels['M2']->id);
        $this->updateModule('Transformation Digitale', $sic->id, $levels['M2']->id);
    }
    
    private function updateModule($moduleName, $specialityId, $levelId)
    {
        $module = Module::where('module_name', $moduleName)->first();
        if ($module) {
            $module->update([
                'speciality_id' => $specialityId,
                'level_id' => $levelId
            ]);
        }
    }
}
