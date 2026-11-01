<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('treks', function (Blueprint $table) {
            if (Schema::hasColumn('treks', 'destination_slug')) {
                $table->dropColumn('destination_slug');
            }
        });
    }

    public function down(): void
    {
        Schema::table('treks', function (Blueprint $table) {
            if (!Schema::hasColumn('treks', 'destination_slug')) {
                $table->string('destination_slug')->nullable();
            }
        });
    }
};
