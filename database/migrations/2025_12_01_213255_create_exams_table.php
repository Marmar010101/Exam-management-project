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
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
              $table->string('exam_type');
            $table->string('exame_date');
            $table->string('exame_time');
           $table->foreignId('teacher_id')->constrained('teachers')->OnDelete('cascade');
           $table->foreignId('id_group')->constrained('groups')->onDelete('cascade');
           $table->foreignId('id_module')->constrained('modules')->onDelete('cascade');
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
        Schema::dropIfExists('exams');
    }
};
