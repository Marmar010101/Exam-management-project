<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamStatusSeeder extends Seeder
{
    public function run()
    {
        // Mettre tous les examens en accepted d'abord
        DB::table('exams')->update(['status' => 'accepted']);
        
        // Mettre seulement 3 examens en pending
        DB::table('exams')
            ->orderBy('id')
            ->limit(3)
            ->update(['status' => 'pending']);
        
        echo "✅ 3 examens mis en pending, le reste en accepted\n";
    }
}
