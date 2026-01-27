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
        Schema::table('modules', function (Blueprint $table) {
            $table->text('description')->nullable()->after('module_name');
            $table->enum('system_type', ['ing', 'lmd'])->nullable()->after('description');
            $table->string('level')->nullable()->after('system_type');
            $table->enum('semester', ['s1', 's2'])->nullable()->after('level');
            $table->integer('credits')->default(4)->after('semester_id');
            $table->decimal('coefficient', 3, 2)->default(1.00)->after('credits');
            $table->integer('volume_cm')->default(0)->after('coefficient');
            $table->integer('volume_td')->default(0)->after('volume_cm');
            $table->enum('specialty', ['ia', 'gl', 'res', 'sic'])->nullable()->after('volume_td');
            $table->text('objectives')->nullable()->after('specialty');
            $table->text('resources')->nullable()->after('objectives');
            $table->json('evaluation_methods')->nullable()->after('resources');
        });
        
        // Create prerequisites table
        Schema::create('module_prerequisites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->foreignId('prerequisite_id')->constrained('modules')->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['module_id', 'prerequisite_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('module_prerequisites');
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn([
                'description',
                'system_type', 
                'level',
                'semester',
                'credits',
                'coefficient',
                'volume_cm',
                'volume_td',
                'specialty',
                'objectives',
                'resources',
                'evaluation_methods'
            ]);
        });
    }
};
