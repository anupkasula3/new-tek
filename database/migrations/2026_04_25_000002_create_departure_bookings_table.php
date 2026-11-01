<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departure_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('departure_id')->constrained('departures')->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->unsignedInteger('seats_booked');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departure_bookings');
    }
};
