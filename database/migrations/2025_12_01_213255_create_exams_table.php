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
            $table->date('exam_date');
            $table->time('exam_time');
             $table->integer('duration');
             $table->time('end_time');
             $table->text('conflict_warnings')->nullable();
             $table->boolean('has_conflicts')->default(false);
             $table->string('session_name')->nullable(); // To identify batch of exams
             $table->boolean('is_batch_created')->default(false); // To identify auto-generated exams
             $table->integer('student_count')->default(0);
              $table->enum('status', ['draft', 'pending_approval', 'approved', 'rejected', 'published'])
              ->default('draft');
        $table->text('rejection_reason')->nullable();
        $table->foreignId('approved_by')->nullable()->constrained('users');
        $table->timestamp('approved_at')->nullable();
        $table->timestamp('published_at')->nullable();
        $table->foreignId('created_by')->nullable()->constrained('users');
             $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
           $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
           if (!Schema::hasColumn('exams', 'is_published')) {
                $table->boolean('is_published')->default(false);
            }

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
