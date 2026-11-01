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
        Schema::create('place_exploreables', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('place_explore_id');
            $table->morphs('exploreable'); // exploreable_id + exploreable_type
            $table->timestamps();

            $table->foreign('place_explore_id')
                  ->references('id')
                  ->on('place_explores')
                  ->onDelete('cascade');

            $table->unique(['place_explore_id', 'exploreable_id', 'exploreable_type'], 'place_exploreables_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('place_exploreables');
    }
};
