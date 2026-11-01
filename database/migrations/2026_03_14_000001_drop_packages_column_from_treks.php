<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('treks', function (Blueprint $table) {
            if (Schema::hasColumn('treks', 'packages')) {
                $table->dropColumn('packages');
            }
        });
    }

    public function down(): void
    {
        Schema::table('treks', function (Blueprint $table) {
            $table->json('packages')->nullable();
        });
    }
};
