<?php

namespace Database\Seeders;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TeacherSeeder extends Seeder
{
    public function run(): void
    {
        // Delete existing teachers and their users
        $teachers = Teacher::all();
        foreach ($teachers as $teacher) {
            User::where('id', $teacher->user_id)->delete();
        }
        Teacher::query()->delete();
        User::where('role', 'teacher')->delete();
        
        $teachers = [
            // Université des Sciences et de la Technologie d'Oran (USTO)
            [
                'matricule' => 'TCH001',
                'first_name' => 'Kamel',
                'last_name' => 'Amrani',
                'email' => 'kamel.amrani@usto.dz',
                'grade' => 'Professeur',
                'specialty' => 'Intelligence Artificielle & Apprentissage Automatique',
                'department' => 'Informatique',
                'phone' => '+213 41 28 56 01',
                'is_responsable' => 0,
            ],
            [
                'matricule' => 'TCH002',
                'first_name' => 'Samia',
                'last_name' => 'Bouzefrane',
                'email' => 'samia.bouzefrane@usto.dz',
                'grade' => 'Maître de Conférences',
                'specialty' => 'Réseaux et Sécurité Informatique',
                'department' => 'Informatique',
                'phone' => '+213 41 28 56 02',
                'is_responsable' => 0,
            ],
            [
                'matricule' => 'TCH003',
                'first_name' => 'Mohamed',
                'last_name' => 'Tahar Kimour',
                'email' => 'mohamed.kimour@usto.dz',
                'grade' => 'Professeur',
                'specialty' => 'Génie Logiciel',
                'department' => 'Informatique',
                'phone' => '+213 41 28 56 03',
                'is_responsable' => 1,
            ],
            [
                'matricule' => 'TCH004',
                'first_name' => 'Lynda',
                'last_name' => 'Hamitouche',
                'email' => 'lynda.hamitouche@usto.dz',
                'grade' => 'Maître de Conférences',
                'specialty' => 'Imagerie Médicale et Vision par Ordinateur',
                'department' => 'Informatique',
                'phone' => '+213 41 28 56 04',
                'is_responsable' => 0,
            ],
            
            // Université de Blida 1
            [
                'matricule' => 'TCH005',
                'first_name' => 'Nacer Eddine',
                'last_name' => 'Zarour',
                'email' => 'nacer.zarour@univ-blida.dz',
                'grade' => 'Professeur',
                'specialty' => 'Ingénierie des Connaissances et Systèmes d\'Information',
                'department' => 'Informatique',
                'phone' => '+213 25 43 31 01',
                'is_responsable' => 0,
            ],
            [
                'matricule' => 'TCH006',
                'first_name' => 'Patrice',
                'last_name' => 'Lorenzi',
                'email' => 'patrice.lorenzi@univ-blida.dz',
                'grade' => 'Professeur',
                'specialty' => 'Bases de Données Avancées',
                'department' => 'Informatique',
                'phone' => '+213 25 43 31 02',
                'is_responsable' => 0,
            ],
            [
                'matricule' => 'TCH007',
                'first_name' => 'Leila',
                'last_name' => 'Hamdad',
                'email' => 'leila.hamdad@univ-blida.dz',
                'grade' => 'Professeur',
                'specialty' => 'Bio-informatique',
                'department' => 'Informatique',
                'phone' => '+213 25 43 31 03',
                'is_responsable' => 0,
            ],
            [
                'matricule' => 'TCH008',
                'first_name' => 'Rafik',
                'last_name' => 'Bouguelia',
                'email' => 'rafik.bouguelia@univ-blida.dz',
                'grade' => 'Maître de Conférences',
                'specialty' => 'Science des Données',
                'department' => 'Informatique',
                'phone' => '+213 25 43 31 04',
                'is_responsable' => 0,
            ],
            
            // Université de Constantine 2
            [
                'matricule' => 'TCH009',
                'first_name' => 'Djalal',
                'last_name' => 'Hedjazi',
                'email' => 'djalal.hedjazi@univ-constantine2.dz',
                'grade' => 'Professeur',
                'specialty' => 'Réseaux de Nouvelle Génération (5G/6G, IoT)',
                'department' => 'Informatique',
                'phone' => '+213 31 66 53 01',
                'is_responsable' => 0,
            ],
            [
                'matricule' => 'TCH010',
                'first_name' => 'Hadjira',
                'last_name' => 'Belaïdi',
                'email' => 'hadjira.belaïdi@univ-constantine2.dz',
                'grade' => 'Maître de Conférences',
                'specialty' => 'Informatique Théorique, Langages Formels',
                'department' => 'Informatique',
                'phone' => '+213 31 66 53 02',
                'is_responsable' => 0,
            ],
            [
                'matricule' => 'TCH011',
                'first_name' => 'Youcef',
                'last_name' => 'Bentoutou',
                'email' => 'youcef.bentoutou@univ-constantine2.dz',
                'grade' => 'Professeur',
                'specialty' => 'Traitement du Signal et des Images',
                'department' => 'Informatique',
                'phone' => '+213 31 66 53 03',
                'is_responsable' => 0,
            ],
            
            // École Nationale Supérieure d'Informatique (ESI)
            [
                'matricule' => 'TCH012',
                'first_name' => 'Elhillali',
                'last_name' => 'Kerkouche',
                'email' => 'elhillali.kerkouche@esi.dz',
                'grade' => 'Professeur',
                'specialty' => 'Sécurité Informatique & Cryptographie',
                'department' => 'Informatique',
                'phone' => '+213 21 23 45 01',
                'is_responsable' => 0,
            ],
            [
                'matricule' => 'TCH013',
                'first_name' => 'Khadidja',
                'last_name' => 'Chaouche',
                'email' => 'khadidja.chaouche@esi.dz',
                'grade' => 'Maître de Conférences',
                'specialty' => 'Systèmes Multi-Agents et Optimisation',
                'department' => 'Informatique',
                'phone' => '+213 21 23 45 02',
                'is_responsable' => 0,
            ],
            [
                'matricule' => 'TCH014',
                'first_name' => 'Omar',
                'last_name' => 'Nouali',
                'email' => 'omar.nouali@esi.dz',
                'grade' => 'Professeur',
                'specialty' => 'Cloud Computing et Virtualisation',
                'department' => 'Informatique',
                'phone' => '+213 21 23 45 03',
                'is_responsable' => 0,
            ],
            [
                'matricule' => 'TCH015',
                'first_name' => 'Souad',
                'last_name' => 'Medjkoune',
                'email' => 'souad.medjkoune@esi.dz',
                'grade' => 'Maître de Conférences',
                'specialty' => 'Interaction Homme-Machine (IHM)',
                'department' => 'Informatique',
                'phone' => '+213 21 23 45 04',
                'is_responsable' => 0,
            ],
            
            // Université de Sidi Bel Abbès
            [
                'matricule' => 'TCH016',
                'first_name' => 'Abdelkader',
                'last_name' => 'Belkhir',
                'email' => 'abdelkader.belkhir@univ-sba.dz',
                'grade' => 'Professeur',
                'specialty' => 'Algorithmique et Optimisation Combinatoire',
                'department' => 'Informatique',
                'phone' => '+213 48 41 21 01',
                'is_responsable' => 0,
            ],
            [
                'matricule' => 'TCH017',
                'first_name' => 'Fatima',
                'last_name' => 'Benbouzid-Si Tayeb',
                'email' => 'fatima.benbouzid@univ-sba.dz',
                'grade' => 'Maître de Conférences',
                'specialty' => 'Data Mining et Big Data',
                'department' => 'Informatique',
                'phone' => '+213 48 41 21 02',
                'is_responsable' => 0,
            ],
        ];
        
        foreach ($teachers as $teacherData) {
            // Create user account first
            $user = User::create([
                'matricule' => $teacherData['matricule'],
                'password' => bcrypt('password123'),
                'role' => 'teacher',
                'email' => $teacherData['email'],
                'first_name' => $teacherData['first_name'],
                'last_name' => $teacherData['last_name'],
            ]);
            
            // Create teacher profile
            Teacher::create([
                'user_id' => $user->id,
                'first_name' => $teacherData['first_name'],
                'last_name' => $teacherData['last_name'],
                'grade' => $teacherData['grade'],
                'is_responsable' => false,
            ]);
        }
        
        $this->command->info(count($teachers) . ' enseignants créés avec succès.');
    }
}
