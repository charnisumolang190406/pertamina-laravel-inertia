<?php

namespace App\Http\Controllers;

use App\Models\Scm;
use App\Models\Mom;
use App\Models\CalendarEvent;
use App\Models\HcMutation;
use App\Models\HcTad;
use App\Models\HcRetired;
use App\Models\AlatBerat;
use App\Models\Perbaikan;
use App\Models\LemburTad;
use App\Models\BudgetDetail;
use App\Models\Stok;
use App\Models\Arsip;
use App\Models\Asset;
use App\Models\UploadArchive;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'scmList' => Scm::orderBy('id', 'desc')->get(),
            'momList' => Mom::all(),
            'calendarEvents' => CalendarEvent::all(),
            'hcMutations' => HcMutation::orderBy('id', 'desc')->get(),
            'tadWorkers' => HcTad::all(),
            'retiredWorkers' => HcRetired::orderBy('tahun', 'desc')->get(),
            'alatBeratList' => AlatBerat::all(),
            'perbaikanList' => Perbaikan::orderBy('id', 'desc')->get(),
            'lemburTadList' => LemburTad::orderBy('id', 'desc')->get(),
            'budgetDetailsList' => BudgetDetail::all(),
            'stokList' => Stok::all(),
            'arsipList' => Arsip::orderBy('id', 'desc')->get(),
            'assetList' => Asset::all(),
            'uploadArchive' => UploadArchive::orderBy('id', 'desc')->get(),
        ]);
    }
}
