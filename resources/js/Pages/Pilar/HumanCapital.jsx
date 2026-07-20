import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import {
    Users, UserCheck, TrendingUp, Venus, Mars,
    Clock, Download, Trash2, UserPlus, UserMinus
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import KpiCard from '../../Components/KpiCard';
import MomTable from '../../Components/MomTable';

const GENDER_COLORS = ['#3b82f6', '#ec4899'];

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

export default function HumanCapital(props) {
    const { 
        hcMutations, retiredWorkers, genderStats, momList, auth, onOpenFeedback,
        tadWorkers = [], lemburTadList = [], tadMutations = [], arsipList = [],
        organikWorkers = []
    } = props;
    const currentUser = auth.user;
    const isAdmin = currentUser?.role?.startsWith('Admin');

    const [masterView, setMasterView] = useState('organik'); // 'organik' | 'tad'
    const [activeSubTabOrganik, setActiveSubTabOrganik] = useState('mutasi');
    const [activeSubTabTad, setActiveSubTabTad] = useState('tad');

    // === ORGANIK LOGIC ===
    const totalMutations = hcMutations?.length || 0;
    const totalRetired = retiredWorkers?.length || 0;
    const totalMale = genderStats?.male ?? 0;
    const totalFemale = genderStats?.female ?? 0;
    const totalOrganik = genderStats?.total ?? (totalMale + totalFemale);

    const genderChartData = useMemo(() => [
        { name: 'Pria', value: totalMale },
        { name: 'Wanita', value: totalFemale },
    ].filter((item) => item.value > 0), [totalMale, totalFemale]);

    const ageChartData = useMemo(() => {
        const buckets = {
            '20-25': { name: '20-25', Pria: 0, Wanita: 0 },
            '26-30': { name: '26-30', Pria: 0, Wanita: 0 },
            '31-35': { name: '31-35', Pria: 0, Wanita: 0 },
            '36-40': { name: '36-40', Pria: 0, Wanita: 0 },
            '41-45': { name: '41-45', Pria: 0, Wanita: 0 },
            '46-50': { name: '46-50', Pria: 0, Wanita: 0 },
            '51-55': { name: '51-55', Pria: 0, Wanita: 0 },
            '>55': { name: '>55', Pria: 0, Wanita: 0 }
        };

        organikWorkers.forEach(emp => {
            if (!emp.age) return;
            const age = parseInt(emp.age);
            if (isNaN(age)) return;
            
            const isMale = ['laki-laki', 'l', 'pria'].includes((emp.gender || '').toLowerCase());
            const genderKey = isMale ? 'Pria' : 'Wanita';

            if (age >= 20 && age <= 25) buckets['20-25'][genderKey]++;
            else if (age >= 26 && age <= 30) buckets['26-30'][genderKey]++;
            else if (age >= 31 && age <= 35) buckets['31-35'][genderKey]++;
            else if (age >= 36 && age <= 40) buckets['36-40'][genderKey]++;
            else if (age >= 41 && age <= 45) buckets['41-45'][genderKey]++;
            else if (age >= 46 && age <= 50) buckets['46-50'][genderKey]++;
            else if (age >= 51 && age <= 55) buckets['51-55'][genderKey]++;
            else if (age > 55) buckets['>55'][genderKey]++;
        });
        
        // Filter out empty buckets for a cleaner chart
        return Object.values(buckets).filter(b => b.Pria > 0 || b.Wanita > 0);
    }, [organikWorkers]);

    const currentYear = new Date().getFullYear();

    // === TAD LOGIC ===
    const totalTad = tadWorkers?.length || 0;
    const totalLemburVal = lemburTadList?.reduce((acc, c) => acc + c.lemburVal, 0) || 0;
    const totalTadMutasi = tadMutations?.length || 0;

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
        const grouped = (lemburTadList || []).reduce((acc, curr) => {
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
        nilai: Math.round(g.totalNilai / 1000000), // in Juta Rupiah
    })), [groupedLemburList]);

    const lemburFungsiData = useMemo(() => {
        const grouped = (lemburTadList || []).reduce((acc, curr) => {
            let fungsi = (curr.fungsi || 'Lainnya').toUpperCase().trim();
            // Simplify some names based on screenshot if needed, but let's just use raw for now
            if (!acc[fungsi]) {
                acc[fungsi] = { name: fungsi, value: 0, jam: 0, personil: new Set() };
            }
            acc[fungsi].value += curr.lemburVal;
            acc[fungsi].jam += curr.jamLembur;
            if (curr.nopok) acc[fungsi].personil.add(curr.nopok);
            return acc;
        }, {});
        
        let totalAllBiaya = 0;
        let totalAllJam = 0;
        let totalAllPersonil = new Set();
        
        const result = Object.values(grouped).map(g => {
            totalAllBiaya += g.value;
            totalAllJam += g.jam;
            g.personil.forEach(p => totalAllPersonil.add(p));
            return {
                name: g.name,
                value: g.value,
                jam: g.jam,
                personilCount: g.personil.size
            };
        }).sort((a, b) => b.value - a.value); // sort by value descending
        
        return {
            details: result,
            totalBiaya: totalAllBiaya,
            totalJam: totalAllJam,
            totalPersonil: totalAllPersonil.size
        };
    }, [lemburTadList]);

    const mutationChartData = useMemo(() => {
        const grouped = (tadMutations || []).reduce((acc, curr) => {
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

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans text-slate-800">
            
            {/* MASTER TOGGLE SWITCH */}
            <div className="flex justify-center mb-6">
                <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm inline-flex">
                    <button
                        onClick={() => setMasterView('organik')}
                        className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                            masterView === 'organik' 
                                ? 'bg-pertamina-blue text-white shadow-md' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        <UserCheck className="w-4 h-4" />
                        SDM Organik ({totalOrganik})
                    </button>
                    <button
                        onClick={() => setMasterView('tad')}
                        className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                            masterView === 'tad' 
                                ? 'bg-pertamina-blue text-white shadow-md' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        Tenaga Alih Daya ({totalTad})
                    </button>
                </div>
            </div>

            {/* =========================================================================
                                     VIEW: SDM ORGANIK
               ========================================================================= */}
            {masterView === 'organik' && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-in-out]">
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
                                    Data demografi belum tersedia.
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

                    {/* AGE CHART ROW */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
                        <div className="mb-4">
                            <h3 className="font-extrabold text-slate-800 text-sm">Komposisi Pekerja Berdasarkan Usia</h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Distribusi usia karyawan organik berdasarkan gender.</p>
                        </div>
                        {ageChartData.length > 0 ? (
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ageChartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f1f5f9" />
                                        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                                        <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#475569', fontWeight: 'bold' }} width={50} />
                                        <RechartsTooltip formatter={(value, name) => [`${value} orang`, name]} cursor={{fill: 'transparent'}} />
                                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                                        <Bar dataKey="Pria" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={24} />
                                        <Bar dataKey="Wanita" stackId="a" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-56 flex items-center justify-center text-slate-400 text-xs font-medium">
                                Data umur belum tersedia. Silakan unggah Master Data Organik yang mencakup umur.
                            </div>
                        )}
                    </div>

                    {/* SUB TAB NAV */}
                    <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl shadow-2xs">
                        <button
                            onClick={() => setActiveSubTabOrganik('mutasi')}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeSubTabOrganik === 'mutasi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <Users className="w-3.5 h-3.5" />
                            Mutasi & Pergerakan SDM ({totalMutations})
                        </button>
                        <button
                            onClick={() => setActiveSubTabOrganik('retired')}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeSubTabOrganik === 'retired' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <UserCheck className="w-3.5 h-3.5" />
                            Proyeksi Pensiun 3 Tahun ({totalRetired})
                        </button>
                    </div>

                    {/* SUB-TAB 1: MUTASI */}
                    {activeSubTabOrganik === 'mutasi' && (
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
                                        {(hcMutations || []).map((item, idx) => (
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
                    {activeSubTabOrganik === 'retired' && (
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
                                        {(retiredWorkers || []).map((item, idx) => (
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
                                        {(!retiredWorkers || retiredWorkers.length === 0) && (
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
                </div>
            )}

            {/* =========================================================================
                                     VIEW: TENAGA ALIH DAYA
               ========================================================================= */}
            {masterView === 'tad' && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-in-out]">
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
                            value={`${totalTadMutasi} Pergerakan`}
                            subtitle="Staff masuk & keluar"
                            icon={TrendingUp}
                            colorClass="text-indigo-600"
                            bgClass="bg-indigo-50"
                        />
                    </div>

                    {/* SUB TAB NAV */}
                    <div className="flex flex-wrap border-b border-slate-200 bg-white p-2 rounded-2xl shadow-2xs gap-1">
                        <button
                            onClick={() => setActiveSubTabTad('tad')}
                            className={`flex-1 min-w-[140px] py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeSubTabTad === 'tad' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Daftar TAD ({totalTad})
                        </button>
                        <button
                            onClick={() => setActiveSubTabTad('lembur')}
                            className={`flex-1 min-w-[140px] py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeSubTabTad === 'lembur' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Monitoring Lembur ({groupedLemburList.length})
                        </button>
                        <button
                            onClick={() => setActiveSubTabTad('mutasi')}
                            className={`flex-1 min-w-[140px] py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeSubTabTad === 'mutasi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Mutasi TAD ({totalTadMutasi})
                        </button>
                    </div>

                    {/* SUB-TAB 1: TAD LIST */}
                    {activeSubTabTad === 'tad' && (
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
                                        {(tadWorkers || []).map((item, idx) => (
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
                    {activeSubTabTad === 'lembur' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* KIRI: TREN BIAYA LEMBUR (LINE CHART) */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
                                <div className="mb-4">
                                    <h3 className="font-extrabold text-slate-800 text-sm">Tren Biaya Lembur Tahun {currentYear}*</h3>
                                </div>
                                {lemburChartData.length > 0 ? (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={lemburChartData} margin={{ top: 20, right: 15, left: -20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="periode" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => val === 0 ? '0' : val} />
                                                <RechartsTooltip
                                                    formatter={(value) => [`Rp ${value} juta`, 'Biaya Lembur']}
                                                />
                                                <Line type="linear" dataKey="nilai" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a', r: 3 }} activeDot={{ r: 5 }} label={{ position: 'top', fontSize: 9, fill: '#334155', formatter: (v) => v }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-medium bg-slate-50/50 rounded-2xl">
                                        Belum ada data tren lembur.
                                    </div>
                                )}
                                <div className="mt-2 text-right">
                                    <p className="text-[9px] font-bold text-slate-400 italic">*Data per {lemburChartData[lemburChartData.length-1]?.periode || 'saat ini'}</p>
                                </div>
                            </div>

                            {/* KANAN: BIAYA LEMBUR PER FUNGSI (PIE & TABEL) */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
                                <div className="mb-4">
                                    <h3 className="font-extrabold text-slate-800 text-sm">Biaya Lembur Per Fungsi Tahun {currentYear}*</h3>
                                </div>
                                <div className="flex flex-col xl:flex-row items-center gap-4">
                                    <div className="w-48 h-48 shrink-0">
                                        {lemburFungsiData.details.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={lemburFungsiData.details}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={45}
                                                        outerRadius={80}
                                                        paddingAngle={0}
                                                        dataKey="value"
                                                    >
                                                        {lemburFungsiData.details.map((entry, index) => {
                                                            const colors = ['#b8cc14', '#1d70b8', '#111827', '#6b7280', '#e11d48', '#8b5cf6'];
                                                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                                        })}
                                                    </Pie>
                                                    <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-full border border-slate-100">
                                                <span className="text-[10px] text-slate-400 font-medium">No Data</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 w-full space-y-3">
                                        {/* SUMMARY CARDS */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-[#e4ece9] rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-200/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.7)]">
                                                <span className="text-[9px] font-extrabold text-slate-600 tracking-wider mb-1">TOTAL REALISASI BIAYA</span>
                                                <span className="text-base font-black text-slate-900">Rp {Math.round(lemburFungsiData.totalBiaya / 1000000)} juta</span>
                                                <span className="text-[8px] font-semibold text-slate-500 mt-1">({formatCurrency(lemburFungsiData.totalBiaya)})</span>
                                            </div>
                                            <div className="bg-[#e4ece9] rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-200/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.7)]">
                                                <span className="text-[9px] font-extrabold text-slate-600 tracking-wider mb-1">TOTAL JAM LEMBUR</span>
                                                <span className="text-base font-black text-slate-900">{lemburFungsiData.totalJam.toLocaleString('id-ID')} Jam</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* FUNGSI TABLE */}
                                <div className="mt-6 border border-slate-300 rounded-lg overflow-hidden">
                                    <table className="w-full text-left text-[10px] whitespace-nowrap">
                                        <thead className="bg-slate-100 border-b border-slate-300">
                                            <tr>
                                                <th className="p-2 font-bold text-slate-800 border-r border-slate-300">FUNGSI</th>
                                                <th className="p-2 font-bold text-slate-800 text-right border-r border-slate-300">BIAYA LEMBUR</th>
                                                <th className="p-2 font-bold text-slate-800 text-center">JUMLAH PERSONEL</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {lemburFungsiData.details.map((item, idx) => (
                                                <tr key={idx} className="bg-white">
                                                    <td className="p-2 font-semibold text-slate-700 border-r border-slate-200">{item.name}</td>
                                                    <td className="p-2 font-mono font-medium text-slate-600 text-right border-r border-slate-200">{item.value.toLocaleString('id-ID')}</td>
                                                    <td className="p-2 text-center font-medium text-slate-700">{item.personilCount}</td>
                                                </tr>
                                            ))}
                                            <tr className="bg-slate-100 font-bold text-slate-800">
                                                <td className="p-2 border-r border-slate-300">TOTAL</td>
                                                <td className="p-2 text-right font-mono border-r border-slate-300">{lemburFungsiData.totalBiaya.toLocaleString('id-ID')}</td>
                                                <td className="p-2 text-center">{lemburFungsiData.totalPersonil}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-2 text-right">
                                    <p className="text-[9px] font-bold text-slate-400 italic">*Data per {lemburChartData[lemburChartData.length-1]?.periode || 'saat ini'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SUB-TAB 3: TAD MUTATIONS */}
                    {activeSubTabTad === 'mutasi' && (
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
                                            {(tadMutations || []).map((item, idx) => (
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
                                            {(!tadMutations || tadMutations.length === 0) && (
                                                <tr>
                                                    <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                                                        Tidak ada data mutasi TAD.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* MOM TABLE (Shown for both views since it's global to HC function) */}
            <MomTable
                momList={momList}
                fungsi="HC"
                currentUser={currentUser}
                onOpenFeedback={onOpenFeedback}
            />
        </div>
    );
}
