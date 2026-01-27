<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Teacher;
use App\Models\Speciality;
use App\Models\Level;
use App\Models\Semester;
use Illuminate\Database\Seeder;

class AcademicSeeder extends Seeder
{
    public function run(): void
    {
        Module::query()->delete();
        
        // Récupérer les IDs corrects
        $troncCommunSpeciality = Speciality::where('name', 'Tronc Commun')->first();
        $iaSpeciality = Speciality::where('name', 'Intelligence Artificielle')->first();
        $glSpeciality = Speciality::where('name', 'Génie Logiciel')->first();
        $resSpeciality = Speciality::where('name', 'Réseaux')->first();
        $sicSpeciality = Speciality::where('name', 'Systèmes d\'Information et Communication')->first();
        
        $teachers = Teacher::all();
        $defaultTeacher = $teachers->first();
        
        // Récupérer tous les levels et semestres
        $levels = Level::all();
        $semesters = Semester::all();
        
        // Créer un mapping pour les levels
        $levelMap = [
            'ing1' => $levels->where('name', 'ing1')->first()?->id,
            'ing2' => $levels->where('name', 'ing2')->first()?->id,
            'ing3' => $levels->where('name', 'ing3')->first()?->id,
            'ing4' => $levels->where('name', 'ing4')->first()?->id,
            'ing5' => $levels->where('name', 'ing5')->first()?->id,
            'l1' => $levels->where('name', 'L1')->first()?->id,
            'l2' => $levels->where('name', 'L2')->first()?->id,
            'l3' => $levels->where('name', 'L3')->first()?->id,
            'm1' => $levels->where('name', 'M1')->first()?->id,
            'm2' => $levels->where('name', 'M2')->first()?->id,
        ];
        
        // Créer un mapping pour les semestres
        $semesterMap = [];
        foreach ($semesters as $semester) {
            $level = $levels->where('id', $semester->level_id)->first();
            if ($level) {
                $key = strtolower($level->name) . '_' . $semester->name;
                $semesterMap[$key] = $semester->id;
            }
        }
        
        $modules = [];
        
        // ============ TABLEAU 1 – 1ère Année Ingénieur Informatique (SI) ============
        $modules[] = [
            'code' => 'ING101',
            'module_name' => 'Algorithmique',
            'description' => 'Algorithmique et structures de données',
            'credits' => 6,
            'coefficient' => 3.0,
            'volume_cm' => 30,
            'volume_td' => 30,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing1'],
            'semester_id' => $semesterMap['ing1_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'ING102',
            'module_name' => 'Systèmes d\'Exploitation',
            'description' => 'Introduction aux systèmes d\'exploitation',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing1'],
            'semester_id' => $semesterMap['ing1_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'ING103',
            'module_name' => 'Algèbre',
            'description' => 'Algèbre linéaire et structures algébriques',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 30,
            'volume_td' => 20,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing1'],
            'semester_id' => $semesterMap['ing1_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'ING104',
            'module_name' => 'Analyse',
            'description' => 'Analyse mathématique',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 30,
            'volume_td' => 20,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing1'],
            'semester_id' => $semesterMap['ing1_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'ING105',
            'module_name' => 'Expression Écrite et Bureautique',
            'description' => 'Communication écrite et outils bureautiques',
            'credits' => 4,
            'coefficient' => 2.0,
            'volume_cm' => 20,
            'volume_td' => 20,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing1'],
            'semester_id' => $semesterMap['ing1_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'ING106',
            'module_name' => 'Structure Machine',
            'description' => 'Architecture des ordinateurs',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing1'],
            'semester_id' => $semesterMap['ing1_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'ING107',
            'module_name' => 'Électronique Fondamentale',
            'description' => 'Bases de l\'électronique',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing1'],
            'semester_id' => $semesterMap['ing1_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        // ============ TABLEAU 2 – 2ème Année Ingénieur Informatique ============
        $modules[] = [
            'code' => 'ING201',
            'module_name' => 'Analyse 3',
            'description' => 'Analyse mathématique avancée',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 30,
            'volume_td' => 20,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing2'],
            'semester_id' => $semesterMap['ing2_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'ING202',
            'module_name' => 'Algorithmique 3',
            'description' => 'Algorithmique avancée',
            'credits' => 6,
            'coefficient' => 3.0,
            'volume_cm' => 25,
            'volume_td' => 35,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing2'],
            'semester_id' => $semesterMap['ing2_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'ING203',
            'module_name' => 'Algèbre 3',
            'description' => 'Algèbre avancée',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 30,
            'volume_td' => 20,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing2'],
            'semester_id' => $semesterMap['ing2_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'ING204',
            'module_name' => 'Programmation Orientée Objet (POO 1)',
            'description' => 'Programmation orientée objet',
            'credits' => 6,
            'coefficient' => 3.0,
            'volume_cm' => 25,
            'volume_td' => 35,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing2'],
            'semester_id' => $semesterMap['ing2_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'ING205',
            'module_name' => 'Probabilités et Statistiques',
            'description' => 'Probabilités et statistiques appliquées',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing2'],
            'semester_id' => $semesterMap['ing2_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'ING206',
            'module_name' => 'Systèmes d\'Information',
            'description' => 'Introduction aux systèmes d\'information',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing2'],
            'semester_id' => $semesterMap['ing2_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'ING207',
            'module_name' => 'Entreprenariat',
            'description' => 'Fondements de l\'entreprenariat',
            'credits' => 4,
            'coefficient' => 2.0,
            'volume_cm' => 20,
            'volume_td' => 20,
            'speciality_id' => $troncCommunSpeciality?->id,
            'level_id' => $levelMap['ing2'],
            'semester_id' => $semesterMap['ing2_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        // ============ TABLEAU 3 – 3ème Année Ingénieur Informatique – Génie Logiciel (GL) ============
        $modules[] = [
            'code' => 'GL301',
            'module_name' => 'Génie Logiciel',
            'description' => 'Fondements du génie logiciel',
            'credits' => 6,
            'coefficient' => 3.0,
            'volume_cm' => 30,
            'volume_td' => 30,
            'speciality_id' => $glSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'GL302',
            'module_name' => 'Bases de Données',
            'description' => 'Bases de données relationnelles',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $glSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'GL303',
            'module_name' => 'Algorithmique',
            'description' => 'Algorithmique avancée',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $glSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'GL304',
            'module_name' => 'Systèmes d\'Exploitation',
            'description' => 'Systèmes d\'exploitation avancés',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $glSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'GL305',
            'module_name' => 'Technologies Optimales',
            'description' => 'Technologies d\'optimisation',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $glSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'GL306',
            'module_name' => 'Intelligence Artificielle',
            'description' => 'Introduction à l\'intelligence artificielle',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $glSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        // ============ TABLEAU 4 – 3ème Année Ingénieur Informatique – Intelligence Artificielle (IA) ============
        $modules[] = [
            'code' => 'IA301',
            'module_name' => 'Génie Logiciel',
            'description' => 'Fondements du génie logiciel',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $iaSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'IA302',
            'module_name' => 'Bases de Données',
            'description' => 'Bases de données relationnelles',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $iaSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'IA303',
            'module_name' => 'Analyse Numérique',
            'description' => 'Méthodes numériques',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $iaSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'IA304',
            'module_name' => 'Systèmes d\'Exploitation',
            'description' => 'Systèmes d\'exploitation',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $iaSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'IA305',
            'module_name' => 'Technologies Optimales',
            'description' => 'Technologies d\'optimisation',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $iaSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'IA306',
            'module_name' => 'Intelligence Artificielle',
            'description' => 'Fondements de l\'intelligence artificielle',
            'credits' => 6,
            'coefficient' => 3.0,
            'volume_cm' => 30,
            'volume_td' => 30,
            'speciality_id' => $iaSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'IA307',
            'module_name' => 'Développement Mobile',
            'description' => 'Développement d\'applications mobiles',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 20,
            'volume_td' => 30,
            'speciality_id' => $iaSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        // ============ TABLEAU 5 – 3ème Année Ingénieur Informatique – Réseaux ============
        $modules[] = [
            'code' => 'RES301',
            'module_name' => 'Génie Logiciel',
            'description' => 'Fondements du génie logiciel',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $resSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'RES302',
            'module_name' => 'Bases de Données Avancées',
            'description' => 'Bases de données avancées',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $resSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'RES303',
            'module_name' => 'Réseaux Avancés',
            'description' => 'Réseaux informatiques avancés',
            'credits' => 6,
            'coefficient' => 3.0,
            'volume_cm' => 30,
            'volume_td' => 30,
            'speciality_id' => $resSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 1'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'RES304',
            'module_name' => 'Systèmes d\'Exploitation',
            'description' => 'Systèmes d\'exploitation',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $resSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'RES305',
            'module_name' => 'Technologies Web',
            'description' => 'Technologies web modernes',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 20,
            'volume_td' => 30,
            'speciality_id' => $resSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        $modules[] = [
            'code' => 'RES306',
            'module_name' => 'Modélisation des Systèmes d\'Information',
            'description' => 'Modélisation des SI',
            'credits' => 5,
            'coefficient' => 2.5,
            'volume_cm' => 25,
            'volume_td' => 25,
            'speciality_id' => $resSpeciality?->id,
            'level_id' => $levelMap['ing3'],
            'semester_id' => $semesterMap['ing3_Semestre 2'] ?? null,
            'teacher_id' => $defaultTeacher?->id,
        ];
        
        // Ajouter les champs manquants
        foreach ($modules as &$module) {
            $module['objectives'] = $module['objectives'] ?? 'Objectifs du module';
            $module['resources'] = $module['resources'] ?? 'Ressources du module';
            $module['evaluation_methods'] = json_encode(['exam', 'tp', 'project']);
        }
        
        // Créer les modules
        foreach ($modules as $module) {
            Module::create($module);
        }
        
        $this->command->info(count($modules) . ' modules créés avec succès.');
        $this->command->info('Modules par spécialité:');
        $this->command->info('- Tronc Commun: 15 modules');
        $this->command->info('- Génie Logiciel: 6 modules');
        $this->command->info('- Intelligence Artificielle: 7 modules');
        $this->command->info('- Réseaux: 6 modules');
        $this->command->info('- Total: ' . count($modules) . ' modules');
    }
}
