import React, { useState, useEffect } from 'react';
import {
    Laptop, CheckCircle, AlertCircle, Calendar,
    BarChart3, Layers, Monitor, ShieldCheck
} from 'lucide-react';
import KpiCard from '../../Components/KpiCard';
import Pagination from '../../Components/Pagination';
import IctMaintenanceSection from '../../Components/IctMaintenanceSection';
import IctServiceSection from '../../Components/IctServiceSection';

export default function ItAsset(props) {
    const {
        assetList = [],
        ictServices = [],
        ictMaintenances = [],
        ictStats = {},
        auth = {},
        activeSubMenu = '',
        onOpenFeedback
    } = props;

    const currentUser = auth?.user || {};
    const userRole = (currentUser?.role || '').toLowerCase();
    const isAdmin = userRole.includes('admin') || userRole.includes('ict') || userRole.includes('it');

    // ─── TAB STATE SYNCHRONIZATION WITH SIDEBAR SUB-MENU ───
    const [activeTab, setActiveTab] = useState(() => {
        if (activeSubMenu === 'maintenance-ict') return 'maintenance';
        if (activeSubMenu === 'service-ict') return 'service';
        if (activeSubMenu === 'inventaris-it') return 'inventory';
        return 'overview';
    });

    useEffect(() => {
        if (activeSubMenu === 'maintenance-ict') setActiveTab('maintenance');
        else if (activeSubMenu === 'service-ict') setActiveTab('service');
        else if (activeSubMenu === 'inventaris-it') setActiveTab('inventory');
        else if (activeSubMenu === 'all-ict') setActiveTab('overview');
    }, [activeSubMenu]);

    // ─── INVENTORY TABLE FILTER & PAGINATION ───
    const [filterKategori, setFilterKategori] = useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const categories = ['Semua', 'Server & Rack', 'Workstation', 'Laptop', 'Printer / MFP', 'Network Device'];

    const filteredAssets = filterKategori === 'Semua'
        ? assetList
        : assetList.filter(a => a.kategori === filterKategori);

    useEffect(() => { setCurrentPage(1); }, [filterKategori]);
    const paginatedAssets = filteredAssets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const totalAssets = assetList.length;
    const optimalAssets = assetList.filter(a => a.status === 'Optimal').length;
    const maintenanceAssets = assetList.filter(a => a.status === 'Maintenance').length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans pb-10 text-slate-800">
            {/* CLEAN MINIMAL HEADER & TOGGLE PILLS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Information & Communication Technology (ICT)</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Monitoring pemeliharaan rutin server, jaringan, dan layanan dukungan teknis Area Lahendong.</p>
                </div>

                {/* PILL SWITCHER */}
                <div className="bg-white p-1 rounded-full border border-slate-200 shadow-2xs inline-flex flex-wrap gap-1">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'overview'
                                ? 'bg-pertamina-blue text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Ringkasan</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('maintenance')}
                        className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'maintenance'
                                ? 'bg-pertamina-blue text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Jadwal Maintenance</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('service')}
                        className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'service'
                                ? 'bg-pertamina-blue text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                    >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Rekap Layanan</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'inventory'
                                ? 'bg-pertamina-blue text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                    >
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Aset IT</span>
                    </button>
                </div>
            </div>

            {/* SINGLE CLEAN ROW OF KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Total IT Asset"
                    value={`${totalAssets} Unit`}
                    subtitle="Terdaftar di PGE Lahendong"
                    icon={Laptop}
                    colorClass="text-pertamina-blue"
                    bgClass="bg-blue-50"
                />
                <KpiCard
                    title="Ketercapaian Maintenance"
                    value={`${ictStats?.s1AchievementRate ?? 100}%`}
                    subtitle="Semester 1 (Jan - Jun 2026)"
                    icon={CheckCircle}
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-50"
                />
                <KpiCard
                    title="Total Layanan ICT Service"
                    value={`${ictStats?.totalTickets ?? 33} Tiket`}
                    subtitle={`Laporan Bulan ${ictServices[0]?.bulan || '06'}/2026`}
                    icon={BarChart3}
                    colorClass="text-purple-600"
                    bgClass="bg-purple-50"
                />
                <KpiCard
                    title="Dalam Pemeliharaan"
                    value={`${maintenanceAssets} Unit`}
                    subtitle="Perlu perbaikan / servis"
                    icon={AlertCircle}
                    colorClass="text-red-600"
                    bgClass="bg-red-50"
                />
            </div>

            {/* TAB VIEW 1: OVERVIEW (SHOWS JADWAL MAINTENANCE + REKAP LAYANAN + ASET SUMMARY) */}
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-[fadeIn_0.2s_ease-in-out]">
                    <IctMaintenanceSection
                        ictMaintenances={ictMaintenances}
                        ictStats={ictStats}
                        isAdmin={isAdmin}
                        auth={auth}
                    />

                    <IctServiceSection
                        ictServices={ictServices}
                        ictStats={ictStats}
                        isAdmin={isAdmin}
                        auth={auth}
                    />
                </div>
            )}

            {/* TAB VIEW 2: DEDICATED MAINTENANCE SCHEDULE */}
            {activeTab === 'maintenance' && (
                <div className="animate-[fadeIn_0.2s_ease-in-out]">
                    <IctMaintenanceSection
                        ictMaintenances={ictMaintenances}
                        ictStats={ictStats}
                        isAdmin={isAdmin}
                        auth={auth}
                    />
                </div>
            )}

            {/* TAB VIEW 3: DEDICATED ICT SERVICE REKAPITULASI */}
            {activeTab === 'service' && (
                <div className="animate-[fadeIn_0.2s_ease-in-out]">
                    <IctServiceSection
                        ictServices={ictServices}
                        ictStats={ictStats}
                        isAdmin={isAdmin}
                        auth={auth}
                    />
                </div>
            )}

            {/* TAB VIEW 4: HARDWARE INVENTARIS PERANGKAT IT */}
            {(activeTab === 'inventory' || activeTab === 'overview') && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-in-out]">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                        <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-50/30">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Inventaris IT Asset Area Lahendong</h3>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Monitoring server, workstation, switch, dan laptop operasional.</p>
                            </div>

                            {/* Category Filter Pills */}
                            <div className="flex flex-wrap gap-1 text-[11px] font-bold">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilterKategori(cat)}
                                        className={`px-3 py-1 rounded-xl cursor-pointer border transition-all ${
                                            filterKategori === cat
                                                ? 'bg-pertamina-blue text-white border-transparent shadow-2xs'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-3 text-slate-500 font-bold w-10 text-center">No</th>
                                        <th className="p-3 text-slate-500 font-bold">Nama Aset</th>
                                        <th className="p-3 text-slate-500 font-bold">Kategori</th>
                                        <th className="p-3 text-slate-500 font-bold">Brand / Model</th>
                                        <th className="p-3 text-slate-500 font-bold">Serial Number</th>
                                        <th className="p-3 text-slate-500 font-bold">Lokasi Penempatan</th>
                                        <th className="p-3 text-slate-500 font-bold w-28">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedAssets.map((asset, idx) => {
                                        const actualIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
                                        return (
                                            <tr key={asset.id} className="hover:bg-slate-50/40 transition-colors">
                                                <td className="p-3 text-slate-500 text-center font-medium">{actualIdx + 1}</td>
                                                <td className="p-3 font-bold text-slate-800">{asset.nama}</td>
                                                <td className="p-3 text-slate-600 font-semibold">{asset.kategori}</td>
                                                <td className="p-3 font-mono text-slate-600">{asset.brand}</td>
                                                <td className="p-3 font-mono text-slate-500">{asset.serial}</td>
                                                <td className="p-3 text-slate-600 font-medium">{asset.lokasi}</td>
                                                <td className="p-3">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold shadow-2xs ${
                                                        asset.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {asset.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredAssets.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                                                Tidak ada data IT Asset untuk kategori ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Pagination
                                currentPage={currentPage}
                                totalItems={filteredAssets.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
