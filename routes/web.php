<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ScmController;
use App\Http\Controllers\LogistikController;
use App\Http\Controllers\HcController;
use App\Http\Controllers\MomController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ArsipController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\BudgetController;

// Public Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected Authenticated Routes
Route::middleware('auth')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Budget Routes
    Route::delete('/budget/{id}', [BudgetController::class, 'destroy'])->name('budget.destroy');
    Route::post('/budget/clear', [BudgetController::class, 'clear'])->name('budget.clear');
    Route::post('/budget/reset', [BudgetController::class, 'reset'])->name('budget.reset');

    // SCM Routes
    Route::post('/scm', [ScmController::class, 'store'])->name('scm.store');
    Route::delete('/scm/{id}', [ScmController::class, 'destroy'])->name('scm.destroy');
    Route::post('/scm/clear', [ScmController::class, 'clear'])->name('scm.clear');
    Route::post('/scm/reset', [ScmController::class, 'reset'])->name('scm.reset');

    // Logistik - Stok Routes
    Route::delete('/logistik/stok/{id}', [LogistikController::class, 'destroyStok'])->name('logistik.stok.destroy');
    Route::post('/logistik/stok/clear', [LogistikController::class, 'clearStok'])->name('logistik.stok.clear');
    Route::post('/logistik/stok/reset', [LogistikController::class, 'resetStok'])->name('logistik.stok.reset');

    // Logistik - Alat Berat Routes
    Route::delete('/logistik/alat-berat/{id}', [LogistikController::class, 'destroyAlatBerat'])->name('logistik.alat_berat.destroy');
    Route::post('/logistik/alat-berat/clear', [LogistikController::class, 'clearAlatBerat'])->name('logistik.alat_berat.clear');
    Route::post('/logistik/alat-berat/reset', [LogistikController::class, 'resetAlatBerat'])->name('logistik.alat_berat.reset');

    // Logistik - Perbaikan Aset Routes
    Route::delete('/logistik/perbaikan/{id}', [LogistikController::class, 'destroyPerbaikan'])->name('logistik.perbaikan.destroy');
    Route::post('/logistik/perbaikan/clear', [LogistikController::class, 'clearPerbaikan'])->name('logistik.perbaikan.clear');
    Route::post('/logistik/perbaikan/reset', [LogistikController::class, 'resetPerbaikan'])->name('logistik.perbaikan.reset');

    // HC - Lembur TAD Routes
    Route::delete('/hc/lembur/{id}', [HcController::class, 'destroyLemburTad'])->name('hc.lembur.destroy');
    Route::post('/hc/lembur/delete-periode', [HcController::class, 'destroyLemburTadByPeriode'])->name('hc.lembur.destroy_periode');

    // MOM Routes
    Route::post('/mom', [MomController::class, 'store'])->name('mom.store');
    Route::put('/mom/{id}', [MomController::class, 'update'])->name('mom.update');
    Route::delete('/mom/{id}', [MomController::class, 'destroy'])->name('mom.destroy');
    Route::post('/mom/{id}/feedback', [MomController::class, 'feedback'])->name('mom.feedback');

    // Calendar Routes
    Route::post('/calendar', [CalendarController::class, 'store'])->name('calendar.store');
    Route::put('/calendar/{id}', [CalendarController::class, 'update'])->name('calendar.update');
    Route::delete('/calendar/{id}', [CalendarController::class, 'destroy'])->name('calendar.destroy');

    // Arsip / Dokumen Routes
    Route::delete('/arsip/{id}', [ArsipController::class, 'destroyArsip'])->name('arsip.destroy');
    Route::delete('/arsip/log/{id}', [ArsipController::class, 'destroyUploadLog'])->name('arsip.log.destroy');

    // Import Excel Wizard Route
    Route::post('/import', [ImportController::class, 'import'])->name('import');
});
