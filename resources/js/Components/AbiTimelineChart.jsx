import React, { useState } from 'react';
import { Calendar, RotateCcw, Sliders, CheckCircle2, Clock, ChevronRight, Info, AlertCircle } from 'lucide-react';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DEFAULT_ACTIVITIES = [
    { id: 1, no: 1, name: '1. Pengadaan Logging Truck Unit', startMonth: 1, planEndMonth: 10, actualEndMonth: 8, status: 'On Track' },
    { id: 2, no: 2, name: '2. Pemindahan AFT Cluster 37', startMonth: 1, planEndMonth: 11, actualEndMonth: 8, status: 'On Track' },
    { id: 3, no: 3, name: '3. Pemipaan Jalur EDV menuju AFT Uji Cluster 27', startMonth: 1, planEndMonth: 12, actualEndMonth: 8, status: 'On Track' },
    { id: 4, no: 4, name: '4. Pengadaan Master Valve LHD-31 size 12"#900', startMonth: 1, planEndMonth: 11, actualEndMonth: 8, status: 'On Track' },
    { id: 5, no: 5, name: '5. Pengadaan 1 set Aktuator MCV untuk PLTP LHD Unit 5&6', startMonth: 1, planEndMonth: 12, actualEndMonth: 8, status: 'On Track' },
    { id: 6, no: 6, name: '6. Perbaikan Fasilitas Main Steam Line LHD Unit 1-4', startMonth: 1, planEndMonth: 11, actualEndMonth: 8, status: 'On Track' },
    { id: 7, no: 7, name: '7. Pembelian PSV Unit 1-4*', startMonth: 1, planEndMonth: 10, actualEndMonth: 8, status: 'On Track' },
    { id: 8, no: 8, name: '8. Pemboran Sumur Make-Up TPS-P1.2*', startMonth: 1, planEndMonth: 10, actualEndMonth: 8, status: 'On Track' },
    { id: 9, no: 9, name: '9. Perbaikan Surveillance System Area Lahendong*', startMonth: 3, planEndMonth: 12, actualEndMonth: 8, status: 'In Progress' },
    { id: 10, no: 10, name: '10. Pemagaran dan perbaikan pagar balong cluster*', startMonth: 3, planEndMonth: 12, actualEndMonth: 8, status: 'In Progress' },
    { id: 11, no: 11, name: '11. TA Area Lahendong Unit 5&6', startMonth: 1, planEndMonth: 10, actualEndMonth: 8, status: 'On Track' },
];

/**
 * AbiTimelineChart — Interactive, flexible Gantt Timeline for ABI 2026 Projects.
 * Matches screenshot #4:
 * - Blue Bar: Target Selesai (Schedule Plan)
 * - Green Bar: Realisasi Berjalan (Actual Progress)
 * - Vertical dashed line at cutoff date (8/21/2026)
 * - Interactive timeline adjustments (shift months, adjust progress, tooltips)
 */
