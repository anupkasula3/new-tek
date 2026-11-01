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
            $table->string('order_no')->nullable()->unique()->after('status');
            $table->decimal('amount', 10, 2)->nullable()->after('order_no');
            $table->string('currency')->default('NPR')->after('amount');
            // 'status' is already present in 2025_12_31_173458_create_bookings_table.php
            // we will just reuse it and set it to 'paid', 'failed', 'cancelled'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['order_no', 'amount', 'currency']);
        });
    }
};
