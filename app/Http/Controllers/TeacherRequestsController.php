<?php

namespace App\Http\Controllers;

use App\Models\TeacherRequest;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherRequestsController extends Controller
{
    /**
     * Display teacher requests page.
     */
    public function index(): Response
    {
        // Données fictives pour les demandes - les tables teachers, groups n'existent plus
        $requests = [
            [
                'id' => 1,
                'teacher_name' => 'Dr. Omar',
                'module_name' => 'Algorithmique',
                'group_name' => 'L1-S1-A',
                'type' => 'absence',
                'description' => 'Absence justifiée pour maladie',
                'request_date' => '2025-01-10',
                'status' => 'pending'
            ],
            [
                'id' => 2,
                'teacher_name' => 'Dr. Leila',
                'module_name' => 'Base de Données',
                'group_name' => 'L1-S1-B',
                'type' => 'duration_change',
                'description' => 'Demande de prolongation de durée',
                'request_date' => '2025-01-12',
                'status' => 'approved'
            ]
        ];

        // Données fictives pour les filtres
        $teachers = [
            ['id' => 1, 'name' => 'Dr. Omar'],
            ['id' => 2, 'name' => 'Dr. Leila']
        ];
        
        $modules = Module::all();
        
        $groups = [
            ['id' => 1, 'name' => 'L1-S1-A'],
            ['id' => 2, 'name' => 'L1-S1-B']
        ];

        return Inertia::render('headdepartment/teacher_requests', [
            'requests' => $requests,
            'teachers' => $teachers,
            'modules' => $modules,
            'groups' => $groups,
        ]);
    }

    /**
     * Store a new teacher request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // 'teacher_id' => 'required|exists:teachers,id', // Commenté - table teachers n'existe plus
            'module_id' => 'required|exists:modules,id',
            // 'group_id' => 'required|exists:groups,id', // Commenté - table groups n'existe plus
            'type' => 'required|in:absence,duration_change,room_change,other',
            'description' => 'required|string|max:1000',
            'exam_date' => 'nullable|date',
            'request_date' => 'required|date',
            'status' => 'required|in:pending,approved,rejected',
        ]);

        TeacherRequest::create($validated);

        return redirect()->back()->with('success', 'Request created successfully!');
    }

    /**
     * Update a teacher request.
     */
    public function update(Request $request, TeacherRequest $teacherRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $teacherRequest->update($validated);

        return redirect()->back()->with('success', 'Request updated successfully!');
    }

    /**
     * Delete a teacher request.
     */
    public function destroy(TeacherRequest $teacherRequest)
    {
        $teacherRequest->delete();

        return redirect()->back()->with('success', 'Request deleted successfully!');
    }
}
