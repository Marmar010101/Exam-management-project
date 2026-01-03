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
        Schema::create('teacher_exams', function (Blueprint $table) {
            $table->id();
            $table->string('module');
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['normal', 'rattrapage'])->default('normal');
            $table->date('date');
            $table->string('duration');
            $table->string('group');
            $table->string('room')->nullable();
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
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
        Schema::dropIfExists('teacher_exams');
    }
};
