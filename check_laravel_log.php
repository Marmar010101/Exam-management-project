<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Checking Laravel Log ===\n";

$logFile = storage_path('logs/laravel.log');

if (file_exists($logFile)) {
    // Get last 50 lines
    $lines = file($logFile);
    $lastLines = array_slice($lines, -50);
    
    echo "Last 50 lines of laravel.log:\n";
    echo "===============================\n";
    foreach ($lastLines as $line) {
        echo $line;
    }
} else {
    echo "No laravel.log file found.\n";
}

echo "\n=== Done ===\n";
