<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

try {
    $users = DB::table('users')->get(['id', 'matricule', 'first_name', 'last_name', 'email', 'role']);
    
    echo "=== UTILISATEURS DANS LA BASE DE DONNÉES ===\n\n";
    
    if ($users->isEmpty()) {
        echo "AUCUN UTILISATEUR TROUVÉ\n";
    } else {
        foreach ($users as $user) {
            echo "ID: {$user->id}\n";
            echo "Matricule: {$user->matricule}\n";
            echo "Nom: {$user->first_name} {$user->last_name}\n";
            echo "Email: {$user->email}\n";
            echo "Rôle: {$user->role}\n";
            echo "------------------------\n";
        }
    }
    
    echo "\nTotal: " . $users->count() . " utilisateurs\n";
    
} catch (Exception $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
}
