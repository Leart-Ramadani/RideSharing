<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rides', function (Blueprint $table) {
            // The calculated total fare for the ride (filled on completion)
            $table->decimal('total_fare', 10, 2)->nullable()->after('status');
            // Link back to the original ride request that created this ride
            $table->foreignId('ride_request_id')->nullable()
                ->constrained('ride_requests')
                ->nullOnDelete()
                ->after('promo_code_id');
        });
    }

    public function down(): void
    {
        Schema::table('rides', function (Blueprint $table) {
            $table->dropForeign(['ride_request_id']);
            $table->dropColumn(['total_fare', 'ride_request_id']);
        });
    }
};
