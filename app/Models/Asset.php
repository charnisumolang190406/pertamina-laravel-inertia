<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $guarded = [];

    protected $table = 'assets';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'nama', 'kategori', 'brand', 'serial', 'lokasi', 'status'
    ];
}
