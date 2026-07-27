<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index()
    {
        // Get the latest activity logs with user info
        $logs = Activity::with('causer')->latest()->paginate(20);

        return Inertia::render('ActivityLog/Index', [
            'logs' => $logs
        ]);
    }
}
