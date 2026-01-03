<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExamsPlanningController extends Controller
{
    /**
     * Display the exams planning page.
     */
    public function index(): Response
    {
        // Données fictives pour le moment - les tables exams, teachers, groups n'existent plus
        $exams = [
            [
                'id' => 1,
                'exam_category' => 'Examen',
                'exam_type' => 'Final',
                'exame_date' => '2025-01-15',
                'exame_time' => '09:00',
                'module_name' => 'Algorithmique',
                'group_name' => 'L1-S1-A',
                'teacher_name' => 'Dr. Omar',
                'room_name' => 'A101',
                'group' => [
                    'id' => 1,
                    'name' => 'L1-S1-A',
                    'level' => [
                        'id' => 1,
                        'annee_id' => 1
                    ],
                    'speciality' => [
                        'id' => 1,
                        'filiere_id' => 1
                    ]
                ],
                'teacher' => [
                    'id' => 1,
                    'name' => 'Dr. Omar'
                ],
                'room' => [
                    'id' => 1,
                    'name' => 'A101'
                ]
            ],
            [
                'id' => 2,
                'exam_category' => 'Contrôle',
                'exam_type' => 'Continu',
                'exame_date' => '2025-01-20',
                'exame_time' => '14:00',
                'module_name' => 'Bases de Données',
                'group_name' => 'L1-S1-B',
                'teacher_name' => 'Dr. Leila',
                'room_name' => 'B201',
                'group' => [
                    'id' => 2,
                    'name' => 'L1-S1-B',
                    'level' => [
                        'id' => 1,
                        'annee_id' => 1
                    ],
                    'speciality' => [
                        'id' => 1,
                        'filiere_id' => 1
                    ]
                ],
                'teacher' => [
                    'id' => 2,
                    'name' => 'Dr. Leila'
                ],
                'room' => [
                    'id' => 2,
                    'name' => 'B201'
                ]
            ]
        ];

        // Données fictives pour les filtres
        $groups = [
            ['id' => 1, 'name' => 'L1-S1-A', 'level_name' => 'L1', 'speciality_name' => 'Informatique'],
            ['id' => 2, 'name' => 'L1-S1-B', 'level_name' => 'L1', 'speciality_name' => 'Informatique']
        ];

        $modules = [
            ['id' => 1, 'module_name' => 'Algorithmique', 'teacher_name' => 'Dr. Omar'],
            ['id' => 2, 'module_name' => 'Bases de Données', 'teacher_name' => 'Dr. Leila']
        ];

        $teachers = [
            ['id' => 1, 'first_name' => 'Dr.', 'last_name' => 'Omar'],
            ['id' => 2, 'first_name' => 'Dr.', 'last_name' => 'Leila']
        ];

        $rooms = [
            ['id' => 1, 'name' => 'A101', 'capacity' => 30],
            ['id' => 2, 'name' => 'B201', 'capacity' => 25]
        ];

        $filieres = [
            ['id' => 1, 'name' => 'Informatique'],
            ['id' => 2, 'name' => 'Mathématiques']
        ];

        $years = [
            ['id' => 1, 'annee' => '2024-2025'],
            ['id' => 2, 'annee' => '2025-2026']
        ];

        return Inertia::render('headdepartment/exams_planing', [
            'exams' => $exams,
            'groups' => $groups,
            'modules' => $modules,
            'teachers' => $teachers,
            'rooms' => $rooms,
            'filieres' => $filieres,
            'years' => $years,
        ]);
    }

    /**
     * Store a new exam.
     */
    public function store(Request $request)
    {
        // Pour l'instant, juste retourner un message de succès
        return redirect()->back()->with('success', 'Exam created successfully! (Mock data)');
    }

    /**
     * Update an exam.
     */
    public function update(Request $request, $id)
    {
        // Pour l'instant, juste retourner un message de succès
        return redirect()->back()->with('success', 'Exam updated successfully! (Mock data)');
    }

    /**
     * Delete an exam.
     */
    public function destroy($id)
    {
        // Pour l'instant, juste retourner un message de succès
        return redirect()->back()->with('success', 'Exam deleted successfully! (Mock data)');
    }
}
