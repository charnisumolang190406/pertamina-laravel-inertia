<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalendarEvent extends Model
{
    protected $guarded = [];

    protected $table = 'calendar_events';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'title', 'description', 'category', 'date'
    ];
}
