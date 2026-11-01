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
        Schema::create('guide_related_guide', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('guide_id');
            $table->unsignedBigInteger('related_guide_id');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('guide_id')->references('id')->on('guides')->onDelete('cascade');
            $table->foreign('related_guide_id')->references('id')->on('related_guides')->onDelete('cascade');

            $table->unique(['guide_id', 'related_guide_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guide_related_guide');
    }
};
