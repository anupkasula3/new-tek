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
        // Add package_tiers JSON column to packages table
        Schema::table('packages', function (Blueprint $table) {
            $table->json('package_tiers')->nullable()->after('price');
        });

        // Add tier column to package_includes
        Schema::table('package_includes', function (Blueprint $table) {
            $table->string('tier')->nullable()->after('package_id');
        });

        // Add tier column to package_excludes
        Schema::table('package_excludes', function (Blueprint $table) {
            $table->string('tier')->nullable()->after('package_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn('package_tiers');
        });

        Schema::table('package_includes', function (Blueprint $table) {
            $table->dropColumn('tier');
        });

        Schema::table('package_excludes', function (Blueprint $table) {
            $table->dropColumn('tier');
        });
    }
};
