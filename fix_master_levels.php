<?php

use App\Models\Module;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== CORRECTION DES LEVEL_ID POUR MASTER ===\n";

// Mapping correct des level_id pour Master
$masterLevelMapping = [
    // M1 = level_id 24
    // M2 = level_id 25
    // Les modules actuels ont level_id 26, 27, 28 (ingénieur)
    // On va les corriger pour qu'ils correspondent aux groupes Master
];

// Récupérer tous les modules des semestres 41 et 42 (qui devraient être Master)
$masterModules = Module::whereIn('semester_id', [41, 42])->get();

echo "Modules Master à corriger: " . $masterModules->count() . "\n";

foreach ($masterModules as $module) {
    // Déterminer le bon level_id selon la spécialité
    $newLevelId = 25; // Par défaut M2
    
    // Si c'est un module de base, on peut le mettre en M1
    if (in_array($module->speciality_id, [7, 6, 8, 9])) { // GL, IA, RSD, SIC
        // Pour l'instant, on met tout en M2 (25)
        $newLevelId = 25;
    }
    
    $oldLevelId = $module->level_id;
    $module->level_id = $newLevelId;
    $module->save();
    
    echo "Module {$module->module_name}: level_id {$oldLevelId} → {$newLevelId}\n";
}

echo "\nTerminé!\n";
