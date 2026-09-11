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
        Schema::create('risk_registers', function (Blueprint $table) {
            $table->id();
            $table->integer('no')->nullable();
            $table->string('kode')->nullable();
            $table->text('deskripsi')->nullable();
            $table->text('akar')->nullable();
            $table->integer('probInherent')->default(1);
            $table->integer('dampakInherent')->default(1);
            $table->integer('bobotInherent')->default(1);
            $table->string('peringkatInherent')->nullable();
            $table->string('strategi')->nullable();
            $table->integer('probResidual')->default(1);
            $table->integer('dampakResidual')->default(1);
            $table->string('peringkatResidual')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('risk_registers');
    }
};
