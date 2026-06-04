<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fares', function (Blueprint $table) {
            $table->id();
            $table->string('service_type');
            $table->decimal('base_price', 8, 2);
            $table->decimal('price_per_km', 8, 2);
            $table->decimal('price_per_min', 8, 2);
            $table->decimal('peak_hour_rate', 8, 2)->default(1.00);
            $table->string('status')->default('Active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fares');
    }
};
