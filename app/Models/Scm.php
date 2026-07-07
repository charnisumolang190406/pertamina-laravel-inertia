<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scm extends Model
{
    protected $guarded = [];

    protected $table = 'scm';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'nomor', 'nama', 'vendor', 'nilai', 'mulai', 'selesai', 'progres', 'status', 'fungsi'
    ];
}