export default function AbiTimelineChart({ className = '' }) {
    const [activities, setActivities] = useState(DEFAULT_ACTIVITIES);
    const [selectedActivityId, setSelectedActivityId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const updateActivityMonth = (id, field, value) => {
        const numVal = Math.max(1, Math.min(12, parseInt(value, 10) || 1));
        setActivities(prev => prev.map(act => {
            if (act.id !== id) return act;
            const updated = { ...act, [field]: numVal };
            // Ensure logic holds: start <= planEnd, start <= actualEnd
            if (field === 'startMonth') {
                updated.planEndMonth = Math.max(numVal, updated.planEndMonth);
                updated.actualEndMonth = Math.max(numVal, Math.min(updated.actualEndMonth, 12));
            } else if (field === 'planEndMonth') {
                updated.startMonth = Math.min(numVal, updated.startMonth);
            }
            return updated;
        }));
    };

    const handleReset = () => {
        setActivities(DEFAULT_ACTIVITIES);
    };

    const activeSelectedActivity = activities.find(a => a.id === selectedActivityId);

    // Percentage of X coordinate for a given month (1 to 12)
    // Month 1 starts at 0% and ends at (1/12)*100%
    const getMonthLeftPct = (m) => ((m - 1) / 12) * 100;
    const getMonthWidthPct = (start, end) => ((end - start + 1) / 12) * 100;

    // Dynamic position from user's local date
    const today = new Date();
    const currentMonth = today.getMonth(); // 0 to 11
    const currentDate = today.getDate();
    const currentYear = today.getFullYear();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Date formatted as M/D/YYYY (e.g., 9/3/2026)
    const formattedDate = `${currentMonth + 1}/${currentDate}/${currentYear}`;
    const fullDateText = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Dynamic timeline percentage for today's date
    const todayPct = Math.min(100, Math.max(0, ((currentMonth + (currentDate - 0.5) / daysInCurrentMonth) / 12) * 100));

    return (
        <div className={`bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5 ${className}`}>
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-100">
                <div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h3 className="text-base font-black text-slate-800 tracking-tight">Realisasi Timeline ABI 2026</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Update per {fullDateText} — Jadwal Rencana Kerja vs Realisasi Progres Lapangan
                    </p>
                </div>

                {/* Legend & Edit Controls */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-4 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-2 rounded-xs bg-[#2563EB]" />
                            <span className="text-slate-700">Target Selesai (Plan)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-2 rounded-xs bg-[#72B340]" />
                            <span className="text-slate-700">Realisasi Berjalan (Actual)</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isEditMode
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Aktifkan mode pengaturan durasi bar timeline"
                    >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>{isEditMode ? 'Tutup Pengatur' : 'Sesuaikan Bar'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1"
                        title="Kembalikan durasi jadwal ke default slide"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            {/* Interactive Edit Bar Drawer (when edit mode active) */}
            {isEditMode && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 animate-[fadeIn_0.2s_ease-in-out]">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-amber-700" />
                            <h4 className="text-xs font-black text-amber-900">Pengaturan Fleksibel Timeline ABI</h4>
                        </div>
                        <span className="text-[10px] text-amber-700 font-bold">
                            Pilih proyek dan geser bulan mulai, target selesai (biru), dan progres berjalan (hijau)
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-amber-900 mb-1">Pilih Proyek ABI:</label>
                            <select
                                value={selectedActivityId || activities[0].id}
                                onChange={(e) => setSelectedActivityId(parseInt(e.target.value, 10))}
                                className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
                            >
                                {activities.map(a => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>

                        {activeSelectedActivity && (
                            <>
                                <div>
                                    <label className="block text-[10px] font-bold text-amber-900 mb-1">
                                        Target Selesai (Bar Biru): <span className="text-blue-700 font-extrabold">{MONTH_LABELS[activeSelectedActivity.startMonth - 1]} - {MONTH_LABELS[activeSelectedActivity.planEndMonth - 1]}</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min={activeSelectedActivity.startMonth}
                                            max="12"
                                            value={activeSelectedActivity.planEndMonth}
                                            onChange={(e) => updateActivityMonth(activeSelectedActivity.id, 'planEndMonth', e.target.value)}
                                            className="w-full accent-blue-600 cursor-pointer"
                                        />
                                        <span className="text-xs font-black text-blue-700 w-10 text-right">
                                            {MONTH_LABELS[activeSelectedActivity.planEndMonth - 1]}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-amber-900 mb-1">
                                        Realisasi Berjalan (Bar Hijau): <span className="text-green-700 font-extrabold">{MONTH_LABELS[activeSelectedActivity.startMonth - 1]} - {MONTH_LABELS[activeSelectedActivity.actualEndMonth - 1]}</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min={activeSelectedActivity.startMonth}
                                            max="12"
                                            value={activeSelectedActivity.actualEndMonth}
                                            onChange={(e) => updateActivityMonth(activeSelectedActivity.id, 'actualEndMonth', e.target.value)}
                                            className="w-full accent-green-600 cursor-pointer"
                                        />
                                        <span className="text-xs font-black text-green-700 w-10 text-right">
                                            {MONTH_LABELS[activeSelectedActivity.actualEndMonth - 1]}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Main Gantt Grid Container */}
            <div className="border border-slate-200 rounded-2xl overflow-x-auto bg-white shadow-2xs">
                <div className="min-w-[760px]">
                    {/* Header Row: Month Names */}
                    <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50/90 text-center text-xs font-extrabold text-slate-700 divide-x divide-slate-200">
                        <div className="col-span-4 p-3 text-left pl-4 font-black uppercase tracking-wider text-[11px] text-slate-800">
                            Activity (Nama Proyek ABI)
                        </div>
                        <div className="col-span-8 grid grid-cols-12 divide-x divide-slate-200">
                            {MONTH_LABELS.map((m, idx) => (
                                <div key={m} className={`py-3 text-[11px] font-black ${idx === 7 ? 'bg-amber-50/80 text-amber-900' : ''}`}>
                                    {m}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Body Rows */}
                    <div className="divide-y divide-slate-150 relative">
                        {/* Vertical Guideline for Today's Date */}
                        <div
                            className="absolute top-0 bottom-0 pointer-events-none z-10 flex flex-col items-center"
                            style={{ left: `calc(33.333% + (66.666% * ${todayPct / 100}))` }}
                        >
                            <div className="w-[1.5px] h-full border-l-2 border-dashed border-slate-700/80" />
                        </div>

                        {activities.map((act) => {
                            const isSelected = selectedActivityId === act.id;

                            const planLeft = getMonthLeftPct(act.startMonth);
                            const planWidth = getMonthWidthPct(act.startMonth, act.planEndMonth);

                            const actualLeft = getMonthLeftPct(act.startMonth);
                            const actualWidth = getMonthWidthPct(act.startMonth, act.actualEndMonth);

                            return (
                                <div
                                    key={act.id}
                                    onClick={() => setSelectedActivityId(act.id)}
                                    className={`grid grid-cols-12 items-center transition-all cursor-pointer ${
                                        isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/70'
                                    }`}
                                >
                                    {/* Project Name Column */}
                                    <div className="col-span-4 p-3 pl-4 pr-2 flex items-center gap-2 min-w-0 border-r border-slate-200">
                                        <span className="text-[11.5px] font-bold text-slate-800 leading-snug truncate">
                                            {act.name}
                                        </span>
                                    </div>

                                    {/* Gantt Bar Column Area (8 cols = 66.666% width) */}
                                    <div className="col-span-8 grid grid-cols-12 h-12 relative divide-x divide-slate-100 bg-white/40">
                                        {/* Month Grid Cell Backgrounds */}
                                        {MONTH_LABELS.map((m, idx) => (
                                            <div key={m} className={`h-full ${idx === currentMonth ? 'bg-amber-50/30' : ''}`} />
                                        ))}

                                        {/* Blue Bar: Target Selesai (Plan) */}
                                        <div
                                            className="absolute top-2 h-3.5 rounded-sm bg-[#3B82F6] hover:bg-[#2563EB] shadow-2xs transition-all flex items-center justify-end px-1"
                                            style={{
                                                left: `${planLeft}%`,
                                                width: `${planWidth}%`,
                                            }}
                                            title={`Target Plan: ${MONTH_LABELS[act.startMonth - 1]} - ${MONTH_LABELS[act.planEndMonth - 1]}`}
                                        />

                                        {/* Green Bar: Realisasi Berjalan (Actual) */}
                                        <div
                                            className="absolute bottom-2 h-3 rounded-sm bg-[#72B340] hover:bg-[#5E9F30] shadow-2xs transition-all flex items-center justify-end px-1"
                                            style={{
                                                left: `${actualLeft}%`,
                                                width: `${actualWidth}%`,
                                            }}
                                            title={`Realisasi Berjalan: ${MONTH_LABELS[act.startMonth - 1]} - ${MONTH_LABELS[act.actualEndMonth - 1]}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer / Marker Row */}
                    <div className="grid grid-cols-12 border-t border-slate-200 bg-slate-50/90 py-2.5 px-4 items-center">
                        <div className="col-span-4 text-[10px] text-slate-500 font-bold">
                            Klik pada baris proyek untuk melihat rincian / mengatur jadwal
                        </div>
                        <div className="col-span-8 relative">
                            {/* Today's Date Pin */}
                            <div
                                className="absolute -top-3 flex flex-col items-center -translate-x-1/2 select-none"
                                style={{ left: `${todayPct}%` }}
                            >
                                <div className="w-0 h-0 border-x-[5px] border-x-transparent border-b-[8px] border-b-slate-800" />
                                <span className="bg-slate-900 text-white text-[9.5px] font-black px-2.5 py-0.5 rounded-md shadow-sm whitespace-nowrap mt-0.5">
                                    {formattedDate}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
