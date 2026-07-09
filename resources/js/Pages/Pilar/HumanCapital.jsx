import React, { useState, useMemo } from 'react';
import {
    Users, UserCheck, TrendingUp, Venus, Mars
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
} from 'recharts';
import KpiCard from '../../Components/KpiCard';
import MomTable from '../../Components/MomTable';

const GENDER_COLORS = ['#3b82f6', '#ec4899'];

export default function HumanCapital(props) {
    const { hcMutations, retiredWorkers, genderStats, momList, auth, onOpenFeedback } = props;
    const currentUser = auth.user;

    const [activeSubTab, setActiveSubTab] = useState('mutasi');

    const totalMutations = hcMutations.length;
    const totalRetired = retiredWorkers.length;
    const totalMale = genderStats?.male ?? 0;
    const totalFemale = genderStats?.female ?? 0;
    const totalOrganik = genderStats?.total ?? (totalMale + totalFemale);

    const genderChartData = useMemo(() => [
        { name: 'Pria', value: totalMale },
        { name: 'Wanita', value: totalFemale },
    ].filter((item) => item.value > 0), [totalMale, totalFemale]);

    const currentYear = new Date().getFullYear();

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans text-slate-800">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Total Pria (Organik)"
                    value={`${totalMale} Orang`}
                    subtitle="Karyawan organik aktif"
                    icon={Mars}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50"
                />
                <KpiCard
                    title="Total Wanita (Organik)"
                    value={`${totalFemale} Orang`}
                    subtitle="Karyawan organik aktif"
                    icon={Venus}
                    colorClass="text-pink-600"
                    bgClass="bg-pink-50"
                />
                <KpiCard
                    title="Mutasi Personil"
                    value={`${totalMutations} Pegawai`}
                    subtitle="Pergerakan SDM organik"
                    icon={TrendingUp}
                    colorClass="text-indigo-600"
                    bgClass="bg-indigo-50"
                />
                <KpiCard
                    title="Proyeksi Pensiun"
                    value={`${totalRetired} Orang`}
                    subtitle={`${currentYear} – ${currentYear + 3}`}
                    icon={UserCheck}
                    colorClass="text-amber-600"
                    bgClass="bg-amber-50"
                />
            </div>

            {/* GENDER CHART */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
                    <div className="mb-4">
                        <h3 className="font-extrabold text-slate-800 text-sm">Komposisi Gender SDM Organik</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Total {totalOrganik} karyawan organik — Pria {totalMale} ({totalOrganik > 0 ? Math.round((totalMale / totalOrganik) * 100) : 0}%), Wanita {totalFemale} ({totalOrganik > 0 ? Math.round((totalFemale / totalOrganik) * 100) : 0}%)
                        </p>
                    </div>
                    {genderChartData.length > 0 ? (
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={genderChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                        labelLine={false}
                                    >
                                        {genderChartData.map((_, index) => (
                                            <Cell key={index} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value) => [`${value} orang`, 'Jumlah']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-56 flex items-center justify-center text-slate-400 text-xs font-medium">
                            Data demografi belum tersedia. Unggah data karyawan organik melalui menu Upload.
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
                    <div className="mb-4">
                        <h3 className="font-extrabold text-slate-800 text-sm">Ringkasan Demografi</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Distribusi karyawan organik PGE Area Lahendong.</p>
                    </div>
                    <div className="space-y-4 pt-2">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1.5">
                                <span className="text-blue-700 flex items-center gap-1.5"><Mars className="w-3.5 h-3.5" /> Pria</span>
                                <span className="text-slate-700">{totalMale} orang</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all"
                                    style={{ width: `${totalOrganik > 0 ? (totalMale / totalOrganik) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1.5">
                                <span className="text-pink-700 flex items-center gap-1.5"><Venus className="w-3.5 h-3.5" /> Wanita</span>
                                <span className="text-slate-700">{totalFemale} orang</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-pink-500 rounded-full transition-all"
                                    style={{ width: `${totalOrganik > 0 ? (totalFemale / totalOrganik) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 rounded-2xl p-3 text-center">
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Total Pria</p>
                                <p className="text-2xl font-extrabold text-blue-800 mt-1">{totalMale}</p>
                            </div>
                            <div className="bg-pink-50 rounded-2xl p-3 text-center">
                                <p className="text-[10px] font-bold text-pink-600 uppercase tracking-wide">Total Wanita</p>
                                <p className="text-2xl font-extrabold text-pink-800 mt-1">{totalFemale}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SUB TAB NAV */}
            <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-2xs">
                <button
                    onClick={() => setActiveSubTab('mutasi')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeSubTab === 'mutasi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Users className="w-3.5 h-3.5" />
                    Mutasi & Pergerakan SDM ({totalMutations})
                </button>
                <button
                    onClick={() => setActiveSubTab('retired')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeSubTab === 'retired' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <UserCheck className="w-3.5 h-3.5" />
                    Proyeksi Pensiun 3 Tahun ({totalRetired})
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

            {/* SUB-TAB 2: RETIRED PROJECTION (3 YEARS) */}
            {activeSubTab === 'retired' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                        <h3 className="font-extrabold text-slate-800 text-sm">Proyeksi Karyawan Pensiun — 3 Tahun ke Depan</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Daftar karyawan organik yang akan pensiun periode {currentYear} s.d. {currentYear + 3} untuk perencanaan regenerasi SDM.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-3.5 text-slate-500 font-bold w-10 text-center">No</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Nama Karyawan</th>
                                    <th className="p-3.5 text-slate-500 font-bold text-center">Umur Pensiun</th>
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
                                        <td className="p-3.5 text-center font-bold text-amber-700">{item.umur_pensiun ?? '-'} Tahun</td>
                                        <td className="p-3.5 text-slate-600 font-semibold">{item.jabatan}</td>
                                        <td className="p-3.5 text-center font-bold text-slate-700">{item.tahun}</td>
                                        <td className="p-3.5 text-center font-mono text-slate-500">{item.tanggal}</td>
                                        <td className="p-3.5 max-w-xs text-wrap text-slate-500 font-medium leading-relaxed">{item.keterangan}</td>
                                    </tr>
                                ))}
                                {retiredWorkers.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                                            Tidak ada proyeksi pensiun dalam 3 tahun ke depan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
