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
        Schema::table('exam_plans', function (Blueprint $table) {
            $table->string('exam_subtype')->nullable()->after('exam_type');
            $table->date('start_date')->nullable()->after('exam_date');
            $table->date('end_date')->nullable()->after('start_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exam_plans', function (Blueprint $table) {
            $table->dropColumn(['exam_subtype', 'start_date', 'end_date']);
        });
    }
};
