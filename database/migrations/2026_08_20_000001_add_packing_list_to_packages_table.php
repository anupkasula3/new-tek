<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->json('packing_list')->nullable()->after('package_tiers');
            $table->text('packing_list_note')->nullable()->after('packing_list');
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn(['packing_list', 'packing_list_note']);
        });
    }
};
