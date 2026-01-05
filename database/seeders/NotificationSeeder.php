<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        // Create simple notifications for demo
        $users = User::all();
        
        foreach ($users as $user) {
            // Simple notification creation
            \DB::table('notifications')->insert([
                'user_id' => $user->id,
                'title' => 'Welcome to Exam Management System',
                'message' => 'Your account has been successfully created.',
                'type' => 'welcome',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Notifications seeded successfully!');
    }
}
