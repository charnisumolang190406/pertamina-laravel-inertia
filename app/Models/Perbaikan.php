<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Perbaikan extends Model
{
    protected $guarded = [];

    protected $table = 'perbaikan';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'lokasi', 'pekerjaan', 'estimasi', 'realisasi', 'status', 'keterangan'
    ];
}
