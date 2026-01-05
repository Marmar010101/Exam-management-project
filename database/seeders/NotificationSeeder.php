<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        // Créer des notifications pour différents utilisateurs
        $users = User::all();
        
        foreach ($users as $user) {
            // Notifications pour les étudiants
            if ($user->role === 'student') {
                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Exam Reminder',
                    'message' => 'You have an upcoming exam tomorrow. Please review your materials.',
                    'type' => 'exam_reminder',
                    'is_read' => false,
                    'created_at' => now()->subDays(1),
                ]);
                
                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Grade Available',
                    'message' => 'Your grade for the Algorithms exam is now available.',
                    'type' => 'grade',
                    'is_read' => true,
                    'created_at' => now()->subDays(3),
                ]);
            }
            
            // Notifications pour les enseignants
            if ($user->role === 'teacher') {
                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'New Exam Assignment',
                    'message' => 'You have been assigned to supervise the Database exam.',
                    'type' => 'exam_assignment',
                    'is_read' => false,
                    'created_at' => now()->subHours(6),
                ]);
                
                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Room Change',
                    'message' => 'The room for your Data Structure exam has been changed to S202.',
                    'type' => 'room_change',
                    'is_read' => true,
                    'created_at' => now()->subDays(2),
                ]);
            }
            
            // Notifications pour les responsables
            if ($user->role === 'responsable') {
                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Pending Requests',
                    'message' => 'You have 3 pending teacher requests awaiting approval.',
                    'type' => 'teacher_request',
                    'is_read' => false,
                    'created_at' => now()->subHours(2),
                ]);
                
                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Schedule Conflict',
                    'message' => 'There is a scheduling conflict in the L1 S1 G1 group.',
                    'type' => 'conflict',
                    'is_read' => false,
                    'created_at' => now()->subHours(12),
                ]);
            }
            
            // Notifications pour le head department
            if ($user->role === 'headdepartment') {
                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'System Update',
                    'message' => 'The examination system has been successfully updated.',
                    'type' => 'system',
                    'is_read' => true,
                    'created_at' => now()->subDays(5),
                ]);
                
                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Monthly Report',
                    'message' => 'The monthly examination report is ready for review.',
                    'type' => 'report',
                    'is_read' => false,
                    'created_at' => now()->subHours(24),
                ]);
            }
        }
    }
}
