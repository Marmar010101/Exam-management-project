<?php

namespace Database\Seeders;
use App\Models\Teacher;
use App\Models\Module;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       $teachers = Teacher::all();
        $modules = [
            ['module_name' => 'Algorithmique', 'code' => 'ALG101', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[0]->id : null],
            ['module_name' => 'Data Structure', 'code' => 'DS102', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[1]->id ?? $teachers[0]->id : null],
            ['module_name' => 'Base de Données', 'code' => 'BD103', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[2]->id ?? $teachers[0]->id : null],
            ['module_name' => 'Systèmes d\'Exploitation', 'code' => 'SE104', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[3]->id ?? $teachers[0]->id : null],
        ];

        foreach($modules as $m) {
            Module::create($m);
        }

    }
}
