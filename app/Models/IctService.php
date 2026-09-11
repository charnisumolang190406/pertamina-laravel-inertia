<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IctService extends Model
{
    use HasFactory;

    protected $table = 'ict_services';

    protected $fillable = [
        'bulan',
        'tahun',
        'kategori',
        'jumlah',
        'keterangan',
        'sumber_url',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'jumlah' => 'integer',
    ];
}
