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
            ['module_name' => 'Algorithms', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[0]->id : null,'group_id' => '1'],
            ['module_name' => 'Data Structure', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[1]->id ?? $teachers[0]->id : null,'group_id' => '1'],
            ['module_name' => 'Database', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[2]->id ?? $teachers[0]->id : null,'group_id' => '1'],
            ['module_name' => 'Operating Systems', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[3]->id ?? $teachers[0]->id : null,'group_id' => '1'],
            ['module_name' => 'Analysis', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[0]->id : null,'group_id' => '1'],
            ['module_name' => 'algebra', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[0]->id : null,'group_id' => '1'],
            ['module_name' => 'physics', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[0]->id : null,'group_id' => '1'],

        ];

        foreach($modules as $m) {
            Module::create($m);
        }

    }
}
