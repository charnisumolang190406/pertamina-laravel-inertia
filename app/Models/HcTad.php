<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HcTad extends Model
{
    protected $guarded = [];

    protected $table = 'hc_tad';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'nama', 'peran', 'vendor', 'status'
    ];
}
