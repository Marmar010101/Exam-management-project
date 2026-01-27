<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Checking Exam Plans Table Structure ===\n";

try {
    $columns = \Illuminate\Support\Facades\Schema::getColumnListing('exam_plans');
    
    echo "Columns in exam_plans table:\n";
    foreach ($columns as $column) {
        echo "- " . $column . "\n";
    }
    
    // Check if duration_minutes exists and if it's nullable
    $columnInfo = \Illuminate\Support\Facades\DB::select("
        SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT, DATA_TYPE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'exam_plans' 
        AND COLUMN_NAME = 'duration_minutes'
    ");
    
    if (!empty($columnInfo)) {
        echo "\nDuration minutes column info:\n";
        print_r($columnInfo[0]);
    }
    
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== Done ===\n";
