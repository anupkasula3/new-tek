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
        Schema::table('package_includes', function (Blueprint $table) {
            \Illuminate\Support\Facades\DB::statement('ALTER TABLE package_includes MODIFY title TEXT NULL');
        });
        Schema::table('package_excludes', function (Blueprint $table) {
            \Illuminate\Support\Facades\DB::statement('ALTER TABLE package_excludes MODIFY title TEXT NULL');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('package_includes', function (Blueprint $table) {
            $table->string('title')->change();
        });
        Schema::table('package_excludes', function (Blueprint $table) {
            $table->string('title')->change();
        });
    }
};
