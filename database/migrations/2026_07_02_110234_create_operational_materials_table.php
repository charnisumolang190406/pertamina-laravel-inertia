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
        Schema::create('operational_materials', function (Blueprint $table) {
            $table->id();
            $table->string('material_code')->nullable()->index();
            $table->string('material_name')->nullable();
            $table->string('category')->nullable();
            $table->integer('quantity')->nullable()->default(0);
            $table->string('unit')->nullable();
            $table->string('location')->nullable();
            $table->bigInteger('unit_price')->nullable()->default(0);
            $table->bigInteger('total_value')->nullable()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operational_materials');
    }
};
