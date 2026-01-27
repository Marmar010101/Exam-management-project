<?php

use App\Models\Exam;
use App\Models\User;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== VALIDATION DES EXAMENS ===\n";

// Récupérer tous les examens
$allExams = Exam::all();
echo "Total examens trouvés: " . $allExams->count() . "\n";

// Récupérer un examen de type Test TP à laisser en attente
$testTPExam = Exam::where('exam_type', 'Test TP')->first();
$examToKeepPending = null;

if ($testTPExam) {
    $examToKeepPending = $testTPExam;
    echo "Examen Test TP à laisser en attente: ID {$testTPExam->id} - {$testTPExam->exam_type}\n";
} else {
    // Si pas de Test TP, prendre le premier examen
    $examToKeepPending = $allExams->first();
    echo "Pas de Test TP trouvé, premier examen laissé en attente: ID {$examToKeepPending->id}\n";
}

// Récupérer le Head Department user
$headDepartment = User::where('role', 'headdepartment')->first();
if (!$headDepartment) {
    echo "ERREUR: Aucun utilisateur Head Department trouvé!\n";
    exit(1);
}

echo "Head Department: {$headDepartment->first_name} {$headDepartment->last_name}\n";

// Compteurs
$validatedCount = 0;
$rejectedCount = 0;
$pendingCount = 0;

foreach ($allExams as $exam) {
    if ($exam->id === $examToKeepPending->id) {
        // Laisser cet examen en attente
        $exam->update([
            'status' => 'pending',
            'validated_by' => null,
            'validated_at' => null,
            'validation_notes' => null
        ]);
        $pendingCount++;
        echo "⏳ Examen {$exam->id} laissé en attente ({$exam->exam_type})\n";
    } else {
        // Valider l'examen
        $exam->update([
            'status' => 'accepted',
            'validated_by' => $headDepartment->id,
            'validated_at' => now(),
            'validation_notes' => 'Validé automatiquement par le système'
        ]);
        $validatedCount++;
        echo "✅ Examen {$exam->id} validé ({$exam->exam_type})\n";
        
        // Créer une notification pour le responsable
        $notification = new \App\Models\Notification();
        $notification->user_id = User::where('role', 'responsable')->first()->id ?? 1;
        $notification->title = 'Examen Validé';
        $notification->message = "L'examen '{$exam->exam_type}' du module '{$exam->module->module_name}' a été validé par le Head Department.";
        $notification->type = 'exam_validated';
        $notification->data = json_encode([
            'exam_id' => $exam->id,
            'validated_by' => $headDepartment->id,
            'validated_at' => now()
        ]);
        $notification->read = false;
        $notification->save();
        
        echo "📧 Notification envoyée au responsable\n";
    }
}

echo "\n=== RÉCAPITULATIF ===\n";
echo "✅ Examens validés: {$validatedCount}\n";
echo "⏳ Examens en attente: {$pendingCount}\n";
echo "❌ Examens rejetés: {$rejectedCount}\n";
echo "📧 Notifications envoyées: {$validatedCount}\n";

echo "\nTerminé!\n";
