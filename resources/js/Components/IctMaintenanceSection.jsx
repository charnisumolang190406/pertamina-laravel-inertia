import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import {
    Calendar, Download, UploadCloud, CheckCircle2, Clock,
    SlidersHorizontal, ShieldCheck, RefreshCw, Plus, ChevronRight, X, Maximize2
} from 'lucide-react';
import Swal from 'sweetalert2';

const MONTHS = [
    { id: 1, code: 'JAN', name: 'Januari' },
    { id: 2, code: 'FEB', name: 'Februari' },
    { id: 3, code: 'MAR', name: 'Maret' },
    { id: 4, code: 'APR', name: 'April' },
    { id: 5, code: 'MAY', name: 'Mei' },
    { id: 6, code: 'JUN', name: 'Juni' },
    { id: 7, code: 'JUL', name: 'Juli' },
    { id: 8, code: 'AUG', name: 'Agustus' },
    { id: 9, code: 'SEP', name: 'September' },
    { id: 10, code: 'OCT', name: 'Oktober' },
    { id: 11, code: 'NOV', name: 'November' },
    { id: 12, code: 'DEC', name: 'Desember' },
];

const ACTIVITIES = [
    'Minor Maintenance Server',
    'Major Maintenance Server',
    'PABX dan Jaringan Telp',
    'Jaringan LAN & Internet'
];

