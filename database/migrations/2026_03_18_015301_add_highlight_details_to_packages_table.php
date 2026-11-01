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
            if (!Schema::hasColumn('packages', 'walking_title')) {
                $table->string('walking_title')->nullable()->after('distance_km');
            }
            if (!Schema::hasColumn('packages', 'walking_subtitle')) {
                $table->string('walking_subtitle')->nullable()->after('walking_title');
            }
            
            if (!Schema::hasColumn('packages', 'altitude_title')) {
                $table->string('altitude_title')->nullable()->after('walking_subtitle');
            }
            if (!Schema::hasColumn('packages', 'altitude_subtitle')) {
                $table->string('altitude_subtitle')->nullable()->after('altitude_title');
            }
            
            if (!Schema::hasColumn('packages', 'duration_title')) {
                $table->string('duration_title')->nullable()->after('altitude_subtitle');
            }
            if (!Schema::hasColumn('packages', 'duration_subtitle')) {
                $table->string('duration_subtitle')->nullable()->after('duration_title');
            }
            
            if (!Schema::hasColumn('packages', 'terrain_title')) {
                $table->string('terrain_title')->nullable()->after('duration_subtitle');
            }
            if (!Schema::hasColumn('packages', 'terrain_subtitle')) {
                $table->string('terrain_subtitle')->nullable()->after('terrain_title');
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
