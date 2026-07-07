import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { 
    Users, Clock, Download, Trash2, TrendingUp, UserCheck
} from 'lucide-react';
import KpiCard from '../../Components/KpiCard';
import MomTable from '../../Components/MomTable';

export default function TenagaAlihDaya(props) {
    const { tadWorkers, lemburTadList, momList, auth, onOpenFeedback, arsipList } = props;
    const currentUser = auth.user;

    const [activeSubTab, setActiveSubTab] = useState('tad');

    const totalTad = tadWorkers.length;
    const totalLemburVal = lemburTadList.reduce((acc, c) => acc + c.lemburVal, 0);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const handleDeleteLemburByPeriode = (periode) => {
        if (confirm(`Apakah Anda yakin ingin menghapus SELURUH data lembur TAD untuk periode ${periode}?`)) {
            router.post('/hc/lembur/delete-periode', { periode });
        }
    };

    const findFileForPeriod = (period) => {
        const matched = (arsipList || []).find(doc => {
            const nameLower = doc.nama.toLowerCase();
            const periodLower = period.toLowerCase();
            return (
                (nameLower.includes('lembur') || nameLower.includes('tad') || doc.kategori === 'Laporan Bulanan') &&
                (nameLower.includes(periodLower) || periodLower.includes(nameLower))
            );
        });
        return matched ? matched.file_path : '#';
    };

    // Group lemburTadList by periode (Bulan)
    const groupedLembur = lemburTadList.reduce((acc, curr) => {
        const period = curr.periode || 'Lainnya';
        if (!acc[period]) {
            acc[period] = {
                periode: period,
                totalJam: 0,
                totalNilai: 0,
            };
        }
        acc[period].totalJam += curr.jamLembur;
        acc[period].totalNilai += curr.lemburVal;
        return acc;
    }, {});

    const groupedLemburList = Object.values(groupedLembur);

    const isAdmin = currentUser?.role?.startsWith('Admin');

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans text-slate-800">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <KpiCard 
                    title="Tenaga Alih Daya (TAD)" 
                    value={`${totalTad} Orang`} 
                    subtitle="PGE Area Lahendong" 
                    icon={Users} 
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50" 
                />
                <KpiCard 
                    title="Total Upah Lembur TAD" 
                    value={formatCurrency(totalLemburVal)} 
                    subtitle="Realisasi Bulan Mei 2026" 
                    icon={Clock} 
                    colorClass="text-green-600" 
                    bgClass="bg-green-50" 
                />
            </div>

            {/* SUB TAB NAV */}
            <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-2xs">
                <button
                    onClick={() => setActiveSubTab('tad')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeSubTab === 'tad' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Daftar Tenaga Alih Daya ({totalTad})
                </button>
                <button
                    onClick={() => setActiveSubTab('lembur')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeSubTab === 'lembur' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Monitoring Lembur TAD ({lemburTadList.length})
                </button>
            </div>

            {/* SUB-TAB 1: TAD */}
            {activeSubTab === 'tad' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                        <h3 className="font-extrabold text-slate-800 text-sm">Daftar Aktif Tenaga Alih Daya (TAD)</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Daftar personil penunjang operasional, sopir, sekuriti, dan katering.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-3.5 text-slate-500 font-bold w-10 text-center">No</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Nama Lengkap</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Peran Kerja / Posisi</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Vendor Penyedia</th>
                                    <th className="p-3.5 text-slate-500 font-bold w-28 text-center">Status Kontrak</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tadWorkers.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="p-3.5 text-slate-500 text-center font-medium">{idx + 1}</td>
                                        <td className="p-3.5 font-bold text-slate-800">{item.nama}</td>
                                        <td className="p-3.5 text-slate-600 font-semibold">{item.peran}</td>
                                        <td className="p-3.5 text-slate-600 font-medium">{item.vendor}</td>
                                        <td className="p-3.5 text-center">
                                            <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-800 text-[10px] font-bold shadow-2xs">
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SUB-TAB 2: OVERTIME MONITORING */}
            {activeSubTab === 'lembur' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                        <h3 className="font-extrabold text-slate-800 text-sm">Rekap & Audit Lembur TAD Bulanan</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Penghitungan upah lembur bulanan teragregasi per fungsi.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-3.5 text-slate-500 font-bold w-10 text-center">No</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Bulan / Periode</th>
                                    <th className="p-3.5 text-slate-500 font-bold text-center">Total Jumlah Jam Lembur</th>
                                    <th className="p-3.5 text-slate-500 font-bold text-right">Total Nilai Lembur (Rp)</th>
                                    <th className="p-3.5 text-slate-500 font-bold text-center w-36">Lampiran Berkas</th>
                                    {isAdmin && <th className="p-3.5 text-slate-500 font-bold text-center w-20">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {groupedLemburList.map((item, idx) => (
                                    <tr key={item.periode} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="p-3.5 text-slate-500 text-center font-medium">{idx + 1}</td>
                                        <td className="p-3.5 font-bold text-slate-800">{item.periode}</td>
                                        <td className="p-3.5 text-center font-extrabold text-slate-700">{item.totalJam.toFixed(1)} Jam</td>
                                        <td className="p-3.5 text-right font-mono font-bold text-green-600">{formatCurrency(item.totalNilai)}</td>
                                        <td className="p-3.5 text-center">
                                            <a
                                                href={findFileForPeriod(item.periode)}
                                                download
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-[10px] font-bold cursor-pointer transition-all"
                                                onClick={(e) => {
                                                    if (findFileForPeriod(item.periode) === '#') {
                                                        e.preventDefault();
                                                        alert('Lampiran dokumen fisik untuk periode ini belum diunggah atau dihasilkan secara virtual.');
                                                    }
                                                }}
                                            >
                                                <Download className="w-3 h-3" /> View/Download Excel
                                            </a>
                                        </td>
                                        {isAdmin && (
                                            <td className="p-3.5 text-center">
                                                <button
                                                    onClick={() => handleDeleteLemburByPeriode(item.periode)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                                                    title="Hapus Rekap Periode Ini"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {groupedLemburList.length === 0 && (
                                    <tr>
                                        <td colSpan={isAdmin ? 6 : 5} className="p-8 text-center text-slate-400 font-medium">
                                            Tidak ada rekap bulanan data lembur TAD. Silakan gunakan tombol "Upload Laporan / Excel" untuk mengimpor berkas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MOM TABLE AT BOTTOM */}
            <MomTable 
                momList={momList} 
                fungsi="HC" 
                currentUser={currentUser} 
                onOpenFeedback={onOpenFeedback} 
            />
        </div>
    );
}
