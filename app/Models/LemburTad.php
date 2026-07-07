<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LemburTad extends Model
{
    protected $guarded = [];

    protected $table = 'lembur_tad';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'nopok', 'nama', 'jabatan', 'fungsi', 'upah', 'jamLembur', 'lemburVal', 'periode'
    ];
}
