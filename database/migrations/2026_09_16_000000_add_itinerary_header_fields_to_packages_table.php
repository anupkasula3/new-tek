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
            $table->string('itinerary_title')->nullable()->after('experience_note');
            $table->string('itinerary_subtitle')->nullable()->after('itinerary_title');
            $table->text('itinerary_description')->nullable()->after('itinerary_subtitle');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn(['itinerary_title', 'itinerary_subtitle', 'itinerary_description']);
        });
    }
};
