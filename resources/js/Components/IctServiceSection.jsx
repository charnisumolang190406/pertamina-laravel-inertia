import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Cell, LabelList
} from 'recharts';
import {
    Download, ExternalLink, Edit3, X, Maximize2, Globe, Radio,
    Printer, Volume2, Monitor, Server
} from 'lucide-react';
import Swal from 'sweetalert2';

const CATEGORY_META = {
    'Jaringan': { color: '#2563eb' },
    'multimedia': { color: '#dc2626' },
    'printer': { color: '#65a30d' },
    'sound': { color: '#7c3aed' },
    'Komputer': { color: '#0284c7' },
    'server': { color: '#ea580c' }
};

const DEFAULT_CATEGORIES = [
    { kategori: 'Jaringan', jumlah: 3 },
    { kategori: 'multimedia', jumlah: 8 },
    { kategori: 'printer', jumlah: 3 },
    { kategori: 'sound', jumlah: 8 },
    { kategori: 'Komputer', jumlah: 5 },
    { kategori: 'server', jumlah: 6 }
];

export default function IctServiceSection({
    ictServices = [],
    ictStats = {},
    isAdmin = false,
    auth = {}
}) {
    const [selectedMonth, setSelectedMonth] = useState('06');
    const [selectedYear, setSelectedYear] = useState(2026);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPopUpModal, setShowPopUpModal] = useState(false);
    const [editCategory, setEditCategory] = useState('Jaringan');
    const [editAmount, setEditAmount] = useState(0);

    const chartData = useMemo(() => {
        if (!ictServices || ictServices.length === 0) {
            return DEFAULT_CATEGORIES;
        }

        const filtered = ictServices.filter(
            s => String(s.bulan).padStart(2, '0') === selectedMonth && Number(s.tahun) === Number(selectedYear)
        );

        if (filtered.length > 0) return filtered;
        return ictServices;
    }, [ictServices, selectedMonth, selectedYear]);

    const totalTickets = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);
    }, [chartData]);

    const sourceUrl = `http://ptmpgewebapp2.pertamina.com/portal/it/rekap.php?bulan=${selectedMonth}&th=${selectedYear}&button=Submit`;

    const handleSaveEdit = (e) => {
        e.preventDefault();
        router.post('/ict/service/update', {
            kategori: editCategory,
            jumlah: editAmount,
            bulan: selectedMonth,
            tahun: selectedYear,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(false);
                Swal.fire({
                    title: 'Berhasil!',
                    text: `Jumlah tiket layanan ${editCategory} telah diperbarui.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    const renderChartAndTable = (isModal = false) => (
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-center ${isModal ? 'p-2' : ''}`}>
            {/* LEFT COLUMN: TABLE */}
            <div className="lg:col-span-5">
                <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-slate-300 bg-slate-50">
                                <th className="p-2.5 text-slate-700 font-extrabold border-r border-slate-300 uppercase tracking-wider text-[10.5px]">
                                    KATEGORI
                                </th>
                                <th className="p-2.5 text-slate-700 font-extrabold text-right uppercase tracking-wider text-[10.5px] w-20">
                                    JUMLAH
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {chartData.map((row) => {
                                const meta = CATEGORY_META[row.kategori] || { color: '#64748b' };
                                return (
                                    <tr
                                        key={row.kategori}
                                        onClick={() => {
                                            if (isAdmin) {
                                                setEditCategory(row.kategori);
                                                setEditAmount(row.jumlah);
                                                setShowEditModal(true);
                                            }
                                        }}
                                        className={`transition-colors ${
                                            isAdmin ? 'hover:bg-blue-50/40 cursor-pointer' : 'hover:bg-slate-50/40'
                                        }`}
                                    >
                                        <td className="p-2 font-semibold text-slate-800 border-r border-slate-200 flex items-center gap-2">
                                            <span
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ backgroundColor: meta.color }}
                                            />
                                            <span>{row.kategori}</span>
                                        </td>
                                        <td className="p-2 font-bold text-slate-900 text-right font-mono">
                                            {row.jumlah}
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr className="bg-slate-50 font-black border-t-2 border-slate-300">
                                <td className="p-2 text-slate-800 border-r border-slate-200 uppercase tracking-wider text-[10.5px]">
                                    Total
                                </td>
                                <td className="p-2 text-right text-pertamina-blue font-mono font-bold text-sm">
                                    {totalTickets}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RIGHT COLUMN: BAR CHART */}
            <div className="lg:col-span-7">
                <div className={isModal ? "h-80 w-full" : "h-64 w-full"}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 10, left: -15, bottom: 10 }}
                            barCategoryGap="25%"
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                            <XAxis
                                dataKey="kategori"
                                tickLine={false}
                                axisLine={{ stroke: '#94a3b8' }}
                                tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }}
                                dy={5}
                            />
                            <YAxis
                                domain={[0, 9]}
                                ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                                tickLine={false}
                                axisLine={{ stroke: '#94a3b8' }}
                                tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
                            />
                            <RechartsTooltip
                                formatter={(val, name, item) => [`${val} Tiket`, item.payload.kategori]}
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '11px',
                                    fontWeight: 700
                                }}
                            />
                            <Bar
                                dataKey="jumlah"
                                radius={[3, 3, 0, 0]}
                                stroke="#475569"
                                strokeWidth={0.5}
                            >
                                <LabelList
                                    dataKey="jumlah"
                                    position="top"
                                    fill="#1e293b"
                                    fontSize={11}
                                    fontWeight={800}
                                />
                                {chartData.map((entry, index) => {
                                    const meta = CATEGORY_META[entry.kategori] || { color: '#3b82f6' };
                                    return (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={meta.color}
                                        />
                                    );
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                {/* CARD HEADER */}
                <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-50/30">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                Rekapitulasi Layanan
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">• Bulan {selectedMonth}/{selectedYear}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-800 tracking-tight mt-0.5">
                            1. ICT SERVICE
                        </h3>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Month / Year Filter */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="bg-white rounded-lg border-0 py-1 px-2 text-xs font-bold text-slate-800 shadow-2xs"
                            >
                                <option value="01">Jan (01)</option>
                                <option value="02">Feb (02)</option>
                                <option value="03">Mar (03)</option>
                                <option value="04">Apr (04)</option>
                                <option value="05">Mei (05)</option>
                                <option value="06">Jun (06)</option>
                                <option value="07">Jul (07)</option>
                                <option value="08">Agu (08)</option>
                                <option value="09">Sep (09)</option>
                                <option value="10">Okt (10)</option>
                                <option value="11">Nov (11)</option>
                                <option value="12">Des (12)</option>
                            </select>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="bg-white rounded-lg border-0 py-1 px-1.5 text-xs font-bold text-slate-800 shadow-2xs"
                            >
                                <option value={2026}>2026</option>
                                <option value={2025}>2025</option>
                            </select>
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

                        {/* Template CSV */}
                        <a
                            href="/ict/template/service"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                            title="Unduh format template CSV"
                        >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>Template</span>
                        </a>

                        {/* Admin Action */}
                        {isAdmin && (
                            <button
                                onClick={() => {
                                    setEditCategory('Jaringan');
                                    setEditAmount(0);
                                    setShowEditModal(true);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-pertamina-blue text-white rounded-xl hover:bg-blue-700 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Update Data</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 md:p-6 bg-white">
                    {renderChartAndTable(false)}
                </div>

                {/* FOOTER CITATION */}
                <div className="p-3 md:px-5 bg-slate-50/60 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span className="font-bold text-slate-700 shrink-0">Sumber:</span>
                        <span className="text-[11px] text-slate-500 font-mono break-all">
                            {sourceUrl}
                        </span>
                    </div>

                    <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-pertamina-blue hover:bg-blue-50 text-xs font-bold transition-all shrink-0 cursor-pointer"
                    >
                        <span>Buka Link</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>

            {/* POP-UP MODAL (FULLSCREEN CHART & TABLE) */}
            {showPopUpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 animate-[fadeIn_0.2s_ease-in-out]">
                    <div className="bg-white rounded-3xl max-w-4xl w-full p-5 md:p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
                            <div>
                                <h3 className="font-black text-slate-900 text-base">1. ICT SERVICE</h3>
                                <p className="text-[11px] text-slate-400 font-medium">Rekapitulasi Layanan Tiket ICT Bulan {selectedMonth}/{selectedYear}</p>
                            </div>
                            <button
                                onClick={() => setShowPopUpModal(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="my-4 py-2 overflow-y-auto flex-1">
                            {renderChartAndTable(true)}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center shrink-0 text-xs">
                            <span className="text-slate-400 font-mono text-[11px]">{sourceUrl}</span>
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

            {/* EDIT MODAL */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-[fadeIn_0.2s_ease-in-out]">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <div>
                                <h4 className="font-extrabold text-slate-900 text-sm">Update Tiket Layanan</h4>
                                <p className="text-[11px] text-slate-400 font-medium">Bulan {selectedMonth}/{selectedYear}</p>
                            </div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-3.5 mt-3.5 text-xs font-semibold text-slate-700">
                            <div>
                                <label className="block text-slate-500 mb-1">Kategori Layanan</label>
                                <select
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 font-bold text-slate-800"
                                >
                                    {Object.keys(CATEGORY_META).map(kat => (
                                        <option key={kat} value={kat}>{kat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-500 mb-1">Jumlah Tiket Layanan</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="999"
                                    value={editAmount}
                                    onChange={(e) => setEditAmount(Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 font-black text-slate-900 text-base"
                                    required
                                />
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
