import React, { useState } from 'react';
import { Laptop, Cpu, CheckCircle, AlertCircle, Trash2, Plus, UploadCloud } from 'lucide-react';
import KpiCard from '../../Components/KpiCard';
import MomTable from '../../Components/MomTable';

export default function ItAsset(props) {
    const { assetList, momList, auth, onOpenFeedback } = props;
    const currentUser = auth.user;

    const [filterKategori, setFilterKategori] = useState('Semua');

    const categories = ['Semua', 'Server & Rack', 'Workstation', 'Laptop', 'Printer / MFP', 'Network Device'];
    
    const filteredAssets = filterKategori === 'Semua' 
        ? assetList 
        : assetList.filter(a => a.kategori === filterKategori);

    const totalAssets = assetList.length;
    const optimalAssets = assetList.filter(a => a.status === 'Optimal').length;
    const maintenanceAssets = assetList.filter(a => a.status === 'Maintenance').length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard 
                    title="Total IT Asset" 
                    value={`${totalAssets} Unit`} 
                    subtitle="Terdaftar di PGE Lahendong" 
                    icon={Laptop} 
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50" 
                />
                <KpiCard 
                    title="Status Optimal" 
                    value={`${optimalAssets} Unit`} 
                    subtitle="Kondisi prima & operasional" 
                    icon={CheckCircle} 
                    colorClass="text-green-600" 
                    bgClass="bg-green-50" 
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

            {/* IT ASSETS LIST */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
                    <div>
                        <h3 className="font-extrabold text-slate-800 text-sm">Inventaris IT Asset Area Lahendong</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Monitoring server, workstation, switch, dan laptop operasional.</p>
                    </div>
                    <div className="flex gap-2 text-[11px] font-bold">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterKategori(cat)}
                                className={`px-3 py-1.5 rounded-xl cursor-pointer border transition-all ${
                                    filterKategori === cat 
                                        ? 'bg-blue-600 text-white border-transparent' 
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
                                <th className="p-3.5 text-slate-500 font-bold w-10 text-center">No</th>
                                <th className="p-3.5 text-slate-500 font-bold">Nama Aset</th>
                                <th className="p-3.5 text-slate-500 font-bold">Kategori</th>
                                <th className="p-3.5 text-slate-500 font-bold">Brand / Model</th>
                                <th className="p-3.5 text-slate-500 font-bold">Serial Number</th>
                                <th className="p-3.5 text-slate-500 font-bold">Lokasi Penempatan</th>
                                <th className="p-3.5 text-slate-500 font-bold w-28">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAssets.map((asset, idx) => (
                                <tr key={asset.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="p-3.5 text-slate-500 text-center font-medium">{idx + 1}</td>
                                    <td className="p-3.5 font-bold text-slate-800">{asset.nama}</td>
                                    <td className="p-3.5 text-slate-600 font-semibold">{asset.kategori}</td>
                                    <td className="p-3.5 font-mono text-slate-600">{asset.brand}</td>
                                    <td className="p-3.5 font-mono text-slate-500">{asset.serial}</td>
                                    <td className="p-3.5 text-slate-600 font-medium">{asset.lokasi}</td>
                                    <td className="p-3.5">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold shadow-2xs ${
                                            asset.status === 'Optimal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredAssets.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                                        Tidak ada data IT Asset untuk kategori ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MOM TABLE AT BOTTOM */}
            <MomTable 
                momList={momList} 
                fungsi="IT" 
                currentUser={currentUser} 
                onOpenFeedback={onOpenFeedback} 
            />
        </div>
    );
}
