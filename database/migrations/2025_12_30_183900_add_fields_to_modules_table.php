<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->string('code')->after('module_name');
            $table->foreignId('speciality_id')->nullable()->after('code')->constrained('specialities')->nullOnDelete();
            $table->foreignId('level_id')->nullable()->after('speciality_id')->constrained('levels')->nullOnDelete();
            $table->foreignId('semester_id')->nullable()->after('level_id')->constrained('semesters')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropForeign(['speciality_id']);
            $table->dropForeign(['level_id']);
            $table->dropForeign(['semester_id']);
            $table->dropColumn(['code', 'speciality_id', 'level_id', 'semester_id']);
        });
    }
};
