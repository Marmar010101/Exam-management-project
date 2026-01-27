<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Checking Exam Store Log ===\n";

$logFile = storage_path('exam_store.log');

if (file_exists($logFile)) {
    $content = file_get_contents($logFile);
    echo "Log content:\n";
    echo $content;
} else {
    echo "No exam_store.log file found.\n";
}

echo "\n=== Done ===\n";
