<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Room;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        
        $this->call([
            CycleSeeder::class,
            LevelSeeder::class,
            SemesterSeeder::class,
            SpecialitySeeder::class,
            GroupSeeder::class,
            TeacherSeeder::class,
            ModuleSeeder::class,
            StudentSeeder::class,
            HeadDepartmentSeeder::class,
            RoomSeeder::class,
            ResponsableSeeder::class,
            ExamSeeder::class,
            InvigilationScheduleSeeder::class,
            TeacherModuleSeeder::class,
            TeacherExamSeeder::class,
        ]);
    }
}