export default function IctMaintenanceSection({
    ictMaintenances = [],
    ictStats = {},
    isAdmin = false,
    auth = {}
}) {
    const [viewSemester, setViewSemester] = useState('all'); // 's1' | 's2' | 'all'
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPopUpModal, setShowPopUpModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(ACTIVITIES[0]);
    const [selectedMonth, setSelectedMonth] = useState(6);
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [selectedType, setSelectedType] = useState('realisasi');

    // Filter displayed months based on selected view
    const displayedMonths = useMemo(() => {
        if (viewSemester === 's1') return MONTHS.filter(m => m.id <= 6);
        if (viewSemester === 's2') return MONTHS.filter(m => m.id > 6);
        return MONTHS;
    }, [viewSemester]);

    // Build lookup set for quick cell check: key = `${kegiatan}|${bulan}|${minggu}|${tipe}`
    const maintenanceMap = useMemo(() => {
        const map = new Map();
        ictMaintenances.forEach(item => {
            const key = `${item.kegiatan}|${item.bulan}|${item.minggu}|${item.tipe}`;
            map.set(key, item);
        });
        return map;
    }, [ictMaintenances]);

    // Check if cell is active
    const isCellActive = (kegiatan, bulan, minggu, tipe) => {
        const key = `${kegiatan}|${bulan}|${minggu}|${tipe}`;
        return maintenanceMap.has(key);
    };

    // Quick toggle cell for admin
    const handleCellClick = (kegiatan, bulan, minggu, tipe) => {
        if (!isAdmin) return;
        const currentActive = isCellActive(kegiatan, bulan, minggu, tipe);

        router.post('/ict/maintenance/toggle', {
            kegiatan,
            bulan,
            minggu,
            tipe,
            active: !currentActive
        }, {
            preserveScroll: true
        });
    };

    // Handle Quick Edit Modal Save
    const handleQuickSave = (e) => {
        e.preventDefault();
        router.post('/ict/maintenance/toggle', {
            kegiatan: selectedActivity,
            bulan: selectedMonth,
            minggu: selectedWeek,
            tipe: selectedType,
            active: true
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(false);
                Swal.fire({
                    title: 'Tersimpan!',
                    text: `Jadwal ${selectedType} ${selectedActivity} berhasil diperbarui.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    // Render Matrix Table Helper
    const renderTable = (isModal = false) => (
        <table className="w-full border-collapse text-xs select-none">
            <thead>
                {/* Row 1: Nama Kegiatan & Bulan */}
                <tr className="border-t border-b border-slate-300">
                    <th
                        rowSpan={2}
                        className={`p-3 bg-white text-slate-800 font-extrabold text-left border-r border-slate-300 ${
                            isModal ? 'min-w-[260px]' : 'min-w-[200px] md:min-w-[230px]'
                        }`}
                    >
                        Nama Kegiatan
                    </th>
                    {displayedMonths.map(m => (
                        <th
                            key={m.code}
                            colSpan={4}
                            className="py-1.5 px-1 text-center font-black text-slate-800 border-r border-slate-300 bg-slate-50 text-[11px] tracking-wider"
                        >
                            {m.code}
                        </th>
                    ))}
                </tr>

                {/* Row 2: Minggu (1, 2, 3, 4) */}
                <tr className="border-b border-slate-400 bg-slate-50/50">
                    {displayedMonths.map(m => (
                        <React.Fragment key={`weeks-${m.code}`}>
                            {[1, 2, 3, 4].map(w => (
                                <th
                                    key={`w-${m.code}-${w}`}
                                    className="w-4.5 md:w-5.5 py-1 text-center font-bold text-[9.5px] text-slate-600 border-r border-slate-200 last:border-r-slate-300"
                                >
                                    {w}
                                </th>
                            ))}
                        </React.Fragment>
                    ))}
                </tr>
            </thead>

            <tbody>
                {ACTIVITIES.map((kegiatan) => (
                    <React.Fragment key={kegiatan}>
                        {/* Sub-row 1: RENCANA */}
                        <tr className="hover:bg-slate-50/40 transition-colors border-t border-slate-300">
                            <td
                                rowSpan={2}
                                className="p-2.5 border-r border-slate-300 font-bold text-slate-800 align-middle bg-white"
                            >
                                <span className="text-xs font-black text-slate-800">{kegiatan}</span>
                            </td>

                            {/* Rencana Cells */}
                            {displayedMonths.map(m => (
                                <React.Fragment key={`plan-${m.code}`}>
                                    {[1, 2, 3, 4].map(w => {
                                        const active = isCellActive(kegiatan, m.id, w, 'rencana');
                                        return (
                                            <td
                                                key={`plan-cell-${m.code}-${w}`}
                                                onClick={() => handleCellClick(kegiatan, m.id, w, 'rencana')}
                                                title={`${kegiatan} - ${m.name} M${w} (Rencana): ${active ? 'Terjadwal' : 'Kosong'}`}
                                                className={`h-5 w-5 md:h-5.5 md:w-5.5 border-r border-b border-slate-200 p-0.5 text-center transition-all ${
                                                    isAdmin ? 'cursor-pointer hover:opacity-80' : ''
                                                }`}
                                            >
                                                {active && (
                                                    <div
                                                        className="w-full h-full rounded-xs bg-[#5A6268] shadow-2xs"
                                                        title="Rencana Terjadwal"
                                                    />
                                                )}
                                            </td>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </tr>

                        {/* Sub-row 2: REALISASI */}
                        <tr className="hover:bg-slate-50/40 transition-colors border-b-2 border-slate-300">
                            {/* Realisasi Cells */}
                            {displayedMonths.map(m => (
                                <React.Fragment key={`real-${m.code}`}>
                                    {[1, 2, 3, 4].map(w => {
                                        const active = isCellActive(kegiatan, m.id, w, 'realisasi');
                                        return (
                                            <td
                                                key={`real-cell-${m.code}-${w}`}
                                                onClick={() => handleCellClick(kegiatan, m.id, w, 'realisasi')}
                                                title={`${kegiatan} - ${m.name} M${w} (Realisasi): ${active ? 'Selesai Terlaksana' : 'Belum'}`}
                                                className={`h-5 w-5 md:h-5.5 md:w-5.5 border-r border-b border-slate-200 p-0.5 text-center transition-all ${
                                                    isAdmin ? 'cursor-pointer hover:opacity-80' : ''
                                                }`}
                                            >
                                                {active && (
                                                    <div
                                                        className="w-full h-full rounded-xs bg-[#7FA03E] shadow-2xs"
                                                        title="Realisasi Selesai"
                                                    />
                                                )}
                                            </td>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </tr>
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="space-y-4">
            {/* MAIN GANTT MATRIX CARD */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                {/* CARD HEADER & TOOLBAR */}
                <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-50/30">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                Matriks Pemeliharaan
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">• 2026</span>
                        </div>
                        <h3 className="text-base font-black text-slate-800 tracking-tight mt-0.5">
                            JADWAL MAINTENANCE ICT 2026
                        </h3>
                    </div>

                    {/* CONTROLS & ACTIONS */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Period Switcher */}
                        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                            <button
                                onClick={() => setViewSemester('all')}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                    viewSemester === 'all'
                                        ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Setahun
                            </button>
                            <button
                                onClick={() => setViewSemester('s1')}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                    viewSemester === 's1'
                                        ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                S1 (Jan-Jun)
                            </button>
                            <button
                                onClick={() => setViewSemester('s2')}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                    viewSemester === 's2'
                                        ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                S2 (Jul-Des)
                            </button>
                        </div>

                        {/* Pop-up Button */}
                        <button
                            onClick={() => setShowPopUpModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                            title="Buka tampilan Pop-Up layar penuh"
                        >
                            <Maximize2 className="w-3.5 h-3.5 text-pertamina-blue" />
                            <span>Pop Up</span>
                        </button>

                        {/* Download Template */}
                        <a
                            href="/ict/template/maintenance"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                            title="Unduh format template CSV"
                        >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>Template</span>
                        </a>

                        {/* Admin Action */}
                        {isAdmin && (
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-pertamina-blue text-white rounded-xl hover:bg-blue-700 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Input Realisasi</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* TABLE MATRIX WRAPPER */}
                <div className="overflow-x-auto p-3 md:p-5 bg-white">
                    {renderTable(false)}
                </div>

                {/* FOOTER & LEGEND */}
                <div className="p-3 md:px-5 bg-slate-50/60 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div className="flex items-center gap-5 text-xs font-bold">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-xs bg-[#5A6268] shadow-2xs" />
                            <span className="text-slate-700">Rencana</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-xs bg-[#7FA03E] shadow-2xs" />
                            <span className="text-slate-700">Realisasi</span>
                        </div>
                    </div>

                    <div className="text-[11px] text-slate-400 font-medium">
                        Area Lahendong • 2026
                    </div>
                </div>
            </div>

            {/* POP-UP MODAL (FULLSCREEN GANTT MATRIX) */}
            {showPopUpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 animate-[fadeIn_0.2s_ease-in-out]">
                    <div className="bg-white rounded-3xl max-w-6xl w-full p-5 md:p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
                            <div>
                                <h3 className="font-black text-slate-900 text-base">JADWAL MAINTENANCE ICT 2026</h3>
                                <p className="text-[11px] text-slate-400 font-medium">Tampilan Pop-Up Pemeliharaan Server, PABX & Jaringan Area Lahendong</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
                                    <button
                                        onClick={() => setViewSemester('all')}
                                        className={`px-2.5 py-1 rounded-lg ${viewSemester === 'all' ? 'bg-white shadow-2xs font-extrabold text-slate-900' : 'text-slate-500'}`}
                                    >
                                        Setahun
                                    </button>
                                    <button
                                        onClick={() => setViewSemester('s1')}
                                        className={`px-2.5 py-1 rounded-lg ${viewSemester === 's1' ? 'bg-white shadow-2xs font-extrabold text-slate-900' : 'text-slate-500'}`}
                                    >
                                        S1
                                    </button>
                                    <button
                                        onClick={() => setViewSemester('s2')}
                                        className={`px-2.5 py-1 rounded-lg ${viewSemester === 's2' ? 'bg-white shadow-2xs font-extrabold text-slate-900' : 'text-slate-500'}`}
                                    >
                                        S2
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowPopUpModal(false)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body: Scrollable Table */}
                        <div className="overflow-x-auto overflow-y-auto my-4 py-2 flex-1">
                            {renderTable(true)}
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center shrink-0 text-xs">
                            <div className="flex items-center gap-5 font-bold">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3.5 h-3.5 rounded-xs bg-[#5A6268]" />
                                    <span className="text-slate-700">Rencana</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3.5 h-3.5 rounded-xs bg-[#7FA03E]" />
                                    <span className="text-slate-700">Realisasi</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPopUpModal(false)}
                                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                            >
                                Tutup Pop-Up
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QUICK EDIT MODAL */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-[fadeIn_0.2s_ease-in-out]">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <div>
                                <h4 className="font-extrabold text-slate-900 text-sm">Input Jadwal Maintenance</h4>
                                <p className="text-[11px] text-slate-400 font-medium">Perbarui status rencana/realisasi</p>
                            </div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleQuickSave} className="space-y-3.5 mt-3.5 text-xs font-semibold text-slate-700">
                            <div>
                                <label className="block text-slate-500 mb-1">Nama Kegiatan</label>
                                <select
                                    value={selectedActivity}
                                    onChange={(e) => setSelectedActivity(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 font-bold text-slate-800"
                                >
                                    {ACTIVITIES.map(act => (
                                        <option key={act} value={act}>{act}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                <div>
                                    <label className="block text-slate-500 mb-1">Bulan</label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 px-2.5 py-2 bg-slate-50 font-bold text-slate-800"
                                    >
                                        {MONTHS.map(m => (
                                            <option key={m.id} value={m.id}>{m.code} - {m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-500 mb-1">Minggu</label>
                                    <select
                                        value={selectedWeek}
                                        onChange={(e) => setSelectedWeek(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 px-2.5 py-2 bg-slate-50 font-bold text-slate-800"
                                    >
                                        {[1, 2, 3, 4].map(w => (
                                            <option key={w} value={w}>Minggu {w}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-500 mb-1">Tipe Entri</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedType('rencana')}
                                        className={`py-1.5 rounded-xl border font-bold text-center transition-all ${
                                            selectedType === 'rencana'
                                                ? 'bg-[#5A6268] text-white border-transparent'
                                                : 'bg-white border-slate-200 text-slate-600'
                                        }`}
                                    >
                                        Rencana
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedType('realisasi')}
                                        className={`py-1.5 rounded-xl border font-bold text-center transition-all ${
                                            selectedType === 'realisasi'
                                                ? 'bg-[#7FA03E] text-white border-transparent'
                                                : 'bg-white border-slate-200 text-slate-600'
                                        }`}
                                    >
                                        Realisasi
                                    </button>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 rounded-xl bg-pertamina-blue text-white font-bold hover:bg-blue-700 shadow-xs cursor-pointer"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
