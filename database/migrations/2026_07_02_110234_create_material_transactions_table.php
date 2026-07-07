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
        Schema::create('material_transactions', function (Blueprint $table) {
            $table->id();
            $table->date('transaction_date')->nullable();
            $table->string('material_code')->nullable()->index();
            $table->string('transaction_type')->nullable();
            $table->integer('quantity_in')->nullable()->default(0);
            $table->integer('quantity_out')->nullable()->default(0);
            $table->integer('beginning_balance')->nullable()->default(0);
            $table->integer('ending_balance')->nullable()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_transactions');
    }
};
