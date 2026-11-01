<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('addon_packages', function (Blueprint $table) {
            $table->dropForeign(['package_id']);
            $table->foreignId('package_id')->nullable()->change();
            $table->foreign('package_id')->references('id')->on('packages')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('addon_packages', function (Blueprint $table) {
            $table->dropForeign(['package_id']);
            $table->foreignId('package_id')->nullable(false)->change();
            $table->foreign('package_id')->references('id')->on('packages')->cascadeOnDelete();
        });
    }
};
