<?php
$file = 'database/seeders/AcademicSeeder.php';
$content = file_get_contents($file);
$count = substr_count($content, '$modules[] = [');
echo "Nombre de modules dans le seeder: $count\n";
?>
