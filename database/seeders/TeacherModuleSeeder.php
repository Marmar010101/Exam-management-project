<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeacherModuleSeeder extends Seeder
{
    public function run()
    {
        // Get first teacher user
        $user = DB::table('users')->where('role', 'teacher')->first();
        
        if ($user) {
            // Create teacher record for this user if not exists
            $teacherExists = DB::table('teachers')->where('id', $user->id)->exists();
            
            if (!$teacherExists) {
                DB::table('teachers')->insert([
                    'id' => $user->id,
                    'user_id' => $user->id,
                    'first_name' => $user->first_name ?? 'Teacher',
                    'last_name' => $user->last_name ?? 'User',
                    'grade' => 'Professor',
                    'is_responsable' => false,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                echo "✅ Created teacher record for user ID: {$user->id}\n";
            }
            
            // Assign modules to this teacher
            $modules = DB::table('modules')->take(3)->get();
            
            foreach ($modules as $module) {
                $exists = DB::table('module_teachers')
                    ->where('module_id', $module->id)
                    ->where('teacher_id', $user->id)
                    ->exists();
                
                if (!$exists) {
                    DB::table('module_teachers')->insert([
                        'module_id' => $module->id,
                        'teacher_id' => $user->id,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                    echo "✅ Assigned module '{$module->module_name}' to teacher\n";
                }
            }
            
            echo "✅ Teacher module assignments completed!\n";
        } else {
            echo "❌ No teacher user found\n";
        }
    }
}
