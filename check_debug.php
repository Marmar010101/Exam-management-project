<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Checking Debug Log ===\n";

$debugFile = storage_path('debug.log');

if (file_exists($debugFile)) {
    $content = file_get_contents($debugFile);
    echo "Debug log content:\n";
    echo $content;
} else {
    echo "No debug.log file found.\n";
}

echo "\n=== Done ===\n";
