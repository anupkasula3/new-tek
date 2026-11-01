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
            $table->string('quick_summary_title')->nullable()->after('experience_subtitle');
            $table->string('experience_note_title')->nullable()->after('experience_note');
            $table->string('itinerary_note_title')->nullable()->after('itinerary_note');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn(['quick_summary_title', 'experience_note_title', 'itinerary_note_title']);
        });
    }
};
