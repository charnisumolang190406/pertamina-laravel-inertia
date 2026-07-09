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
use App\Models\Employee;
use App\Models\TadMutation;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $currentYear = (int) date('Y');

        $maleCount = Employee::whereIn('gender', ['Laki-laki', 'L', 'Pria'])->count();
        $femaleCount = Employee::whereIn('gender', ['Perempuan', 'P', 'Wanita'])->count();

        return Inertia::render('Dashboard', [
            'scmList' => Scm::orderBy('id', 'desc')->get(),
            'momList' => Mom::all(),
            'calendarEvents' => CalendarEvent::all(),
            'hcMutations' => HcMutation::orderBy('id', 'desc')->get(),
            'tadWorkers' => HcTad::all(),
            'tadMutations' => TadMutation::orderBy('id', 'desc')->get(),
            'retiredWorkers' => HcRetired::whereBetween('tahun', [$currentYear, $currentYear + 3])
                ->orderBy('tahun')
                ->orderBy('tanggal')
                ->get(),
            'genderStats' => [
                'male' => $maleCount,
                'female' => $femaleCount,
                'total' => $maleCount + $femaleCount,
            ],
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
