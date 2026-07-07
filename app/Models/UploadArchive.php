<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UploadArchive extends Model
{
    protected $guarded = [];

    protected $table = 'upload_archive';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'filename', 'fileSize', 'type', 'timestamp', 'rowCount', 'uploadedBy'
    ];
}
