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
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('opening_hours_days')->nullable()->after('map_embed_url');
            $table->string('opening_hours_time')->nullable()->after('opening_hours_days');
            $table->string('opening_hours_off_day')->nullable()->after('opening_hours_time');
            $table->text('location_info')->nullable()->after('opening_hours_off_day');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn(['opening_hours_days', 'opening_hours_time', 'opening_hours_off_day', 'location_info']);
        });
    }
};
