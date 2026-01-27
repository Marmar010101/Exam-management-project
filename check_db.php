<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Checking Exam Plans in Database ===\n";

$count = DB::table('exam_plans')->count();
echo "Total exam plans in database: $count\n";

if ($count > 0) {
    $sample = DB::table('exam_plans')->first();
    echo "\nFirst exam plan:\n";
    foreach ($sample as $key => $value) {
        echo "  $key: " . ($value ?? 'NULL') . "\n";
    }
    
    echo "\nLast 5 exam plans:\n";
    $recent = DB::table('exam_plans')->orderBy('created_at', 'desc')->limit(5)->get();
    foreach ($recent as $plan) {
        echo "  ID: {$plan->id}, Status: {$plan->status}, Created: {$plan->created_at}\n";
    }
} else {
    echo "No exam plans found in database.\n";
}

echo "\n=== Done ===\n";
