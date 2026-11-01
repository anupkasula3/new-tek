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
        Schema::table('packages', function (Blueprint $table) {
            if (!Schema::hasColumn('packages', 'description')) {
                $table->text('description')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('packages', 'difficulty_title')) {
                $table->string('difficulty_title')->nullable()->after('difficulty');
            }
            if (!Schema::hasColumn('packages', 'difficulty_subtitle')) {
                $table->string('difficulty_subtitle')->nullable()->after('difficulty_title');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            //
        });
    }
};
