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
        Schema::create('redirect_rules', function (Blueprint $table) {
            $table->id();
            $table->string('source_url')->unique()->index();
            $table->string('destination_url');
            $table->integer('status_code')->default(301);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('redirect_rules');
    }
};
