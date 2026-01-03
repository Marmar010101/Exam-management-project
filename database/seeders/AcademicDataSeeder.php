<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Speciality;
use App\Models\Level;
use App\Models\Semester;
use App\Models\Module;
use App\Models\Room;
use App\Models\Cycle;

class AcademicDataSeeder extends Seeder
{
    public function run()
    {
        // Créer les cycles
        $cycles = [
            ['cycle_name' => 'Licence'],
            ['cycle_name' => 'Master'],
            ['cycle_name' => 'Doctorat'],
        ];

        foreach ($cycles as $cycle) {
            Cycle::create($cycle);
        }

        // Créer les spécialités
        $specialities = [
            ['name' => 'Informatique Fondamentale'],
            ['name' => 'Systèmes d\'Information et Réseaux'],
            ['name' => 'Logiciels et Systèmes Intelligents'],
            ['name' => 'Tronc Commun Sciences et Technologie'],
        ];

        foreach ($specialities as $speciality) {
            Speciality::create($speciality);
        }

        // Créer les niveaux avec cycle_id
        $levels = [
            ['name' => 'L1', 'cycle_id' => 1],
            ['name' => 'L2', 'cycle_id' => 1],
            ['name' => 'L3', 'cycle_id' => 1],
            ['name' => 'M1', 'cycle_id' => 2],
            ['name' => 'M2', 'cycle_id' => 2],
        ];

        foreach ($levels as $level) {
            Level::create($level);
        }

        // Créer les semestres avec level_id
        $semesters = [
            ['name' => 'S1', 'level_id' => 1],
            ['name' => 'S2', 'level_id' => 1],
            ['name' => 'S3', 'level_id' => 2],
            ['name' => 'S4', 'level_id' => 2],
            ['name' => 'S5', 'level_id' => 3],
            ['name' => 'S6', 'level_id' => 3],
        ];

        foreach ($semesters as $semester) {
            Semester::create($semester);
        }

        // Créer les salles
        $rooms = [
            ['room_name' => 'Salle A101', 'room_capacity' => 30, 'room_type' => 'Salle d\'examen', 'availability' => 1],
            ['room_name' => 'Salle A102', 'room_capacity' => 30, 'room_type' => 'Salle d\'examen', 'availability' => 1],
            ['room_name' => 'Salle B201', 'room_capacity' => 25, 'room_type' => 'Laboratoire', 'availability' => 1],
            ['room_name' => 'Salle B202', 'room_capacity' => 25, 'room_type' => 'Laboratoire', 'availability' => 1],
            ['room_name' => 'Salle C301', 'room_capacity' => 40, 'room_type' => 'Amphithéâtre', 'availability' => 1],
            ['room_name' => 'Salle C302', 'room_capacity' => 40, 'room_type' => 'Amphithéâtre', 'availability' => 0],
            ['room_name' => 'Salle D101', 'room_capacity' => 20, 'room_type' => 'Salle d\'examen', 'availability' => 1],
            ['room_name' => 'Salle D102', 'room_capacity' => 20, 'room_type' => 'Salle d\'examen', 'availability' => 1],
        ];

        foreach ($rooms as $room) {
            Room::create($room);
        }

        // Créer les modules
        $modules = [
            // L1 Tronc Commun
            ['module_name' => 'Algorithmique & Structures de Données 1', 'code' => 'ALG101', 'speciality_id' => 4, 'level_id' => 1, 'semester_id' => 1],
            ['module_name' => 'Mathématiques pour l\'Informatique 1', 'code' => 'MAT101', 'speciality_id' => 4, 'level_id' => 1, 'semester_id' => 1],
            ['module_name' => 'Système d\'Exploitation 1', 'code' => 'OS101', 'speciality_id' => 4, 'level_id' => 1, 'semester_id' => 1],
            ['module_name' => 'Architecture des Ordinateurs', 'code' => 'ARC101', 'speciality_id' => 4, 'level_id' => 1, 'semester_id' => 1],
            ['module_name' => 'Initiation aux Réseaux', 'code' => 'RES101', 'speciality_id' => 4, 'level_id' => 1, 'semester_id' => 1],
            ['module_name' => 'Langage C', 'code' => 'C101', 'speciality_id' => 4, 'level_id' => 1, 'semester_id' => 1],
            
            // L1 S2
            ['module_name' => 'Algorithmique & Structures de Données 2', 'code' => 'ALG102', 'speciality_id' => 4, 'level_id' => 1, 'semester_id' => 2],
            ['module_name' => 'Programmation Orientée Objet', 'code' => 'POO102', 'speciality_id' => 4, 'level_id' => 1, 'semester_id' => 2],
            ['module_name' => 'Bases de Données 1', 'code' => 'BD102', 'speciality_id' => 4, 'level_id' => 1, 'semester_id' => 2],
            ['module_name' => 'Mathématiques pour l\'Informatique 2', 'code' => 'MAT102', 'speciality_id' => 4, 'level_id' => 1, 'semester_id' => 2],
            ['module_name' => 'Logique', 'code' => 'LOG102', 'speciality_id' => 4, 'level_id' => 1, 'semester_id' => 2],
            ['module_name' => 'Système d\'Exploitation 2', 'code' => 'OS102', 'speciality_id' => 4, 'level_id' => 1, 'semester_id' => 2],
            
            // L2 Informatique Fondamentale
            ['module_name' => 'Structures de Données Avancées', 'code' => 'SDA201', 'speciality_id' => 1, 'level_id' => 2, 'semester_id' => 3],
            ['module_name' => 'Graphes & Combinatoire', 'code' => 'GRA201', 'speciality_id' => 1, 'level_id' => 2, 'semester_id' => 3],
            ['module_name' => 'Systèmes Logiques', 'code' => 'SYS201', 'speciality_id' => 1, 'level_id' => 2, 'semester_id' => 3],
            ['module_name' => 'Conception Orientée Objet (UML)', 'code' => 'UML201', 'speciality_id' => 1, 'level_id' => 2, 'semester_id' => 3],
            ['module_name' => 'Bases de Données 2', 'code' => 'BD201', 'speciality_id' => 1, 'level_id' => 2, 'semester_id' => 3],
            ['module_name' => 'Web (HTML/CSS/PHP)', 'code' => 'WEB201', 'speciality_id' => 1, 'level_id' => 2, 'semester_id' => 3],
            
            // L2 S4
            ['module_name' => 'Réseaux Informatiques', 'code' => 'RES202', 'speciality_id' => 1, 'level_id' => 2, 'semester_id' => 4],
            ['module_name' => 'Langages Formels & Automates', 'code' => 'LFA202', 'speciality_id' => 1, 'level_id' => 2, 'semester_id' => 4],
            ['module_name' => 'Génie Logiciel', 'code' => 'GL202', 'speciality_id' => 1, 'level_id' => 2, 'semester_id' => 4],
            ['module_name' => 'Administration Système & Réseaux', 'code' => 'ASR202', 'speciality_id' => 1, 'level_id' => 2, 'semester_id' => 4],
            ['module_name' => 'Programmation Web Avancée', 'code' => 'PWA202', 'speciality_id' => 1, 'level_id' => 2, 'semester_id' => 4],
            ['module_name' => 'Probabilités & Statistiques', 'code' => 'PRO202', 'speciality_id' => 1, 'level_id' => 2, 'semester_id' => 4],
            
            // L3 Systèmes d'Information et Réseaux
            ['module_name' => 'Sécurité Informatique', 'code' => 'SEC301', 'speciality_id' => 2, 'level_id' => 3, 'semester_id' => 5],
            ['module_name' => 'Réseaux Avancés (TCP/IP, Routage)', 'code' => 'RTR301', 'speciality_id' => 2, 'level_id' => 3, 'semester_id' => 5],
            ['module_name' => 'Développement d\'Applications Réparties', 'code' => 'DAR301', 'speciality_id' => 2, 'level_id' => 3, 'semester_id' => 5],
            ['module_name' => 'Data Mining', 'code' => 'DM301', 'speciality_id' => 2, 'level_id' => 3, 'semester_id' => 5],
            ['module_name' => 'Systèmes Intelligents', 'code' => 'SI301', 'speciality_id' => 2, 'level_id' => 3, 'semester_id' => 5],
            
            // L3 Logiciels et Systèmes Intelligents
            ['module_name' => 'Intelligence Artificielle', 'code' => 'IA301', 'speciality_id' => 3, 'level_id' => 3, 'semester_id' => 5],
            ['module_name' => 'Développement Mobile', 'code' => 'DM301', 'speciality_id' => 3, 'level_id' => 3, 'semester_id' => 5],
            ['module_name' => 'Cloud Computing', 'code' => 'CC301', 'speciality_id' => 3, 'level_id' => 3, 'semester_id' => 5],
            ['module_name' => 'Interfaces Homme-Machine (IHM)', 'code' => 'IHM301', 'speciality_id' => 3, 'level_id' => 3, 'semester_id' => 5],
            ['module_name' => 'Test & Validation Logicielle', 'code' => 'TVL301', 'speciality_id' => 3, 'level_id' => 3, 'semester_id' => 5],
            
            // M1 Systèmes Informatiques Intelligents
            ['module_name' => 'Apprentissage Automatique (Machine Learning)', 'code' => 'ML401', 'speciality_id' => 3, 'level_id' => 4, 'semester_id' => 1],
            ['module_name' => 'Réseaux Neuronaux', 'code' => 'RN401', 'speciality_id' => 3, 'level_id' => 4, 'semester_id' => 1],
            ['module_name' => 'Systèmes Multi-Agents', 'code' => 'SMA401', 'speciality_id' => 3, 'level_id' => 4, 'semester_id' => 1],
            ['module_name' => 'Big Data', 'code' => 'BD401', 'speciality_id' => 3, 'level_id' => 4, 'semester_id' => 1],
            ['module_name' => 'Sécurité Avancée', 'code' => 'SEC401', 'speciality_id' => 3, 'level_id' => 4, 'semester_id' => 1],
            
            // M1 Réseaux et Systèmes Distribués
            ['module_name' => 'Réseaux Haut Débit & Mobiles', 'code' => 'RHM401', 'speciality_id' => 2, 'level_id' => 4, 'semester_id' => 1],
            ['module_name' => 'Virtualisation & Conteneurs', 'code' => 'VC401', 'speciality_id' => 2, 'level_id' => 4, 'semester_id' => 1],
            ['module_name' => 'Internet des Objets (IoT)', 'code' => 'IOT401', 'speciality_id' => 2, 'level_id' => 4, 'semester_id' => 1],
            ['module_name' => 'Cryptographie Appliquée', 'code' => 'CA401', 'speciality_id' => 2, 'level_id' => 4, 'semester_id' => 1],
            ['module_name' => 'Cloud & Edge Computing', 'code' => 'CEC401', 'speciality_id' => 2, 'level_id' => 4, 'semester_id' => 1],
        ];

        foreach ($modules as $module) {
            Module::create($module);
        }
    }
}
