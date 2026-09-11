<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IctMaintenance extends Model
{
    use HasFactory;

    protected $table = 'ict_maintenances';

    protected $fillable = [
        'kegiatan',
        'tahun',
        'bulan',
        'minggu',
        'tipe',
        'status',
        'keterangan',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'bulan' => 'integer',
        'minggu' => 'integer',
    ];
}
