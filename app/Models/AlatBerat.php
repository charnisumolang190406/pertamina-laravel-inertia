<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AlatBerat extends Model
{
    protected $guarded = [];

    protected $table = 'alat_berat';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'nopol', 'tahun', 'jenis', 'alokasi', 'merk', 'model', 'stnk', 'pajak', 'kir', 'status', 'kondisi'
    ];
}
