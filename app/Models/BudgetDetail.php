<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BudgetDetail extends Model
{
    protected $guarded = [];

    protected $table = 'budget_details';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'fundCent', 'name', 'commitItem', 'text', 'budget', 'consumed', 'actual', 'available', 'kategori'
    ];
}
