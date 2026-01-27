<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== DEBUG MODULES AND GROUPS ===\n";

// Check groups structure
echo "\nGroups (first 3):\n";
$groups = App\Models\Group::with(['level', 'speciality'])->take(3)->get();
foreach ($groups as $group) {
    echo "Group ID: {$group->id}, Name: {$group->name}\n";
    echo "  Level ID: {$group->level_id}, Level Name: " . ($group->level ? $group->level->name : 'NULL') . "\n";
    echo "  Speciality ID: {$group->speciality_id}, Speciality Name: " . ($group->speciality ? $group->speciality->name : 'NULL') . "\n";
    echo "\n";
}

// Check modules structure
echo "\nModules (first 3):\n";
$modules = App\Models\Module::with(['semester'])->take(3)->get();
foreach ($modules as $module) {
    echo "Module ID: {$module->id}, Name: {$module->module_name}, Code: {$module->code}\n";
    echo "  Level ID: {$module->level_id}, Speciality ID: {$module->speciality_id}\n";
    echo "  Semester ID: {$module->semester_id}, Semester: " . ($module->semester ? $module->semester->name : 'NULL') . "\n";
    echo "  Has TD: " . ($module->has_td ? 'Yes' : 'No') . ", Has TP: " . ($module->has_tp ? 'Yes' : 'No') . "\n";
    echo "\n";
}

// Check semester mapping
echo "\nSemesters:\n";
$semesters = App\Models\Semester::whereIn('id', [37, 38])->get();
foreach ($semesters as $semester) {
    echo "Semester ID: {$semester->id}, Name: {$semester->name}\n";
}

echo "\nTotal counts:\n";
echo "Groups: " . App\Models\Group::count() . "\n";
echo "Modules: " . App\Models\Module::count() . "\n";
echo "Semesters: " . App\Models\Semester::count() . "\n";
