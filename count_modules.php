<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

use App\Models\Module;

$count = Module::count();
echo "Nombre total de modules: $count\n";

$modules = Module::take(10)->get(['module_name', 'code']);
echo "Liste des modules:\n";
foreach ($modules as $module) {
    echo "- {$module->module_name} ({$module->code})\n";
}
?>
