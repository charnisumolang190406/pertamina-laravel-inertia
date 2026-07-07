<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mom extends Model
{
    protected $guarded = [];

    protected $table = 'mom';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'fungsi', 'isu', 'tindak_lanjut', 'status', 'statusColor', 'feedback'
    ];
}
