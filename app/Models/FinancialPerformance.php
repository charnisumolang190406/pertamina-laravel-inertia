<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinancialPerformance extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'revenue',
        'cost',
        'depreciation',
        'net_profit',
        'abo',
        'ebitda',
        'cost_per_kwh',
    ];
}
