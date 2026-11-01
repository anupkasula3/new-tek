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
        Schema::table('departure_bookings', function (Blueprint $table) {
            $table->string('order_no')->unique()->nullable()->after('id');
            $table->decimal('amount', 15, 2)->nullable()->after('seats_booked');
            $table->decimal('total_amount', 15, 2)->nullable()->after('amount');
            $table->decimal('remaining_balance', 15, 2)->nullable()->after('total_amount');
            $table->string('currency', 10)->default('USD')->after('remaining_balance');
            $table->string('payment_type')->nullable()->after('currency'); // full, advance
            $table->string('status')->default('pending')->after('payment_type'); // pending, completed, failed
            $table->string('phone')->nullable()->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('departure_bookings', function (Blueprint $table) {
            $table->dropColumn([
                'order_no', 'amount', 'total_amount', 'remaining_balance', 
                'currency', 'payment_type', 'status', 'phone'
            ]);
        });
    }
};
