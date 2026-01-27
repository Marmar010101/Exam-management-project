<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\Level;
use App\Models\Speciality;
use App\Models\Semester;

class AcademicStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get existing levels and specialities
        $levels = Level::all()->keyBy('id');
        $specialities = Speciality::all()->keyBy('id');
        
        // SYSTÈME INGÉNIEUR (5 ans)
        
        // Tronc Commun (2 ans)
        $this->createGroupsForSection('ING-TC-1A', 'Ingénieur 1ère année', 16, 1, $levels, $specialities); // ing1
        $this->createGroupsForSection('ING-TC-2A', 'Ingénieur 2ème année', 17, 1, $levels, $specialities); // ing2
        
        // Spécialités (3 ans) - 3ème année
        $this->createGroupsForSection('ING-GL-3A', 'Génie Logiciel 3ème année', 18, 2, $levels, $specialities); // ing3
        $this->createGroupsForSection('ING-IA-3A', 'Intelligence Artificielle 3ème année', 18, 3, $levels, $specialities); // ing3
        $this->createGroupsForSection('ING-RES-3A', 'Réseaux 3ème année', 18, 4, $levels, $specialities); // ing3
        $this->createGroupsForSection('ING-SIC-3A', 'Systèmes d Information 3ème année', 18, 5, $levels, $specialities); // ing3
        
        // Spécialités (3 ans) - 4ème année
        $this->createGroupsForSection('ING-GL-4A', 'Génie Logiciel 4ème année', 19, 2, $levels, $specialities); // ing4
        $this->createGroupsForSection('ING-IA-4A', 'Intelligence Artificielle 4ème année', 19, 3, $levels, $specialities); // ing4
        $this->createGroupsForSection('ING-RES-4A', 'Réseaux 4ème année', 19, 4, $levels, $specialities); // ing4
        $this->createGroupsForSection('ING-SIC-4A', 'Systèmes d Information 4ème année', 19, 5, $levels, $specialities); // ing4
        
        // Spécialités - 5ème année (Stage PFE)
        $this->createGroupsForSection('ING-GL-5A', 'Génie Logiciel 5ème année', 20, 2, $levels, $specialities); // ing5
        $this->createGroupsForSection('ING-IA-5A', 'Intelligence Artificielle 5ème année', 20, 3, $levels, $specialities); // ing5
        $this->createGroupsForSection('ING-RES-5A', 'Réseaux 5ème année', 20, 4, $levels, $specialities); // ing5
        $this->createGroupsForSection('ING-SIC-5A', 'Systèmes d Information 5ème année', 20, 5, $levels, $specialities); // ing5
        
        // SYSTÈME LMD (3+2 ans)
        
        // Licence (3 ans - Tronc Commun)
        $this->createGroupsForSection('LIC-L1', 'Licence 1ère année', 11, 1, $levels, $specialities); // L1
        $this->createGroupsForSection('LIC-L2', 'Licence 2ème année', 12, 1, $levels, $specialities); // L2
        $this->createGroupsForSection('LIC-L3', 'Licence 3ème année', 13, 1, $levels, $specialities); // L3
        
        // Master (2 ans) - Spécialités
        $this->createGroupsForSection('MAS-GL-M1', 'Master GL 1ère année', 14, 2, $levels, $specialities); // M1
        $this->createGroupsForSection('MAS-IA-M1', 'Master IA 1ère année', 14, 3, $levels, $specialities); // M1
        $this->createGroupsForSection('MAS-RSD-M1', 'Master RSD 1ère année', 14, 4, $levels, $specialities); // M1
        $this->createGroupsForSection('MAS-SIC-M1', 'Master SIC 1ère année', 14, 5, $levels, $specialities); // M1
        
        // Master (2 ans) - M2
        $this->createGroupsForSection('MAS-GL-M2', 'Master GL 2ème année', 15, 2, $levels, $specialities); // M2
        $this->createGroupsForSection('MAS-IA-M2', 'Master IA 2ème année', 15, 3, $levels, $specialities); // M2
        $this->createGroupsForSection('MAS-RSD-M2', 'Master RSD 2ème année', 15, 4, $levels, $specialities); // M2
        $this->createGroupsForSection('MAS-SIC-M2', 'Master SIC 2ème année', 15, 5, $levels, $specialities); // M2
    }
    
    private function createGroupsForSection($sectionCode, $sectionName, $levelId, $specialityId, $levels, $specialities)
    {
        // Create 2-3 groups per section
        $groupCount = $this->getGroupCountForSection($sectionCode);
        
        for ($i = 1; $i <= $groupCount; $i++) {
            $groupName = $sectionCode . '-G' . $i;
            
            Group::create([
                'name' => $groupName,
                'level_id' => $levelId,
                'speciality_id' => $specialityId,
                'semester_id' => $this->getSemesterForLevel($levelId)
            ]);
        }
    }
    
    private function getGroupCountForSection($sectionCode)
    {
        // Different sections may have different numbers of groups
        $groupCounts = [
            'ING-TC-1A' => 3,
            'ING-TC-2A' => 3,
            'ING-GL-3A' => 2,
            'ING-IA-3A' => 2,
            'ING-RES-3A' => 2,
            'ING-SIC-3A' => 2,
            'ING-GL-4A' => 2,
            'ING-IA-4A' => 2,
            'ING-RES-4A' => 2,
            'ING-SIC-4A' => 2,
            'ING-GL-5A' => 2,
            'ING-IA-5A' => 2,
            'ING-RES-5A' => 2,
            'ING-SIC-5A' => 2,
            'LIC-L1' => 4,
            'LIC-L2' => 4,
            'LIC-L3' => 4,
            'MAS-GL-M1' => 2,
            'MAS-IA-M1' => 2,
            'MAS-RSD-M1' => 2,
            'MAS-SIC-M1' => 2,
            'MAS-GL-M2' => 2,
            'MAS-IA-M2' => 2,
            'MAS-RSD-M2' => 2,
            'MAS-SIC-M2' => 2,
        ];
        
        return $groupCounts[$sectionCode] ?? 2;
    }
    
    private function getSemesterForLevel($levelId)
    {
        // Map levels to semesters using actual semester IDs
        $semesterMap = [
            11 => 23, // L1 -> S1 (Semestre 1)
            12 => 22, // L2 -> S2 (Semestre 2)
            13 => 21, // L3 -> S3 (Semestre 3)
            14 => 20, // M1 -> S4 (Semestre 4)
            15 => 19, // M2 -> S5 (Semestre 5)
            16 => 23, // ing1 -> S1 (Semestre 1)
            17 => 22, // ing2 -> S2 (Semestre 2)
            18 => 21, // ing3 -> S3 (Semestre 3)
            19 => 20, // ing4 -> S4 (Semestre 4)
            20 => 19, // ing5 -> S5 (Semestre 5)
        ];
        
        return $semesterMap[$levelId] ?? 23; // Default to Semestre 1
    }
}
