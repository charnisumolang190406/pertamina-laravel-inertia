import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import {
    Users, Clock, Download, Trash2, TrendingUp, UserPlus, UserMinus,
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Legend,
} from 'recharts';
import KpiCard from '../../Components/KpiCard';
import MomTable from '../../Components/MomTable';

const MONTH_ORDER = {
    januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6,
    juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12,
};

function sortByPeriod(a, b) {
    const parsePeriod = (period) => {
        const parts = (period || '').toLowerCase().split(' ');
        const month = MONTH_ORDER[parts[0]] || 0;
        const year = parseInt(parts[1], 10) || 0;
        return year * 100 + month;
    };
    return parsePeriod(a) - parsePeriod(b);
}

export default function TenagaAlihDaya(props) {
    const { tadWorkers, lemburTadList, tadMutations = [], momList, auth, onOpenFeedback, arsipList } = props;
    const currentUser = auth.user;

    const [activeSubTab, setActiveSubTab] = useState('tad');

    const totalTad = tadWorkers.length;
    const totalLemburVal = lemburTadList.reduce((acc, c) => acc + c.lemburVal, 0);
    const totalMutasi = tadMutations.length;

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

    const groupedLemburList = useMemo(() => {
        const grouped = lemburTadList.reduce((acc, curr) => {
            const period = curr.periode || 'Lainnya';
            if (!acc[period]) {
                acc[period] = { periode: period, totalJam: 0, totalNilai: 0 };
            }
            acc[period].totalJam += curr.jamLembur;
            acc[period].totalNilai += curr.lemburVal;
            return acc;
        }, {});
        return Object.values(grouped).sort((a, b) => sortByPeriod(a.periode, b.periode));
    }, [lemburTadList]);

    const lemburChartData = useMemo(() => groupedLemburList.map((g) => ({
        periode: g.periode,
        jam: parseFloat(g.totalJam.toFixed(1)),
        nilai: Math.round(g.totalNilai / 1000000),
    })), [groupedLemburList]);

    const mutationChartData = useMemo(() => {
        const grouped = tadMutations.reduce((acc, curr) => {
            const bulan = curr.bulan || 'Lainnya';
            if (!acc[bulan]) {
                acc[bulan] = { bulan, masuk: 0, keluar: 0 };
            }
            if (curr.jenis === 'Masuk') {
                acc[bulan].masuk += 1;
            } else {
                acc[bulan].keluar += 1;
            }
            return acc;
        }, {});
        return Object.values(grouped).sort((a, b) => sortByPeriod(a.bulan, b.bulan));
    }, [tadMutations]);

    const isAdmin = currentUser?.role?.startsWith('Admin');

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans text-slate-800">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    subtitle="Akumulasi semua periode"
                    icon={Clock}
                    colorClass="text-green-600"
                    bgClass="bg-green-50"
                />
                <KpiCard
                    title="Mutasi TAD Bulanan"
                    value={`${totalMutasi} Pergerakan`}
                    subtitle="Staff masuk & keluar"
                    icon={TrendingUp}
                    colorClass="text-indigo-600"
                    bgClass="bg-indigo-50"
                />
            </div>

            {/* SUB TAB NAV */}
            <div className="flex flex-wrap border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-2xs gap-1">
                <button
                    onClick={() => setActiveSubTab('tad')}
                    className={`flex-1 min-w-[140px] py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeSubTab === 'tad' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Daftar TAD ({totalTad})
                </button>
                <button
                    onClick={() => setActiveSubTab('lembur')}
                    className={`flex-1 min-w-[140px] py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeSubTab === 'lembur' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Monitoring Lembur ({groupedLemburList.length})
                </button>
                <button
                    onClick={() => setActiveSubTab('mutasi')}
                    className={`flex-1 min-w-[140px] py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeSubTab === 'mutasi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Mutasi TAD ({totalMutasi})
                </button>
            </div>

            {/* SUB-TAB 1: TAD LIST */}
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

            {/* SUB-TAB 2: OVERTIME MONITORING + CHART */}
            {activeSubTab === 'lembur' && (
                <div className="space-y-4">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
                        <div className="mb-4">
                            <h3 className="font-extrabold text-slate-800 text-sm">Grafik Lembur TAD per Bulan</h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Visualisasi total jam lembur dan nilai lembur (dalam jutaan Rp) per periode.</p>
                        </div>
                        {lemburChartData.length > 0 ? (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={lemburChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="periode" tick={{ fontSize: 10, fill: '#64748b' }} />
                                        <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Jam', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
                                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Juta Rp', angle: 90, position: 'insideRight', style: { fontSize: 10 } }} />
                                        <RechartsTooltip
                                            formatter={(value, name) => [
                                                name === 'jam' ? `${value} jam` : `Rp ${value} juta`,
                                                name === 'jam' ? 'Total Jam Lembur' : 'Total Nilai Lembur',
                                            ]}
                                        />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Bar yAxisId="left" dataKey="jam" name="Jam Lembur" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        <Bar yAxisId="right" dataKey="nilai" name="Nilai (Juta Rp)" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-48 flex items-center justify-center text-slate-400 text-xs font-medium">
                                Belum ada data lembur. Unggah laporan lembur TAD melalui menu Upload.
                            </div>
                        )}
                    </div>

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
                </div>
            )}

            {/* SUB-TAB 3: TAD MUTATIONS */}
            {activeSubTab === 'mutasi' && (
                <div className="space-y-4">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
                        <div className="mb-4">
                            <h3 className="font-extrabold text-slate-800 text-sm">Grafik Mutasi TAD per Bulan</h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Pergerakan staff TAD masuk dan keluar per periode.</p>
                        </div>
                        {mutationChartData.length > 0 ? (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={mutationChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: '#64748b' }} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                        <RechartsTooltip formatter={(value, name) => [`${value} orang`, name === 'masuk' ? 'Masuk' : 'Keluar']} />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Bar dataKey="masuk" name="Masuk" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="keluar" name="Keluar" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-48 flex items-center justify-center text-slate-400 text-xs font-medium">
                                Belum ada data mutasi TAD. Unggah data mutasi melalui menu Upload.
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                            <h3 className="font-extrabold text-slate-800 text-sm">Riwayat Mutasi Tenaga Alih Daya</h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Monitoring pergerakan keluar-masuk staff TAD per bulan.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-3.5 text-slate-500 font-bold w-10 text-center">No</th>
                                        <th className="p-3.5 text-slate-500 font-bold">Bulan Mutasi</th>
                                        <th className="p-3.5 text-slate-500 font-bold">Nama Staff TAD</th>
                                        <th className="p-3.5 text-slate-500 font-bold">Jenis Pergerakan</th>
                                        <th className="p-3.5 text-slate-500 font-bold">Peran Kerja</th>
                                        <th className="p-3.5 text-slate-500 font-bold">Vendor Penyedia</th>
                                        <th className="p-3.5 text-slate-500 font-bold max-w-xs text-wrap">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tadMutations.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="p-3.5 text-slate-500 text-center font-medium">{idx + 1}</td>
                                            <td className="p-3.5 font-bold text-slate-700">{item.bulan}</td>
                                            <td className="p-3.5 font-bold text-slate-800">{item.nama}</td>
                                            <td className="p-3.5">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold shadow-2xs ${
                                                    item.jenis === 'Masuk' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.jenis === 'Masuk' ? <UserPlus className="w-3 h-3" /> : <UserMinus className="w-3 h-3" />}
                                                    {item.jenis}
                                                </span>
                                            </td>
                                            <td className="p-3.5 text-slate-600 font-semibold">{item.peran}</td>
                                            <td className="p-3.5 text-slate-600 font-medium">{item.vendor}</td>
                                            <td className="p-3.5 max-w-xs text-wrap text-slate-500 font-medium leading-relaxed">{item.keterangan}</td>
                                        </tr>
                                    ))}
                                    {tadMutations.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                                                Tidak ada data mutasi TAD. Silakan unggah data mutasi melalui menu Upload.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <MomTable
                momList={momList}
                fungsi="HC"
                currentUser={currentUser}
                onOpenFeedback={onOpenFeedback}
            />
        </div>
    );
}
