<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Module;
use Inertia\Inertia;

class ExamPlanningController extends Controller
{
    public function create(Group $group)
    {
        // Load all modules for this group
        $modules = Module::where('group_id', $group->id)
            ->with(['teacher'])
            ->get();
            
        return Inertia::render('Responsable/ExamPlanning/Create', [
            'group' => $group,
            'modules' => $modules,
            'rooms' => \App\Models\Room::where('availability', true)->get(),
            'teachers' => \App\Models\Teacher::all(),
            'examTypes' => ['Final', 'Midterm', 'Quiz', 'Practical', 'Oral']
        ]);
    }
}