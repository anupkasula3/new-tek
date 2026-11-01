<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('package_itineraries', function (Blueprint $table) {
            $table->string('accommodation')->nullable()->after('altitude');
            $table->string('meals')->nullable()->after('accommodation');
        });
    }

    public function down(): void
    {
        Schema::table('package_itineraries', function (Blueprint $table) {
            $table->dropColumn(['accommodation', 'meals']);
        });
    }
};
