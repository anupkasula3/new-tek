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
            $table->string('walking_per_day')->nullable()->after('difficulty');
            $table->string('terrain')->nullable()->after('walking_per_day');
            $table->integer('physical_fitness')->default(0)->after('terrain');
            $table->integer('technical_skill')->default(0)->after('physical_fitness');
            $table->integer('altitude_factor')->default(0)->after('technical_skill');
            $table->integer('endurance')->default(0)->after('altitude_factor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn([
                'walking_per_day',
                'terrain',
                'physical_fitness',
                'technical_skill',
                'altitude_factor',
                'endurance',
            ]);
        });
    }
};
