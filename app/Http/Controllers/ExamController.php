<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of the exams.
     */
    public function index()
    {
        // Données fictives pour le moment - la table exams n'existe plus
        $exams = [
            [
                'id' => 1,
                'module' => 'Algorithmique et Structures de Données',
                'date' => '2025-01-15',
                'time' => '09:00',
                'room' => 'A101',
                'type' => 'Normal',
                'duration' => 120
            ],
            [
                'id' => 2,
                'module' => 'Bases de Données',
                'date' => '2025-01-20',
                'time' => '14:00',
                'room' => 'B201',
                'type' => 'Rattrapage',
                'duration' => 90
            ],
            [
                'id' => 3,
                'module' => 'Programmation Orientée Objet',
                'date' => '2025-01-25',
                'time' => '10:00',
                'room' => 'C301',
                'type' => 'Normal',
                'duration' => 150
            ]
        ];

        $modules = Module::where(function($query) {
            $query->where('code', 'NOT LIKE', 'PMM%')
                  ->where('code', 'NOT LIKE', 'RMM%')
                  ->where('code', 'NOT LIKE', 'SMM%');
        })->get(['id', 'module_name', 'code']);
        $rooms = Room::all(['id', 'room_name']);

        return Inertia::render('headdepartment/exams', [
            'exams' => $exams,
            'modules' => $modules,
            'rooms' => $rooms
        ]);
    }

    /**
     * Store a newly created exam.
     */
    public function store(Request $request)
    {
        // Pour l'instant, juste retourner un message de succès
        return redirect()->back()->with('success', 'Examen créé avec succès! (Mock data)');
    }

    /**
     * Update the specified exam.
     */
    public function update(Request $request, $id)
    {
        // Pour l'instant, juste retourner un message de succès
        return redirect()->back()->with('success', 'Examen mis à jour avec succès! (Mock data)');
    }

    /**
     * Remove the specified exam.
     */
    public function destroy($id)
    {
        // Pour l'instant, juste retourner un message de succès
        return redirect()->back()->with('success', 'Examen supprimé avec succès! (Mock data)');
    }
}
