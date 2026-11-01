<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departures', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            $table->decimal('price', 10, 2);
            $table->unsignedInteger('total_seats');
            $table->unsignedInteger('available_seats');
            $table->enum('status', ['available', 'limited', 'fully_booked'])->default('available');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departures');
    }
};
