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
        Schema::table('budget_details', function (Blueprint $table) {
            $table->string('fungsi', 100)->nullable()->after('fundCent');
            $table->bigInteger('commitment')->default(0)->after('consumed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('budget_details', function (Blueprint $table) {
            $table->dropColumn(['fungsi', 'commitment']);
        });
    }
};
