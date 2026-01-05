<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exam_plans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('validated_by')->nullable();
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('module_id');
            $table->unsignedBigInteger('teacher_id')->nullable();
            $table->unsignedBigInteger('room_id')->nullable();
            $table->string('exam_type'); // Final, Midterm, Quiz, Practical, Oral
            $table->date('exam_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('duration_minutes');
            $table->text('description')->nullable();
            $table->string('status')->default('pending'); // pending, validated, rejected, scheduled
            $table->text('validation_notes')->nullable();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'exam_date']);
            $table->index(['group_id', 'exam_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_plans');
    }
};
