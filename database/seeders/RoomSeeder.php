<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    public function run()
    {
        // Vider les salles existantes
        Room::query()->delete();
        
        $rooms = [
            // Amphithéâtres
            ['room_name' => 'Amphi 1', 'room_capacity' => 200, 'room_type' => 'amphitheatre', 'availability' => 1],
            ['room_name' => 'Amphi 2', 'room_capacity' => 200, 'room_type' => 'amphitheatre', 'availability' => 1],
            ['room_name' => 'Amphi 3', 'room_capacity' => 200, 'room_type' => 'amphitheatre', 'availability' => 1],
            ['room_name' => 'Amphi 4', 'room_capacity' => 200, 'room_type' => 'amphitheatre', 'availability' => 1],
            ['room_name' => 'Amphi 5', 'room_capacity' => 200, 'room_type' => 'amphitheatre', 'availability' => 1],
            ['room_name' => 'Amphi 6', 'room_capacity' => 200, 'room_type' => 'amphitheatre', 'availability' => 1],
            
            // Salles normales
            ['room_name' => 'N001', 'room_capacity' => 35, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N002', 'room_capacity' => 35, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N003', 'room_capacity' => 35, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N004', 'room_capacity' => 35, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N005', 'room_capacity' => 35, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N006', 'room_capacity' => 35, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N007', 'room_capacity' => 35, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N008', 'room_capacity' => 35, 'room_type' => 'salle', 'availability' => 1],
            
            // Bloc N100
            ['room_name' => 'N101', 'room_capacity' => 40, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N102', 'room_capacity' => 40, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N103', 'room_capacity' => 40, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N104', 'room_capacity' => 40, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N105', 'room_capacity' => 40, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N106', 'room_capacity' => 40, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N107', 'room_capacity' => 40, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N108', 'room_capacity' => 40, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N109', 'room_capacity' => 40, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N110', 'room_capacity' => 40, 'room_type' => 'salle', 'availability' => 1],
            
            // Bloc N200
            ['room_name' => 'N201', 'room_capacity' => 45, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N202', 'room_capacity' => 45, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N203', 'room_capacity' => 45, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N204', 'room_capacity' => 45, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N205', 'room_capacity' => 45, 'room_type' => 'salle', 'availability' => 1],
            ['room_name' => 'N206', 'room_capacity' => 45, 'room_type' => 'salle', 'availability' => 1],
            
            // Laboratoires
            ['room_name' => 'Labo 001', 'room_capacity' => 30, 'room_type' => 'laboratoire', 'availability' => 1],
            ['room_name' => 'Labo 002', 'room_capacity' => 30, 'room_type' => 'laboratoire', 'availability' => 1],
            ['room_name' => 'Labo 003', 'room_capacity' => 30, 'room_type' => 'laboratoire', 'availability' => 1],
        ];

        foreach ($rooms as $r) {
            Room::create($r);
        }
        
        $this->command->info('Salles créées avec succès!');
        $this->command->info('Créé ' . count($rooms) . ' salles pour les examens.');
    }
}
