<?php

use App\Models\Exam;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== CORRECTION DES SEMESTER_ID DANS LES EXAMENS ===\n";

// Récupérer tous les examens avec leurs modules
$exams = Exam::with('module')->get();
echo "Total exams to update: " . $exams->count() . "\n";

$updatedCount = 0;

foreach ($exams as $exam) {
    if ($exam->module) {
        $oldSemesterId = $exam->semester_id;
        $newSemesterId = $exam->module->semester_id;
        
        $exam->semester_id = $newSemesterId;
        $exam->save();
        
        echo "Exam {$exam->id} ({$exam->module->module_name}): {$oldSemesterId} → {$newSemesterId}\n";
        $updatedCount++;
    } else {
        echo "Exam {$exam->id}: No module found\n";
    }
}

echo "\n=== RÉCAPITULATIF ===\n";
echo "Exams updated: {$updatedCount}\n";

// Vérifier la distribution finale
echo "\nDistribution finale des examens par semestre:\n";
$finalDistribution = Exam::selectRaw('semester_id, COUNT(*) as count')
    ->groupBy('semester_id')
    ->orderBy('semester_id')
    ->get();

foreach ($finalDistribution as $dist) {
    echo "Semestre {$dist->semester_id}: {$dist->count} examens\n";
}

echo "\nTerminé!\n";
