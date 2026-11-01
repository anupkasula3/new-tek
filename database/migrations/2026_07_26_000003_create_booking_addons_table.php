<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_addons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('addon_package_id')->constrained('addon_packages')->restrictOnDelete();
            $table->foreignId('addon_item_id')->constrained('addon_items')->restrictOnDelete();
            $table->decimal('price_at_booking', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_addons');
    }
};
