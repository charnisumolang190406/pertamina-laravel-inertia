<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Scm extends Model
{
    use LogsActivity;

    protected $guarded = [];

    protected $table = 'scm';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'nomor', 'nama', 'vendor', 'nilai', 'mulai', 'selesai', 'progres', 'status', 'fungsi'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logUnguarded()
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Kontrak telah di-{$eventName}");
    }
}
