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
                'status_color' => $room->availability == 1 ? 'green' : 'red',
                'status_text' => $room->availability == 1 ? 'Disponible' : 'Indisponible'
            ];
        });

        return Inertia::render('HeadDepartment/Salles', [
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
            'availability' => 'required|in:Available,Unavailable'
        ]);

        // Convert availability to numeric
        $validated['availability'] = $validated['availability'] === 'Available' ? 1 : 0;

        Room::create($validated);

        return redirect()->back()->with('success', 'Room created successfully');
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
            'availability' => 'required|in:Available,Unavailable'
        ]);

        // Convert availability to numeric
        $validated['availability'] = $validated['availability'] === 'Available' ? 1 : 0;

        $room->update($validated);

        return redirect()->back()->with('success', 'Room updated successfully');
    }

    /**
     * Remove the specified room.
     */
    public function destroy(Room $room)
    {
        $room->delete();

        return redirect()->back()->with('success', 'Room deleted successfully');
    }
}
