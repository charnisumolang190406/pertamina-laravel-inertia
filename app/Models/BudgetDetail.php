<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class BudgetDetail extends Model
{
    use LogsActivity;

    protected $guarded = [];

    protected $table = 'budget_details';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'fundCent', 'name', 'commitItem', 'text', 'budget', 'consumed', 'actual', 'available', 'kategori'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logUnguarded()
            ->logOnlyDirty();
    }
}
