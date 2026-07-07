import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { 
  Users, UserCheck, Clock, TrendingUp, Trash2, Download
} from 'lucide-react';
import KpiCard from '../../Components/KpiCard';
import MomTable from '../../Components/MomTable';

export default function HumanCapital(props) {
    const { hcMutations, tadWorkers, retiredWorkers, lemburTadList, momList, auth, onOpenFeedback } = props;
    const currentUser = auth.user;

    const [activeSubTab, setActiveSubTab] = useState('mutasi');

    const totalMutations = hcMutations.length;
    const totalTad = tadWorkers.length;
    const totalRetired = retiredWorkers.length;
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
        const matched = (props.arsipList || []).find(doc => {
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
                    title="Mutasi Personil" 
                    value={`${totalMutations} Pegawai`} 
                    subtitle="Bulan Berjalan 2026" 
                    icon={TrendingUp} 
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50" 
                />
                <KpiCard 
                    title="Proyeksi Pensiun" 
                    value={`${totalRetired} Orang`} 
                    subtitle="Tahun 2024 - 2026" 
                    icon={UserCheck} 
                    colorClass="text-indigo-600" 
                    bgClass="bg-indigo-50" 
                />
            </div>

            {/* SUB TAB NAV */}
            <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-2xs">
                <button
                    onClick={() => setActiveSubTab('mutasi')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeSubTab === 'mutasi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Mutasi & Pergerakan SDM ({totalMutations})
                </button>
                <button
                    onClick={() => setActiveSubTab('retired')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeSubTab === 'retired' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Proyeksi Pensiun Karyawan ({totalRetired})
                </button>
            </div>

            {/* SUB-TAB 1: MUTASI */}
            {activeSubTab === 'mutasi' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                        <h3 className="font-extrabold text-slate-800 text-sm">Riwayat Mutasi & Pergerakan SDM</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Monitoring pergerakan keluar-masuk karyawan organik di Area Lahendong.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-3.5 text-slate-500 font-bold w-10 text-center">No</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Bulan Mutasi</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Nama Karyawan</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Jenis Pergerakan</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Fungsi / Jabatan Baru</th>
                                    <th className="p-3.5 text-slate-500 font-bold max-w-xs text-wrap">Keterangan Asal/Tujuan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {hcMutations.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="p-3.5 text-slate-500 text-center font-medium">{idx + 1}</td>
                                        <td className="p-3.5 font-bold text-slate-700">{item.bulan}</td>
                                        <td className="p-3.5 font-bold text-slate-800">{item.nama}</td>
                                        <td className="p-3.5">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold shadow-2xs ${
                                                item.jenis === 'Masuk' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {item.jenis}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-slate-600 font-semibold">{item.fungsi}</td>
                                        <td className="p-3.5 max-w-xs text-wrap text-slate-500 font-medium leading-relaxed">{item.keterangan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SUB-TAB 2: RETIRED PROJECTION */}
            {activeSubTab === 'retired' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                        <h3 className="font-extrabold text-slate-800 text-sm">Proyeksi & Riwayat Karyawan Pensiun</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Proyeksi perencanaan SDM untuk mengantisipasi regenerasi karyawan organik.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-3.5 text-slate-500 font-bold w-10 text-center">No</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Nama Karyawan</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Jabatan Terakhir</th>
                                    <th className="p-3.5 text-slate-500 font-bold text-center">Tahun Pensiun</th>
                                    <th className="p-3.5 text-slate-500 font-bold text-center">Tanggal Efektif</th>
                                    <th className="p-3.5 text-slate-500 font-bold max-w-xs text-wrap">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {retiredWorkers.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="p-3.5 text-slate-500 text-center font-medium">{idx + 1}</td>
                                        <td className="p-3.5 font-bold text-slate-800">{item.nama}</td>
                                        <td className="p-3.5 text-slate-600 font-semibold">{item.jabatan}</td>
                                        <td className="p-3.5 text-center font-bold text-slate-700">{item.tahun}</td>
                                        <td className="p-3.5 text-center font-mono text-slate-500">{item.tanggal}</td>
                                        <td className="p-3.5 max-w-xs text-wrap text-slate-500 font-medium leading-relaxed">{item.keterangan}</td>
                                    </tr>
                                ))}
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
