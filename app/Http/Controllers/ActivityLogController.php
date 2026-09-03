<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with('causer')->latest();

        // Filter by event (created, updated, deleted)
        if ($request->filled('event') && $request->input('event') !== 'all') {
            $query->where('event', $request->input('event'));
        }

        // Filter by search keyword
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('properties', 'like', "%{$search}%")
                  ->orWhere('subject_type', 'like', "%{$search}%")
                  ->orWhereHas('causer', function ($cq) use ($search) {
                      $cq->where('username', 'like', "%{$search}%")
                         ->orWhere('fullName', 'like', "%{$search}%")
                         ->orWhere('role', 'like', "%{$search}%");
                  });
            });
        }

        $logs = $query->paginate(15)->withQueryString();

        // Transform collection to provide rich helper fields
        $logs->getCollection()->transform(function ($log) {
            $subjectClass = $log->subject_type ? class_basename($log->subject_type) : null;
            $attrs = $log->properties['attributes'] ?? [];
            $old = $log->properties['old'] ?? [];

            // 1. Resolve Actor Information
            $causer = $log->causer;
            $actorName = $causer ? ($causer->fullName ?: $causer->name) : ($log->properties['uploaded_by'] ?? 'Admin Sistem');
            $actorRole = $causer ? $causer->role : 'Administrator Sistem';
            $actorInitials = $causer ? ($causer->initials ?: strtoupper(substr($actorName, 0, 2))) : 'AS';

            // 2. Resolve Affected Data (Module & Entity Name)
            $moduleName = 'Sistem';
            $moduleCategory = 'General';
            $itemIdentifier = $log->subject_id ? "ID #{$log->subject_id}" : '-';

            if ($subjectClass === 'BudgetDetail') {
                $kategori = strtoupper($attrs['kategori'] ?? $old['kategori'] ?? 'ABO');
                if ($kategori === 'ABI') {
                    $moduleName = 'Budgeting — WBS Element (ABI)';
                    $moduleCategory = 'Budgeting';
                } else {
                    $moduleName = 'Budgeting — Cost Center (ABO)';
                    $moduleCategory = 'Budgeting';
                }
                $itemIdentifier = $attrs['name'] ?? $attrs['text'] ?? $attrs['fundCent'] ?? $itemIdentifier;
            } elseif ($subjectClass === 'Scm') {
                $moduleName = 'SCM — Manajemen Kontrak';
                $moduleCategory = 'SCM';
                $itemIdentifier = $attrs['nama'] ?? $attrs['nomor'] ?? $itemIdentifier;
            } elseif ($subjectClass === 'Stok') {
                $moduleName = 'Logistik — Stok Material';
                $moduleCategory = 'Logistik';
                $itemIdentifier = $attrs['deskripsi'] ?? $attrs['item_number'] ?? $itemIdentifier;
            } elseif ($subjectClass === 'AlatBerat') {
                $moduleName = 'Logistik — Alat Berat & Armada';
                $moduleCategory = 'Logistik';
                $itemIdentifier = ($attrs['jenis'] ?? '') . ' ' . ($attrs['merk'] ?? '');
            } elseif ($subjectClass === 'Perbaikan') {
                $moduleName = 'Facility — Perbaikan Rumah Dinas';
                $moduleCategory = 'Facility';
                $itemIdentifier = ($attrs['pekerjaan'] ?? '') . ' (' . ($attrs['lokasi'] ?? '') . ')';
            } elseif ($subjectClass === 'LemburTad') {
                $moduleName = 'Human Capital — Lembur TAD';
                $moduleCategory = 'Human Capital';
                $itemIdentifier = ($attrs['nama'] ?? '') . ' (' . ($attrs['periode'] ?? '') . ')';
            } elseif ($subjectClass === 'Employee') {
                $moduleName = 'Human Capital — Pegawai Organik';
                $moduleCategory = 'Human Capital';
                $itemIdentifier = $attrs['name'] ?? $attrs['employee_id'] ?? $itemIdentifier;
            } elseif ($subjectClass === 'HcTad') {
                $moduleName = 'Human Capital — Tenaga Alih Daya (TAD)';
                $moduleCategory = 'Human Capital';
                $itemIdentifier = $attrs['nama'] ?? $itemIdentifier;
            } elseif ($subjectClass === 'HcRetired') {
                $moduleName = 'Human Capital — Proyeksi Pensiun';
                $moduleCategory = 'Human Capital';
                $itemIdentifier = $attrs['nama'] ?? $itemIdentifier;
            } elseif ($subjectClass === 'HcMutation' || $subjectClass === 'TadMutation') {
                $moduleName = 'Human Capital — Mutasi Pegawai';
                $moduleCategory = 'Human Capital';
                $itemIdentifier = ($attrs['nama'] ?? '') . ' (' . ($attrs['jenis'] ?? '') . ')';
            } elseif ($subjectClass === 'Mom') {
                $moduleName = 'Manajemen — MOM & Notulen Rapat';
                $moduleCategory = 'MOM';
                $itemIdentifier = ($attrs['isu'] ?? '') . ' (' . ($attrs['fungsi'] ?? '') . ')';
            } elseif ($subjectClass === 'Arsip' || $subjectClass === 'UploadArchive') {
                $moduleName = 'Dokumen & Arsip Laporan';
                $moduleCategory = 'Arsip';
                $itemIdentifier = $attrs['nama'] ?? $attrs['filename'] ?? $itemIdentifier;
            } elseif ($subjectClass === 'CalendarEvent') {
                $moduleName = 'Kalender & Jadwal Agenda';
                $moduleCategory = 'Calendar';
                $itemIdentifier = $attrs['title'] ?? $itemIdentifier;
            } elseif ($subjectClass === 'FinancialPerformance') {
                $moduleName = 'Finansial — Kinerja Tahunan';
                $moduleCategory = 'Finansial';
                $itemIdentifier = 'Tahun ' . ($attrs['year'] ?? '');
            }

            // 3. Creative & Concise Change Summary
            $summaryBadge = '+1 Data';
            $summaryText = '';
            $keyHighlights = [];

            if ($log->event === 'created') {
                $summaryBadge = '+1 Data Baru';
                $summaryText = "Menambahkan entri baru \"{$itemIdentifier}\"";
                
                if (isset($attrs['budget']) && $attrs['budget'] > 0) {
                    $keyHighlights[] = 'Plafon: Rp ' . number_format($attrs['budget'], 0, ',', '.');
                }
                if (isset($attrs['actual']) && $attrs['actual'] > 0) {
                    $keyHighlights[] = 'Realisasi: Rp ' . number_format($attrs['actual'], 0, ',', '.');
                }
                if (isset($attrs['nilai']) && $attrs['nilai'] > 0) {
                    $keyHighlights[] = 'Nilai: Rp ' . number_format($attrs['nilai'], 0, ',', '.');
                }
                if (isset($attrs['stok'])) {
                    $keyHighlights[] = 'Stok: ' . $attrs['stok'] . ' ' . ($attrs['uom'] ?? 'PCS');
                }
                if (isset($attrs['jamLembur'])) {
                    $keyHighlights[] = 'Jam Lembur: ' . $attrs['jamLembur'] . ' Jam';
                }
                if (isset($attrs['vendor'])) {
                    $keyHighlights[] = 'Vendor: ' . $attrs['vendor'];
                }
                if (isset($attrs['status'])) {
                    $keyHighlights[] = 'Status: ' . $attrs['status'];
                }
                if (isset($attrs['fundCent'])) {
                    $keyHighlights[] = 'Fund Center: ' . $attrs['fundCent'];
                }
            } elseif ($log->event === 'updated') {
                $changedFields = array_diff(array_keys($attrs), ['updated_at', 'created_at', 'id']);
                $summaryBadge = '✎ ' . count($changedFields) . ' Perubahan';
                $summaryText = "Memperbarui data \"{$itemIdentifier}\"";
                
                foreach ($changedFields as $k) {
                    $oldVal = $old[$k] ?? '-';
                    $newVal = $attrs[$k] ?? '-';
                    $oldFmt = is_numeric($oldVal) ? number_format((float)$oldVal, 0, ',', '.') : $oldVal;
                    $newFmt = is_numeric($newVal) ? number_format((float)$newVal, 0, ',', '.') : $newVal;
                    $keyHighlights[] = "{$k}: {$oldFmt} ➔ {$newFmt}";
                }
            } elseif ($log->event === 'deleted') {
                $summaryBadge = '✕ Hapus Data';
                $summaryText = "Menghapus data \"{$itemIdentifier}\"";
            }

            $log->actor_name = $actorName;
            $log->actor_role = $actorRole;
            $log->actor_initials = $actorInitials;
            $log->module_name = $moduleName;
            $log->module_category = $moduleCategory;
            $log->item_identifier = $itemIdentifier;
            $log->summary_badge = $summaryBadge;
            $log->summary_text = $summaryText;
            $log->key_highlights = $keyHighlights;

            return $log;
        });

        // Summary Statistics for dashboard header
        $stats = [
            'total' => Activity::count(),
            'today' => Activity::whereDate('created_at', today())->count(),
            'created' => Activity::where('event', 'created')->count(),
            'updated' => Activity::where('event', 'updated')->count(),
            'deleted' => Activity::where('event', 'deleted')->count(),
        ];

        return Inertia::render('ActivityLog/Index', [
            'logs' => $logs,
            'stats' => $stats,
            'filters' => $request->only(['search', 'event', 'module']),
        ]);
    }
}
