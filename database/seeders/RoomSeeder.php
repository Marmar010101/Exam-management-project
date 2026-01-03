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
            ['room_name' => 'S101', 'capacity' => '35', 'room_type' => 'salle_td', 'availability' => true],
            ['room_name' => 'S202', 'capacity' => '25', 'room_type' => 'TP', 'availability' => true],
            ['room_name' => 'N303', 'capacity' => '100', 'room_type' => 'Amphi', 'availability' => true],
            ['room_name' => 'N404', 'capacity' => '20', 'room_type' => 'TP', 'availability' => true],
        ];

        foreach ($rooms as $r) {
            Room::create($r);
        }
    }
}
