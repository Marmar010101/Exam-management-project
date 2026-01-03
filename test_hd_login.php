<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

try {
    echo "=== TEST CONNEXION HEAD DEPARTMENT ===\n\n";
    
    // Test avec HD001
    $user = DB::table('users')->where('matricule', 'HD001')->first();
    
    if ($user) {
        echo "✅ Utilisateur Head Department trouvé:\n";
        echo "   ID: {$user->id}\n";
        echo "   Matricule: {$user->matricule}\n";
        echo "   Nom: {$user->first_name} {$user->last_name}\n";
        echo "   Rôle: '{$user->role}'\n";
        echo "   Email: {$user->email}\n\n";
        
        // Test du mot de passe
        if (password_verify('password123', $user->password)) {
            echo "✅ Mot de passe correct\n\n";
        } else {
            echo "❌ Mot de passe incorrect\n\n";
        }
        
        // Test de la logique de redirection
        echo "🎯 Test de redirection pour rôle '{$user->role}':\n";
        switch($user->role) {
            case 'student':
                echo "   → student.dashboard\n";
                break;
            case 'teacher':
                echo "   → teacher.dashboard\n";
                break;
            case 'responsable':
                echo "   → responsable.dashboard\n";
                break;
            case 'headdepartment':
            case 'head_department':
                echo "   → headdepartment.dashboard ✅\n";
                break;
            default:
                echo "   → / (par défaut)\n";
        }
        
        // Vérifier si la route headdepartment.dashboard existe
        echo "\n🛣️  Vérification route headdepartment.dashboard:\n";
        try {
            $route = \Illuminate\Support\Facades\Route::getRoutes()->getByName('headdepartment.dashboard');
            if ($route) {
                echo "   ✅ Route existe: " . $route->uri() . "\n";
            } else {
                echo "   ❌ Route n'existe pas\n";
            }
        } catch (Exception $e) {
            echo "   ❌ Erreur: " . $e->getMessage() . "\n";
        }
        
    } else {
        echo "❌ Utilisateur HD001 non trouvé\n";
    }
    
} catch (Exception $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
}
