<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('departures', function (Blueprint $table) {
            // Drop existing unique index on date
            // The index name is usually departures_date_unique
            $table->dropUnique(['date']);
            
            // Add composite unique index
            $table->unique(['date', 'package_id']);
        });
    }

    public function down(): void
    {
        Schema::table('departures', function (Blueprint $table) {
            $table->dropUnique(['date', 'package_id']);
            $table->unique('date');
        });
    }
};
