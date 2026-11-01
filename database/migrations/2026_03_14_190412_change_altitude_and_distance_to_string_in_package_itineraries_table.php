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
        Schema::table('package_itineraries', function (Blueprint $table) {
            $table->string('altitude')->nullable()->change();
            $table->string('distance_km')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('package_itineraries', function (Blueprint $table) {
            $table->integer('altitude')->nullable()->change();
            $table->integer('distance_km')->nullable()->change();
        });
    }
};
