<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            // Ajouter les colonnes manquantes si elles n'existent pas
            if (!Schema::hasColumn('exams', 'module_id')) {
                $table->unsignedBigInteger('module_id')->after('id');
                $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
            }
            
            if (!Schema::hasColumn('exams', 'group_id')) {
                $table->unsignedBigInteger('group_id')->after('module_id');
                $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
            }
            
            if (!Schema::hasColumn('exams', 'exam_subtype')) {
                $table->string('exam_subtype')->after('exam_type');
            }
            
            if (!Schema::hasColumn('exams', 'title')) {
                $table->string('title')->after('exam_subtype');
            }
            
            if (!Schema::hasColumn('exams', 'description')) {
                $table->text('description')->nullable()->after('title');
            }
            
            if (!Schema::hasColumn('exams', 'duration_minutes')) {
                $table->integer('duration_minutes')->default(120)->after('duration');
            }
            
            if (!Schema::hasColumn('exams', 'max_score')) {
                $table->decimal('max_score', 5, 2)->default(20.00)->after('duration_minutes');
            }
            
            // Renommer les anciennes colonnes si nécessaire
            if (Schema::hasColumn('exams', 'id_group') && !Schema::hasColumn('exams', 'group_id_old')) {
                $table->renameColumn('id_group', 'group_id_old');
            }
            
            if (Schema::hasColumn('exams', 'id_module') && !Schema::hasColumn('exams', 'module_id_old')) {
                $table->renameColumn('id_module', 'module_id_old');
            }
            
            if (Schema::hasColumn('exams', 'exame_date') && !Schema::hasColumn('exams', 'exam_date_old')) {
                $table->renameColumn('exame_date', 'exam_date_old');
            }
            
            if (Schema::hasColumn('exams', 'exame_time') && !Schema::hasColumn('exams', 'exam_time_old')) {
                $table->renameColumn('exame_time', 'exam_time_old');
            }
        });
    }

    public function down(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            // Supprimer les colonnes ajoutées
            $table->dropForeign(['module_id']);
            $table->dropForeign(['group_id']);
            $table->dropColumn(['module_id', 'group_id', 'exam_subtype', 'title', 'description', 'duration_minutes', 'max_score']);
            
            // Restaurer les anciens noms si nécessaire
            if (Schema::hasColumn('exams', 'group_id_old')) {
                $table->renameColumn('group_id_old', 'id_group');
            }
            
            if (Schema::hasColumn('exams', 'module_id_old')) {
                $table->renameColumn('module_id_old', 'id_module');
            }
            
            if (Schema::hasColumn('exams', 'exam_date_old')) {
                $table->renameColumn('exam_date_old', 'exame_date');
            }
            
            if (Schema::hasColumn('exams', 'exam_time_old')) {
                $table->renameColumn('exam_time_old', 'exame_time');
            }
        });
    }
};
