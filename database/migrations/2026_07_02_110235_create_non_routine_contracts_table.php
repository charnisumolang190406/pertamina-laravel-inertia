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
        Schema::create('non_routine_contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_number')->nullable();
            $table->string('vendor_name')->nullable();
            $table->string('job_description')->nullable();
            $table->bigInteger('contract_value')->nullable()->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('non_routine_contracts');
    }
};
