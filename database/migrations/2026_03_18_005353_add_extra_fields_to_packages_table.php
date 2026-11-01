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
            $table->string('duration_days')->nullable()->after('max_altitude');
            $table->integer('active_trekking_days')->nullable()->after('duration_days');
            $table->string('max_altitude_location')->nullable()->after('max_altitude');
            $table->text('difficulty_description')->nullable()->after('difficulty');
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
