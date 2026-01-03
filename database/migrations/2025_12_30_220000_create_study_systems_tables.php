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
        Schema::create('study_systems', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Licence, Master, Ingéniorat
            $table->string('description')->nullable();
            $table->integer('duration_years'); // 3, 2, 3
            $table->string('diploma_type'); // Licence, Master, Diplôme d'Ingénieur
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('study_levels', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // L1, L2, L3, M1, M2, 1A, 2A, 3A
            $table->foreignId('study_system_id')->constrained('study_systems')->onDelete('cascade');
            $table->integer('level_order'); // 1, 2, 3, 4, 5
            $table->string('full_name'); // "Licence 1ère année", "Master 1ère année"
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('level_semesters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_level_id')->constrained('study_levels')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('semesters')->onDelete('cascade');
            $table->integer('semester_order'); // 1, 2
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('level_semesters');
        Schema::dropIfExists('study_levels');
        Schema::dropIfExists('study_systems');
    }
};
