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
        Schema::table('exams', function (Blueprint $table) {
            $table->unsignedBigInteger('room_id')->nullable()->after('id_module');
            $table->integer('duration')->nullable()->after('room_id');
            $table->string('status')->default('pending')->after('duration');
            $table->unsignedBigInteger('created_by')->nullable()->after('status');
            $table->unsignedBigInteger('validated_by')->nullable()->after('created_by');
            $table->text('validation_notes')->nullable()->after('validated_by');
            $table->timestamp('validated_at')->nullable()->after('validation_notes');
            
            $table->foreign('room_id')->references('id')->on('rooms');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('validated_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->dropForeign(['room_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['validated_by']);
            $table->dropColumn('room_id');
            $table->dropColumn('duration');
            $table->dropColumn('status');
            $table->dropColumn('created_by');
            $table->dropColumn('validated_by');
            $table->dropColumn('validation_notes');
            $table->dropColumn('validated_at');
        });
    }
};
