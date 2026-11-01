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
        Schema::table('bookings', function (Blueprint $table) {
            $table->json('traveller_details')->nullable()->after('phone');
        });
        Schema::table('departure_bookings', function (Blueprint $table) {
            $table->json('traveller_details')->nullable()->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('traveller_details');
        });
        Schema::table('departure_bookings', function (Blueprint $table) {
            $table->dropColumn('traveller_details');
        });
    }
};
