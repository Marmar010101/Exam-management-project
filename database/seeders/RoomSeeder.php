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
            ['room_name' => 'S101', 'room_type' => 'salle_td', 'room_capacity' => 35],
            ['room_name' => 'S202', 'room_type' => 'TP', 'room_capacity' => 25],
            ['room_name' => 'N303', 'room_type' => 'Amphi', 'room_capacity' => 100],
            ['room_name' => 'N404', 'room_type' => 'TP', 'room_capacity' => 20],
        ];

        foreach ($rooms as $r) {
            Room::create($r);
        }
    }
}
