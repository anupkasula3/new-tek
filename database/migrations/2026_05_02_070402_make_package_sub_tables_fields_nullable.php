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
            $table->integer('day')->nullable()->change();
            $table->string('title')->nullable()->change();
            $table->longText('description')->nullable()->change();
        });

        Schema::table('package_includes', function (Blueprint $table) {
            $table->string('title')->nullable()->change();
        });

        Schema::table('package_excludes', function (Blueprint $table) {
            $table->string('title')->nullable()->change();
        });

        Schema::table('package_seasons', function (Blueprint $table) {
            $table->string('season')->nullable()->change();
            $table->string('subtitle')->nullable()->change();
            $table->string('temperature')->nullable()->change();
            $table->string('weather')->nullable()->change();
            $table->longText('description')->nullable()->change();
        });

        Schema::table('package_useful_infos', function (Blueprint $table) {
            $table->string('title')->nullable()->change();
            $table->longText('content')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse for this fix
    }
};
