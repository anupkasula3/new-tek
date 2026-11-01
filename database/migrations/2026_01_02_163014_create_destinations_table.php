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
          Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nepal, Everest, etc.
            $table->string('slug')->unique();
            $table->string('region')->nullable(); // South Asia • Himalayas
            $table->string('country')->nullable(); // Nepal
            $table->string('banner_image')->nullable();
            $table->text('description')->nullable(); // General description
            $table->json('banner_accordion_tags')->nullable(); // Flexible details like Highest Peak, Capital, Population
            $table->json('destination_details')->nullable();
            $table->string('best_season_title')->nullable(); // Kathmandu
            $table->json('best_season_accordions')->nullable(); // Flexible details like Highest Peak, Capital, Population
            $table->string('must_visit_title')->nullable(); // Kathmandu
            $table->json('must_visit_accordions')->nullable(); // Flexible details like Highest Peak, Capital, Population
            $table->string('practical_information_title')->nullable(); // Practical Information
            $table->json('practical_information_accordions')->nullable(); // Flexible details like Highest Peak, Capital, Population
            $table->json('essential_tips')->nullable();
            $table->json('cultural_etiquette')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};
