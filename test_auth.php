<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

try {
    echo "=== TEST D'AUTHENTIFICATION ===\n\n";
    
    // Test 1: Vérifier si on peut récupérer un utilisateur
    $user = DB::table('users')->where('matricule', 'TCH001')->first();
    
    if ($user) {
        echo "✅ Utilisateur trouvé: {$user->matricule}\n";
        echo "   Nom: {$user->first_name} {$user->last_name}\n";
        echo "   Rôle: {$user->role}\n";
        
        // Test 2: Vérifier le mot de passe hashé
        echo "   Hash du mot de passe: " . substr($user->password, 0, 20) . "...\n";
        
        // Test 3: Vérifier si le mot de passe "password123" correspond
        if (password_verify('password123', $user->password)) {
            echo "   ✅ Le mot de passe 'password123' est CORRECT\n";
        } else {
            echo "   ❌ Le mot de passe 'password123' est INCORRECT\n";
        }
        
        // Test 4: Essayer de créer une instance du modèle User
        $userModel = \App\Models\User::find($user->id);
        if ($userModel) {
            echo "   ✅ Modèle User créé avec succès\n";
            echo "   ID: {$userModel->id}\n";
            echo "   Matricule: {$userModel->matricule}\n";
        } else {
            echo "   ❌ Échec de création du modèle User\n";
        }
        
    } else {
        echo "❌ Aucun utilisateur trouvé avec matricule 'TCH001'\n";
    }
    
    echo "\n=== TESTS DE CONNEXION ===\n";
    
    // Test 5: Vérifier les identifiants de test
    $testCredentials = [
        'matricule' => 'TCH001',
        'password' => 'password123'
    ];
    
    echo "Identifiants de test:\n";
    echo "Matricule: {$testCredentials['matricule']}\n";
    echo "Mot de passe: {$testCredentials['password']}\n";
    
} catch (Exception $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
