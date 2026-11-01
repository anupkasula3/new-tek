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
            $table->string('country')->nullable()->change();
            $table->string('region')->nullable()->change();
            $table->string('duration_days')->nullable()->change();
            $table->decimal('price', 10, 2)->nullable()->change();
            $table->string('difficulty')->nullable()->change();
            $table->longText('description')->nullable()->change();
            $table->longText('experience')->nullable()->change();
            
            // Note: pax_pricing, banner_accordion_tags are likely json
            $table->json('pax_pricing')->nullable()->change();
            $table->json('banner_accordion_tags')->nullable()->change();
            
            $table->string('banner_image')->nullable()->change();
            $table->string('map_image')->nullable()->change();
            $table->string('experience_title')->nullable()->change();
            $table->string('experience_subtitle')->nullable()->change();
            
            $table->string('difficulty_title')->nullable()->change();
            $table->string('difficulty_subtitle')->nullable()->change();
            $table->text('difficulty_description')->nullable()->change();
            $table->string('walking_title')->nullable()->change();
            $table->string('walking_subtitle')->nullable()->change();
            $table->string('altitude_title')->nullable()->change();
            $table->string('altitude_subtitle')->nullable()->change();
            $table->string('duration_title')->nullable()->change();
            $table->string('duration_subtitle')->nullable()->change();
            $table->string('terrain_title')->nullable()->change();
            $table->string('terrain_subtitle')->nullable()->change();
            $table->decimal('physical_fitness', 8, 2)->nullable()->change();
            $table->decimal('technical_skill', 8, 2)->nullable()->change();
            $table->decimal('altitude_factor', 8, 2)->nullable()->change();
            $table->decimal('endurance', 8, 2)->nullable()->change();
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
