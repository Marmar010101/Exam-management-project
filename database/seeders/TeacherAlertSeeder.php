<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TeacherAlertSeeder extends Seeder
{
    public function run()
    {
        // Créer des alertes pour les enseignants
        $alerts = [
            [
                'title' => 'Changement d\'horaire examen',
                'message' => 'L\'examen d\'Algorithmique prévu demain à 10h est reporté à 14h en salle A101.',
                'type' => 'warning',
                'priority' => 'high',
                'sender' => 'Administration',
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Nouveau matériel disponible',
                'message' => 'Les nouveaux projecteurs sont disponibles dans les salles B201 et B202 pour vos prochains cours.',
                'type' => 'info',
                'priority' => 'normal',
                'sender' => 'Service Technique',
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'title' => 'Maintenance système',
                'message' => 'Le système de gestion des examens sera en maintenance ce week-end du samedi 8h au dimanche 20h.',
                'type' => 'urgent',
                'priority' => 'high',
                'sender' => 'Support Technique',
                'created_at' => Carbon::now()->subHours(6),
                'updated_at' => Carbon::now()->subHours(6),
            ],
            [
                'title' => 'Réunion départementale',
                'message' => 'Une réunion est prévue ce jeudi à 15h en salle C301 pour discuter des nouveaux programmes.',
                'type' => 'info',
                'priority' => 'normal',
                'sender' => 'Head Department',
                'created_at' => Carbon::now()->subHours(12),
                'updated_at' => Carbon::now()->subHours(12),
            ],
            [
                'title' => 'Fermeture salles',
                'message' => 'Les salles du bloc A seront fermées pour travaux pendant les vacances de Noël.',
                'type' => 'warning',
                'priority' => 'low',
                'sender' => 'Administration',
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
        ];

        DB::table('teacher_alerts')->insert($alerts);
    }
}
