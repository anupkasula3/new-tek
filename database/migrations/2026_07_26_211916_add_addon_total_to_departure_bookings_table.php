<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('departure_bookings', function (Blueprint $table) {
            $table->decimal('addon_total', 10, 2)->default(0)->after('total_amount');
            $table->json('addon_selections')->nullable()->after('addon_total');
        });
    }

    public function down(): void
    {
        Schema::table('departure_bookings', function (Blueprint $table) {
            $table->dropColumn(['addon_total', 'addon_selections']);
        });
    }
};
