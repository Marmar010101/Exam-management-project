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
            ['module_name' => 'Algorithms', 'code' => 'ALG001', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[0]->id : null],
            ['module_name' => 'Data Structure', 'code' => 'DS002', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[1]->id ?? $teachers[0]->id : null],
            ['module_name' => 'Database', 'code' => 'DB003', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[2]->id ?? $teachers[0]->id : null],
            ['module_name' => 'Operating Systems', 'code' => 'OS004', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[3]->id ?? $teachers[0]->id : null],
            ['module_name' => 'Analysis', 'code' => 'ANL005', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[0]->id : null],
            ['module_name' => 'algebra', 'code' => 'ALG006', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[0]->id : null],
            ['module_name' => 'physics', 'code' => 'PHY007', 'teacher_id' => $teachers->isNotEmpty() ? $teachers[0]->id : null],

        ];

        foreach($modules as $m) {
            Module::create($m);
        }

    }
}
