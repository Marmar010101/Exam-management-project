<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Display a listing of the rooms.
     */
    public function index()
    {
        $rooms = Room::all()->map(function ($room) {
            return [
                'id' => $room->id,
                'room_name' => $room->room_name,
                'room_capacity' => $room->room_capacity,
                'room_type' => $room->room_type,
                'availability' => $room->availability,
                'status_color' => $room->availability === 'Disponible' ? 'green' : 'red',
                'status_text' => $room->availability === 'Disponible' ? 'Disponible' : 'Indisponible'
            ];
        });

        return Inertia::render('headdepartment/salles', [
            'rooms' => $rooms
        ]);
    }

    /**
     * Store a newly created room.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_name' => 'required|string|max:255',
            'room_capacity' => 'required|integer|min:1',
            'room_type' => 'required|string|max:255',
            'availability' => 'required|in:Disponible,Indisponible'
        ]);

        Room::create($validated);

        return redirect()->back()->with('success', 'Salle créée avec succès');
    }

    /**
     * Update the specified room.
     */
    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'room_name' => 'required|string|max:255',
            'room_capacity' => 'required|integer|min:1',
            'room_type' => 'required|string|max:255',
            'availability' => 'required|in:Disponible,Indisponible'
        ]);

        $room->update($validated);

        return redirect()->back()->with('success', 'Salle mise à jour avec succès');
    }

    /**
     * Remove the specified room.
     */
    public function destroy(Room $room)
    {
        $room->delete();

        return redirect()->back()->with('success', 'Salle supprimée avec succès');
    }
}
