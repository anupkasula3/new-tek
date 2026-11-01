<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('order_no')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('currency')->default('NPR');
            $table->string('status')->default('pending');
            $table->json('request_payload')->nullable();
            $table->json('response_payload')->nullable();
            $table->json('callback_payload')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_logs');
    }
};
