<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Checking Laravel Logs ===\n";

$logFile = storage_path('logs/laravel.log');

if (file_exists($logFile)) {
    $content = file_get_contents($logFile);
    $lines = explode("\n", $content);
    
    echo "Last 20 lines from laravel.log:\n";
    $lastLines = array_slice($lines, -20);
    
    foreach ($lastLines as $line) {
        if (!empty(trim($line))) {
            echo "  " . $line . "\n";
        }
    }
} else {
    echo "No laravel.log file found.\n";
}

echo "\n=== Done ===\n";
