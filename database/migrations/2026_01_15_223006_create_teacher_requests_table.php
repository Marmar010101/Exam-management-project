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
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->string('type'); // delay_exam, delay_test, absence, cancel_exam, cancel_test
            $table->string('title');
            $table->text('description');
            $table->string('urgency'); // low, normal, high
            $table->dateTime('new_date')->nullable(); // for delay requests
            $table->string('justification_file')->nullable(); // file path
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('admin_notes')->nullable(); // rejection reason or admin notes
            $table->dateTime('processed_at')->nullable(); // when request was processed
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
