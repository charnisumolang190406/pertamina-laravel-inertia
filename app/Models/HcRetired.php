<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HcRetired extends Model
{
    protected $guarded = [];

    protected $table = 'hc_retired';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'nama', 'jabatan', 'tahun', 'tanggal', 'keterangan'
    ];
}
