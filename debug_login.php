<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

try {
    echo "=== DEBUG CONNEXION ===\n\n";
    
    // Simuler la connexion avec TCH001
    $user = DB::table('users')->where('matricule', 'TCH001')->first();
    
    if ($user) {
        echo "✅ Utilisateur trouvé:\n";
        echo "   ID: {$user->id}\n";
        echo "   Matricule: {$user->matricule}\n";
        echo "   Nom: {$user->first_name} {$user->last_name}\n";
        echo "   Rôle: '{$user->role}'\n";
        echo "   Email: {$user->email}\n\n";
        
        // Vérifier le rôle exact
        echo "🔍 Vérification du rôle:\n";
        echo "   Type: " . gettype($user->role) . "\n";
        echo "   Longueur: " . strlen($user->role) . "\n";
        echo "   Valeur hex: " . bin2hex($user->role) . "\n\n";
        
        // Tester la logique de redirection
        echo "🎯 Test de redirection:\n";
        switch($user->role) {
            case 'student':
                echo "   → Redirection vers: student.dashboard\n";
                break;
            case 'teacher':
                echo "   → Redirection vers: teacher.dashboard ✅\n";
                break;
            case 'responsable':
                echo "   → Redirection vers: responsable.dashboard\n";
                break;
            case 'headdepartment':
                echo "   → Redirection vers: headdepartment.dashboard\n";
                break;
            case 'head_department':
                echo "   → Redirection vers: headdepartment.dashboard (variant)\n";
                break;
            default:
                echo "   → Redirection vers: / (défaut)\n";
                echo "   ⚠️  Rôle non reconnu: '{$user->role}'\n";
        }
        
        // Vérifier si la route existe
        echo "\n🛣️  Vérification des routes:\n";
        try {
            $route = \Illuminate\Support\Facades\Route::getRoutes()->getByName('teacher.dashboard');
            if ($route) {
                echo "   ✅ Route 'teacher.dashboard' existe\n";
                echo "   URI: " . $route->uri() . "\n";
            } else {
                echo "   ❌ Route 'teacher.dashboard' n'existe pas\n";
            }
        } catch (Exception $e) {
            echo "   ❌ Erreur de vérification des routes: " . $e->getMessage() . "\n";
        }
        
    } else {
        echo "❌ Utilisateur TCH001 non trouvé\n";
    }
    
} catch (Exception $e) {
    echo "ERREUR: " . $e->getMessage() . "\n";
}
