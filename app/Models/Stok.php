<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stok extends Model
{
    protected $guarded = [];

    protected $table = 'stok';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'nama', 'fungsi', 'masuk', 'keluar', 'saldo', 'status'
    ];
}
