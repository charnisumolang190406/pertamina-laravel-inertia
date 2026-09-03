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
use App\Models\FinancialPerformance;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $currentYear = (int) date('Y');

        if (!Schema::hasTable('financial_performances')) {
            Schema::create('financial_performances', function (Blueprint $table) {
                $table->id();
                $table->integer('year')->unique();
                $table->decimal('revenue', 15, 2)->default(0);
                $table->decimal('cost', 15, 2)->default(0);
                $table->decimal('depreciation', 15, 2)->default(0);
                $table->decimal('net_profit', 15, 2)->default(0);
                $table->decimal('abo', 15, 2)->default(0);
                $table->decimal('ebitda', 15, 2)->default(0);
                $table->decimal('cost_per_kwh', 8, 2)->default(0);
                $table->timestamps();
            });
        }

        $maleCount = Employee::whereIn('gender', ['Laki-laki', 'L', 'Pria'])->count();
        $femaleCount = Employee::whereIn('gender', ['Perempuan', 'P', 'Wanita'])->count();

        return Inertia::render('Dashboard', [
            'scmList' => Scm::orderBy('id', 'desc')->get(),
            'calendarEvents' => CalendarEvent::all(),
            'hcMutations' => HcMutation::orderBy('id', 'desc')->get(),
            'tadWorkers' => HcTad::all(),
            'retiredWorkers' => Employee::all()
                ->map(function ($emp) use ($currentYear) {
                    if (!empty($emp->tanggal_lahir)) {
                        $dob = \Carbon\Carbon::parse($emp->tanggal_lahir);
                        $retirementDate = $dob->copy()->addYears(56);
                        $tahunPensiun = $retirementDate->year;
                        
                        return [
                            'id' => $emp->id,
                            'nama' => $emp->name,
                            'jabatan' => $emp->position,
                            'umur_pensiun' => 56,
                            'tahun' => $tahunPensiun,
                            'tanggal' => $retirementDate->format('Y-m-d'),
                            'keterangan' => 'Sesuai Ulang Tahun (' . $dob->format('d M Y') . ')',
                        ];
                    } else {
                        $tahunPensiun = $currentYear + (56 - $emp->age);
                        return [
                            'id' => $emp->id,
                            'nama' => $emp->name,
                            'jabatan' => $emp->position,
                            'umur_pensiun' => 56,
                            'tahun' => $tahunPensiun,
                            'tanggal' => $tahunPensiun . '-12-31',
                            'keterangan' => 'Estimasi akhir tahun berdasarkan umur',
                        ];
                    }
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
            'financialPerformances' => FinancialPerformance::orderBy('year', 'asc')->get(),
        ]);
    }
}
