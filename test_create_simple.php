<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Testing Simple Exam Creation ===\n";

try {
    // Test with real data
    $group = \App\Models\Group::first();
    $module = \App\Models\Module::first();
    
    echo "Group ID: " . ($group ? $group->id : 'None') . "\n";
    echo "Module ID: " . ($module ? $module->id : 'None') . "\n";
    
    if (!$group || !$module) {
        echo "No groups or modules found in database!\n";
        exit;
    }
    
    // Create a simple exam plan
    $startTime = \Carbon\Carbon::createFromFormat('H:i', '09:00');
    $endTime = \Carbon\Carbon::createFromFormat('H:i', '11:00');
    $durationMinutes = $startTime->diffInMinutes($endTime);
    
    $examPlan = [
        'group_id' => $group->id,
        'module_id' => $module->id,
        'teacher_id' => null,
        'room_id' => null,
        'exam_type' => 'Exam',
        'exam_subtype' => 'Test',
        'exam_date' => '2026-01-26',
        'start_date' => '2026-01-26',
        'end_date' => '2026-01-26',
        'start_time' => '09:00',
        'end_time' => '11:00',
        'duration_minutes' => $durationMinutes, // Ajouter la durée
        'description' => 'Test exam plan',
        'status' => 'pending',
        'created_by' => 1, // Assuming user ID 1 exists
        'created_at' => now(),
        'updated_at' => now(),
    ];
    
    echo "Creating exam plan with data:\n";
    print_r($examPlan);
    
    \App\Models\ExamPlan::insert([$examPlan]);
    
    echo "SUCCESS: Exam plan created!\n";
    
    // Check if it was created
    $count = \App\Models\ExamPlan::count();
    echo "Total exam plans in database: " . $count . "\n";
    
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}

echo "\n=== Done ===\n";
