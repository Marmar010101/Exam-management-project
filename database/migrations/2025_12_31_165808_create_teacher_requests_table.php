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
        Schema::create('teacher_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('module_id')->nullable()->constrained()->onDelete('set null');
            $table->string('type'); // absence, delay_date, delay_duration, other
            $table->string('title');
            $table->text('description');
            $table->date('date')->nullable(); // Original date for absence/delay requests
            $table->string('time')->nullable();
            $table->string('room')->nullable();
            $table->date('new_date')->nullable(); // For delay requests
            $table->string('new_duration')->nullable(); // For delay duration requests
            $table->string('urgency'); // low, normal, high
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('admin_notes')->nullable();
            $table->timestamp('response_date')->nullable();
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
        Schema::dropIfExists('teacher_requests');
    }
};
