<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HcMutation extends Model
{
    protected $guarded = [];

    protected $table = 'hc_mutations';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'bulan', 'nama', 'jenis', 'fungsi', 'keterangan'
    ];
}
