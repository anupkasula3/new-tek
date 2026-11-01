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
        Schema::create('package_seasons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained()->cascadeOnDelete();

            $table->string('season');
            $table->string('months');
            $table->string('day_temp');
            $table->string('night_temp');
            $table->longText('description');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_seasons');
    }
};
