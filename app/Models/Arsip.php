<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Arsip extends Model
{
    protected $guarded = [];

    protected $table = 'arsip';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'nomor', 'nama', 'kategori', 'tanggal', 'file_path', 'uploaded_by'
    ];
}
