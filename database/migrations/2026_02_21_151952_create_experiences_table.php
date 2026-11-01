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
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('icon')->nullable();
            $table->string('slug')->unique();
            $table->json('details')->nullable();
            $table->json('popular_adventures')->nullable();
            $table->json('places_explore')->nullable();
            $table->json('best_time')->nullable();
            $table->json('advantages')->nullable();
            $table->json('cta')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
