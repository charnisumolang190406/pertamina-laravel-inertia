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
use App\Models\BbmStock;
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
            'retiredWorkers' => Employee::where('age', '>=', 53)
                ->get()
                ->map(function ($emp) use ($currentYear) {
                    $tahunPensiun = $currentYear + (56 - $emp->age);
                    return [
                        'id' => $emp->id,
                        'nama' => $emp->name,
                        'jabatan' => $emp->position,
                        'umur_pensiun' => 56,
                        'tahun' => $tahunPensiun,
                        'tanggal' => $tahunPensiun . '-12-31', // Estimasi akhir tahun karena tidak ada data tanggal lahir lengkap
                        'keterangan' => 'Proyeksi Otomatis dari Master Data (Umur saat ini: ' . $emp->age . ' Tahun)',
                    ];
                })
                ->filter(function ($emp) use ($currentYear) {
                    return $emp['tahun'] >= $currentYear && $emp['tahun'] <= $currentYear + 3;
                })
                ->sortBy(['tahun', 'tanggal'])
                ->values(),
            'organikWorkers' => Employee::all(),
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
            'bbmList' => BbmStock::all(),
        ]);
    }
}
