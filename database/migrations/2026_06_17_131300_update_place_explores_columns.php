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
        Schema::table('place_explores', function (Blueprint $table) {
            $table->renameColumn('image', 'featured_image');
            $table->renameColumn('description', 'overview');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('place_explores', function (Blueprint $table) {
            $table->renameColumn('featured_image', 'image');
            $table->renameColumn('overview', 'description');
        });
    }
};
