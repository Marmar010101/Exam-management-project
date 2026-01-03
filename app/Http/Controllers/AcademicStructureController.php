<?php

namespace App\Http\Controllers;

use App\Models\StudySystem;
use App\Models\StudyLevel;
use App\Models\Speciality;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicStructureController extends Controller
{
    public function getLevelsBySystem($systemId)
    {
        $system = StudySystem::findOrFail($systemId);
        $levels = $system->activeLevels()->with(['semesters', 'studySystem'])->get();
        
        return response()->json($levels);
    }

    public function getSemestersByLevel($levelId)
    {
        $level = StudyLevel::findOrFail($levelId);
        $semesters = $level->semesters()->get();
        
        return response()->json($semesters);
    }

    public function getSpecialitiesByLevel($levelId)
    {
        $level = StudyLevel::with('studySystem')->findOrFail($levelId);
        $specialities = $level->getSpecialities();
        
        return response()->json($specialities);
    }

    public function getAllLevels()
    {
        $levels = StudyLevel::with('studySystem')->get();
        return response()->json($levels);
    }

    public function getAllSpecialities()
    {
        $specialities = Speciality::all();
        return response()->json($specialities);
    }

    public function getAcademicStructure()
    {
        $systems = StudySystem::with(['activeLevels' => function($query) {
            $query->with('semesters');
        }])->get();

        return response()->json($systems);
    }
}
