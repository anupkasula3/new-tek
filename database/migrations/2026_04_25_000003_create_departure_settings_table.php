<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departure_settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value');
            $table->timestamps();
        });

        // Seed default settings
        DB::table('departure_settings')->insert([
            ['key' => 'limited_threshold', 'value' => '5', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('departure_settings');
    }
};
