<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(): void
    {
        // IMPORTANT: Appeler TOUS vos seeders ici dans le bon ordre
        $this->call([
            PrerequisitesSeeder::class,      // 0. Prérequis (niveaux et spécialités)
            CycleSeeder::class,              // 1. Cycles (obligatoire pour les niveaux)
            LevelSeeder::class,              // 2. Niveaux (obligatoire pour les semestres)
            SemesterSeeder::class,           // 3. Semestres (dépend des niveaux)
            SystemSeeder::class,             // 4. Systèmes (Ingénieur/LMD)
            SpecialtySeeder::class,         // 5. Spécialités
            HeaddepartmentSeeder::class,     // 6. Head Departments
            ResponsableSeeder::class,        // 7. Responsables
            TeacherSeeder::class,            // 8. Enseignants
            StudentSeeder::class,            // 9. Étudiants
            GroupSeeder::class,             // 10. Groupes
            ModuleSeeder::class,            // 11. Modules (dépend des niveaux/semestres)
            PrerequisiteSeeder::class,      // 12. Prérequis
            RoomSeeder::class,             // 13. Salles
            ExamSeeder::class,              // 14. Examens
            CompleteAcademicSeeder::class,  // 15. Structure académique complète
        ]);
    }
}
