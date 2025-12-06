<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
         $rooms = [
            ['room_name' => 'Salle 101', 'room_capacity' => '30', 'room_type' => 'salle_td', 'availability' => true],
            ['room_name' => 'Salle 202', 'room_capacity' => '25', 'room_type' => 'TP', 'availability' => true],
            ['room_name' => 'Salle 303', 'room_capacity' => '100', 'room_type' => 'Amphi', 'availability' => true],
            ['room_name' => 'Salle 404', 'room_capacity' => '20', 'room_type' => 'TP', 'availability' => true],
        ];

        foreach ($rooms as $r) {
            Room::create($r);
        }
    }
}
