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

        // ─── DYNAMIC NOTIFICATIONS FROM REAL DATABASE EVENTS ───
        $notifications = [];
        $notifId = 1;

        // 1. Real Upload/Import Archive events
        $recentUploads = UploadArchive::latest()->take(3)->get();
        foreach ($recentUploads as $upload) {
            $notifications[] = [
                'id' => $notifId++,
                'type' => 'upload',
                'title' => 'Impor Data Berhasil',
                'text' => ($upload->uploaded_by ?: 'Admin') . ' mengimpor ' . ($upload->rowCount ?: 'beberapa') . ' baris data (' . $upload->filename . ').',
                'time' => $upload->created_at ? $upload->created_at->diffForHumans() : ($upload->timestamp ?: 'Baru saja'),
                'read' => false,
            ];
        }

        // 2. Real SCM Contracts expiring within 6 months
        $expiringContracts = Scm::where('status', 'Aktif')
            ->whereDate('selesai', '<=', now()->addMonths(6))
            ->orderBy('selesai', 'asc')
            ->take(2)
            ->get();
        foreach ($expiringContracts as $contract) {
            $endDate = \Carbon\Carbon::parse($contract->selesai);
            $daysLeft = (int) now()->diffInDays($endDate, false);
            $daysText = $daysLeft > 0 ? "tersisa {$daysLeft} hari lagi" : "telah berakhir";
            $notifications[] = [
                'id' => $notifId++,
                'type' => 'contract',
                'title' => 'Jadwal Kontrak SCM',
                'text' => "Kontrak {$contract->vendor} ('{$contract->nama}') {$daysText} (berakhir " . $endDate->format('d M Y') . ").",
                'time' => $endDate->format('d M Y'),
                'read' => false,
            ];
        }

        // 3. Real MOM with Feedback
        $momFeedback = Mom::whereNotNull('feedback')->latest('updated_at')->take(2)->get();
        foreach ($momFeedback as $m) {
            $notifications[] = [
                'id' => $notifId++,
                'type' => 'mom',
                'title' => 'Feedback MOM ' . $m->fungsi,
                'text' => "Isu '{$m->isu}': " . \Illuminate\Support\Str::limit($m->feedback, 90),
                'time' => $m->updated_at ? $m->updated_at->diffForHumans() : 'Terkini',
                'read' => false,
            ];
        }

        // 4. Low Material Stock Warnings
        $lowStocks = Stok::where('saldo', '<=', 5)->take(2)->get();
        foreach ($lowStocks as $stok) {
            $notifications[] = [
                'id' => $notifId++,
                'type' => 'stock',
                'title' => 'Peringatan Stok Rendah',
                'text' => "Stok material '{$stok->nama}' tersisa {$stok->saldo} unit ({$stok->fungsi}).",
                'time' => 'Inventori Aktif',
                'read' => false,
            ];
        }

        // 5. Recent Activity Logs if available
        $recentActivities = \Spatie\Activitylog\Models\Activity::with('causer')->latest()->take(2)->get();
        foreach ($recentActivities as $act) {
            $actorName = $act->causer ? ($act->causer->fullName ?: $act->causer->name) : 'Admin Sistem';
            $subjectName = class_basename($act->subject_type);
            $notifications[] = [
                'id' => $notifId++,
                'type' => 'activity',
                'title' => 'Perubahan Data ' . $subjectName,
                'text' => "{$actorName} melakukan " . ($act->event === 'created' ? 'penambahan' : ($act->event === 'updated' ? 'pembaruan' : 'penghapusan')) . " pada {$subjectName}.",
                'time' => $act->created_at ? $act->created_at->diffForHumans() : 'Baru saja',
                'read' => false,
            ];
        }

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
            'notifications' => $notifications,
        ]);
    }
}
