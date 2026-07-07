<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TadMutation extends Model
{
    protected $guarded = [];

    protected $table = 'tad_mutations';

    public $incrementing = false;

    protected $primaryKey = 'id';

    protected $fillable = [
        'id', 'bulan', 'nama', 'jenis', 'peran', 'vendor', 'keterangan',
    ];
}
