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
        Schema::create('invigilation_schedules', function (Blueprint $table) {
            $table->id();
             $table->foreignId('exam_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['main', 'assistant', 'backup'])->default('assistant');
            $table->text('notes')->nullable();
            $table->boolean('notified')->default(false);
            $table->unique(['exam_id', 'teacher_id']);
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
        Schema::dropIfExists('invigilation_schedules');

        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn(['unavailable_dates', 'max_exams_per_day', 'max_exams_per_week']);
        });
    }
};
