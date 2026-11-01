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
        Schema::table('payment_logs', function (Blueprint $table) {
            $table->dropForeign(['booking_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_logs', function (Blueprint $table) {
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
        });
    }
};
