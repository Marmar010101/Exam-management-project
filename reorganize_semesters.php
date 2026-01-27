<?php

use App\Models\Module;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== RÉORGANISATION DES SEMESTRES ===\n";

// Récupérer tous les modules
$modules = Module::all();
echo "Total modules à réorganiser: " . $modules->count() . "\n";

// Distribution des semestres
$semesterDistribution = [
    37 => 10, // Semestre 1 - 10 modules
    38 => 10, // Semestre 2 - 10 modules  
    39 => 10, // Semestre 1 - 10 modules
    40 => 10, // Semestre 2 - 10 modules
    41 => 22, // Semestre 1 - 22 modules (au lieu de 44)
    42 => 22, // Semestre 2 - 22 modules (nouveau)
];

$semesterIndex = 0;
$semesterIds = array_keys($semesterDistribution);
$currentSemesterId = $semesterIds[$semesterIndex];
$currentSemesterCount = 0;
$maxForCurrentSemester = $semesterDistribution[$currentSemesterId];

$updatedCount = 0;

foreach ($modules as $module) {
    // Si on a atteint la limite pour le semestre actuel, passer au suivant
    if ($currentSemesterCount >= $maxForCurrentSemester) {
        $semesterIndex++;
        if ($semesterIndex >= count($semesterIds)) {
            $semesterIndex = 0; // Recommencer au début si nécessaire
        }
        $currentSemesterId = $semesterIds[$semesterIndex];
        $currentSemesterCount = 0;
        $maxForCurrentSemester = $semesterDistribution[$currentSemesterId];
    }
    
    // Mettre à jour le semestre du module
    $oldSemesterId = $module->semester_id;
    $module->semester_id = $currentSemesterId;
    $module->save();
    
    echo "Module {$module->module_name}: {$oldSemesterId} → {$currentSemesterId}\n";
    
    $currentSemesterCount++;
    $updatedCount++;
}

echo "\n=== RÉCAPITULATIF ===\n";
echo "Modules mis à jour: {$updatedCount}\n";

// Vérifier la distribution finale
echo "\nDistribution finale:\n";
$finalDistribution = Module::selectRaw('semester_id, COUNT(*) as count')
    ->groupBy('semester_id')
    ->orderBy('semester_id')
    ->get();

foreach ($finalDistribution as $dist) {
    echo "Semestre {$dist->semester_id}: {$dist->count} modules\n";
}

echo "\nTerminé!\n";
