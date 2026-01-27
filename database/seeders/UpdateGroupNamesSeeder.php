<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateGroupNamesSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer les niveaux et spécialités
        $levels = DB::table('levels')->pluck('id', 'name');
        $specialities = DB::table('specialities')->pluck('id', 'name');
        
        echo "Available levels: " . $levels->keys()->implode(', ') . PHP_EOL;
        echo "Available specialities: " . $specialities->keys()->implode(', ') . PHP_EOL;
        
        // Mapping des noms de groupes avec le format demandé
        $groupNames = [
            // Génie Logiciel
            'GL-L1-G1' => '1ère Année Ingénieur Informatique – Génie Logiciel (GL) Groupe 1',
            'GL-L1-G2' => '1ère Année Ingénieur Informatique – Génie Logiciel (GL) Groupe 2',
            'GL-L2-G1' => '2ème Année Ingénieur Informatique – Génie Logiciel (GL) Groupe 1',
            'GL-L2-G2' => '2ème Année Ingénieur Informatique – Génie Logiciel (GL) Groupe 2',
            'GL-L3-G1' => '3ème Année Ingénieur Informatique – Génie Logiciel (GL) Groupe 1',
            'GL-L3-G2' => '3ème Année Ingénieur Informatique – Génie Logiciel (GL) Groupe 2',
            
            // Intelligence Artificielle
            'IA-L1-G1' => '1ère Année Ingénieur Informatique – Intelligence Artificielle (IA) Groupe 1',
            'IA-L1-G2' => '1ère Année Ingénieur Informatique – Intelligence Artificielle (IA) Groupe 2',
            'IA-L2-G1' => '2ème Année Ingénieur Informatique – Intelligence Artificielle (IA) Groupe 1',
            'IA-L2-G2' => '2ème Année Ingénieur Informatique – Intelligence Artificielle (IA) Groupe 2',
            'IA-L3-G1' => '3ème Année Ingénieur Informatique – Intelligence Artificielle (IA) Groupe 1',
            'IA-L3-G2' => '3ème Année Ingénieur Informatique – Intelligence Artificielle (IA) Groupe 2',
            
            // Réseaux
            'RES-L1-G1' => '1ère Année Ingénieur Informatique – Réseaux (RES) Groupe 1',
            'RES-L1-G2' => '1ère Année Ingénieur Informatique – Réseaux (RES) Groupe 2',
            'RES-L2-G1' => '2ème Année Ingénieur Informatique – Réseaux (RES) Groupe 1',
            'RES-L2-G2' => '2ème Année Ingénieur Informatique – Réseaux (RES) Groupe 2',
            'RES-L3-G1' => '3ème Année Ingénieur Informatique – Réseaux (RES) Groupe 1',
            'RES-L3-G2' => '3ème Année Ingénieur Informatique – Réseaux (RES) Groupe 2',
            
            // Systèmes d'Information
            'SIC-L1-G1' => '1ère Année Ingénieur Informatique (SI) Groupe 1',
            'SIC-L1-G2' => '1ère Année Ingénieur Informatique (SI) Groupe 2',
            'SIC-L2-G1' => '2ème Année Ingénieur Informatique (SI) Groupe 1',
            'SIC-L2-G2' => '2ème Année Ingénieur Informatique (SI) Groupe 2',
            'SIC-L3-G1' => '3ème Année Ingénieur Informatique (SI) Groupe 1',
            'SIC-L3-G2' => '3ème Année Ingénieur Informatique (SI) Groupe 2',
        ];
        
        // Mettre à jour les noms des groupes
        $updatedCount = 0;
        foreach ($groupNames as $oldName => $newName) {
            $affected = DB::table('groups')
                ->where('name', $oldName)
                ->update(['name' => $newName]);
            
            if ($affected > 0) {
                echo "Group updated: '{$oldName}' -> '{$newName}'\n";
                $updatedCount++;
            } else {
                echo "Group not found: '{$oldName}'\n";
            }
        }
        
        echo "\nMise à jour terminée! {$updatedCount} groupes mis à jour.\n";
        
        // Afficher les groupes mis à jour
        $groups = DB::table('groups')->orderBy('name')->get();
        echo "\nListe des groupes actuels:\n";
        foreach ($groups as $group) {
            echo "- {$group->name}\n";
        }
    }
}
