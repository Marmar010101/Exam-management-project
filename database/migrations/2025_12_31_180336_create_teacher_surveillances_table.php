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
        Schema::create('teacher_surveillances', function (Blueprint $table) {
            $table->id();
            $table->string('module');
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->string('group');
            $table->date('date');
            $table->string('time');
            $table->string('room');
            $table->enum('urgency', ['low', 'normal', 'high'])->default('normal');
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
        Schema::dropIfExists('teacher_surveillances');
    }
};
