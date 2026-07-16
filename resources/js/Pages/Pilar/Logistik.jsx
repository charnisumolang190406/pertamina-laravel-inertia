import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { 
  Package, Laptop, Folder, Trash2, Database, AlertCircle, CheckCircle, Droplet
} from 'lucide-react';
import KpiCard from '../../Components/KpiCard';
import MomTable from '../../Components/MomTable';

export default function Logistik(props) {
    const { stokList, alatBeratList, perbaikanList, momList, bbmList = [], auth, onOpenFeedback } = props;
    const currentUser = auth.user;

    const [activeSubTab, setActiveSubTab] = useState('perbaikan');

    const totalStockItems = stokList.length;
    const totalJenisMaterial = new Set(stokList.map(item => item.nama)).size;
    const totalAlatBerat = alatBeratList.length;
    const totalPerbaikan = perbaikanList.length;
    const totalRealisasi = perbaikanList.reduce((acc, c) => acc + c.realisasi, 0);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatBbm = (val) => {
        if (val === null || val === undefined || val == 0) return '-';
        return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val);
    };

    const handleDeleteItem = (id) => {
        let url = '';
        let confirmText = '';
        if (activeSubTab === 'alat_berat') {
            url = `/logistik/alat-berat/${id}`;
            confirmText = 'Hapus data aset alat berat ini?';
        } else if (activeSubTab === 'perbaikan') {
            url = `/logistik/perbaikan/${id}`;
            confirmText = 'Hapus data perbaikan aset ini?';
        }

        if (url && confirm(confirmText)) {
            router.delete(url);
        }
    };

    const handleClearOrReset = (action) => {
        let actionPath = '';
        let confirmText = '';

        if (action === 'clear') {
            actionPath = `/logistik/${activeSubTab}/clear`;
            confirmText = `Apakah Anda yakin ingin MENGOSONGKAN seluruh data di sub-tab ${activeSubTab}?`;
        } else {
            actionPath = `/logistik/${activeSubTab}/reset`;
            confirmText = `Apakah Anda yakin ingin me-RESET data sub-tab ${activeSubTab} ke default bawaan?`;
        }

        if (confirm(confirmText)) {
            router.post(actionPath);
        }
    };

    const isAdmin = currentUser?.role?.startsWith('Admin');

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans text-slate-800">
            {/* KPI CARDS (Modified per request: Total Stok & Total Jenis Material) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard 
                    title="Total Stok Gudang" 
                    value={`${totalStockItems} Unit`} 
                    subtitle="Keseluruhan item fisik" 
                    icon={Package} 
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50" 
                />
                <KpiCard 
                    title="Total Jenis Material" 
                    value={`${totalJenisMaterial} Jenis`} 
                    subtitle="Berdasarkan kategori unik" 
                    icon={Database} 
                    colorClass="text-emerald-600" 
                    bgClass="bg-emerald-50" 
                />
                <KpiCard 
                    title="Total Request Perbaikan" 
                    value={`${totalPerbaikan} Request`} 
                    subtitle="Rumah Dinas & Kantor" 
                    icon={Folder} 
                    colorClass="text-indigo-600" 
                    bgClass="bg-indigo-50" 
                />
                <KpiCard 
                    title="Aset Alat Berat" 
                    value={`${totalAlatBerat} Unit`} 
                    subtitle="Crane & Forklift Aktif" 
                    icon={Laptop} 
                    colorClass="text-amber-600" 
                    bgClass="bg-amber-50" 
                />
            </div>

            {/* SUB TAB NAV */}
            <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-2xs">
                <button
                    onClick={() => setActiveSubTab('perbaikan')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                        activeSubTab === 'perbaikan' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <span className="flex items-center justify-center gap-1.5"><Folder className="w-4 h-4"/> Perbaikan Rumah Dinas ({totalPerbaikan})</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('alat_berat')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                        activeSubTab === 'alat_berat' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <span className="flex items-center justify-center gap-1.5"><Laptop className="w-4 h-4"/> Alat Berat & Aset LHD ({totalAlatBerat})</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('bbm')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                        activeSubTab === 'bbm' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <span className="flex items-center justify-center gap-1.5"><Droplet className="w-4 h-4"/> Laporan Pemakaian BBM</span>
                </button>
            </div>

            {/* RESET / CLEAR BUTTONS */}
            {isAdmin && activeSubTab !== 'bbm' && (
                <div className="flex justify-end gap-2 text-xs font-bold">
                    <button
                        onClick={() => handleClearOrReset('clear')}
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-xl border border-red-200 cursor-pointer transition-all active:scale-95"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Kosongkan Data {activeSubTab.replace('_', ' ')}
                    </button>
                    <button
                        onClick={() => handleClearOrReset('reset')}
                        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer transition-all active:scale-95"
                    >
                        <Database className="w-3.5 h-3.5" /> Reset Default {activeSubTab.replace('_', ' ')}
                    </button>
                </div>
            )}

            {/* SUB-TAB 1: PERBAIKAN (Sederhana per Request) */}
            {activeSubTab === 'perbaikan' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                        <h3 className="font-extrabold text-slate-800 text-sm">Monitoring Pekerjaan Sipil & Perbaikan Rumah Dinas</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Daftar permintaan perbaikan fasilitas aset dan gedung.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-3.5 text-slate-500 font-bold w-10 text-center">No</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Tanggal (Tgl)</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Nama Request</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Status (Progres)</th>
                                    {isAdmin && <th className="p-3.5 text-slate-500 font-bold text-center w-20">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {perbaikanList.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="p-3.5 text-slate-500 text-center font-medium">{idx + 1}</td>
                                        <td className="p-3.5 text-slate-600 font-mono text-[11px]">{formatDate(item.created_at)}</td>
                                        <td className="p-3.5 max-w-md text-wrap font-bold text-slate-700">{item.pekerjaan} - {item.lokasi}</td>
                                        <td className="p-3.5">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold shadow-2xs ${
                                                item.status.toLowerCase().includes('selesai') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td className="p-3.5 text-center">
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {perbaikanList.length === 0 && (
                                    <tr>
                                        <td colSpan={isAdmin ? 5 : 4} className="p-8 text-center text-slate-400 font-medium">
                                            Tidak ada data perbaikan rumah dinas / kantor.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SUB-TAB 2: ALAT BERAT */}
            {activeSubTab === 'alat_berat' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                        <h3 className="font-extrabold text-slate-800 text-sm">Monitoring Masa Berlaku Dokumen & Kondisi Alat Berat</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Masa berlaku STNK, Pajak, dan KIR untuk crane & forklift operasional.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-3.5 text-slate-500 font-bold w-10 text-center">No</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Jenis Aset</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Merk</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Type / Model</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Alokasi</th>
                                    <th className="p-3.5 text-slate-500 font-bold">No. Polisi</th>
                                    <th className="p-3.5 text-slate-500 font-bold text-center">STNK (5 Thn)</th>
                                    <th className="p-3.5 text-slate-500 font-bold text-center">Pajak (1 Thn)</th>
                                    <th className="p-3.5 text-slate-500 font-bold text-center">KIR (6 Bln)</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Status Surat</th>
                                    <th className="p-3.5 text-slate-500 font-bold max-w-xs text-wrap">Kondisi Fisik & Keterangan</th>
                                    {isAdmin && <th className="p-3.5 text-slate-500 font-bold text-center w-20">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {alatBeratList.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="p-3.5 text-slate-500 text-center font-medium">{idx + 1}</td>
                                        <td className="p-3.5 font-bold text-slate-800">{item.jenis}</td>
                                        <td className="p-3.5 font-semibold text-slate-600">{item.merk}</td>
                                        <td className="p-3.5 font-mono text-slate-600">{item.model}</td>
                                        <td className="p-3.5 text-slate-600 font-bold">{item.alokasi}</td>
                                        <td className="p-3.5 font-mono text-slate-600">{item.nopol}</td>
                                        <td className="p-3.5 text-center font-mono text-slate-500">{item.stnk}</td>
                                        <td className="p-3.5 text-center font-mono text-slate-500">{item.pajak}</td>
                                        <td className="p-3.5 text-center font-mono text-slate-500">{item.kir}</td>
                                        <td className="p-3.5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                item.status.toLowerCase().includes('aman') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-3.5 max-w-xs text-wrap text-slate-600 font-medium">
                                            {item.kondisi.toLowerCase().includes('maintenance') ? (
                                                <span className="text-red-600 font-bold flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {item.kondisi}
                                                </span>
                                            ) : item.kondisi}
                                        </td>
                                        {isAdmin && (
                                            <td className="p-3.5 text-center">
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {alatBeratList.length === 0 && (
                                    <tr>
                                        <td colSpan={isAdmin ? 12 : 11} className="p-8 text-center text-slate-400 font-medium">
                                            Tidak ada data aset alat berat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SUB-TAB 3: BBM */}
            {activeSubTab === 'bbm' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                                LAPORAN PEMAKAIAN BAHAN BAKAR MINYAK (BBM) TAHUN 2026
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Lahendong Periode Januari sd Desember 2026 (Liter)</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
                            <thead>
                                <tr className="bg-blue-50 border-b border-slate-200">
                                    <th className="p-3 text-slate-600 font-extrabold border-r border-slate-200 text-center uppercase text-[10px]" rowSpan={2}>No</th>
                                    <th className="p-3 text-slate-600 font-extrabold border-r border-slate-200 text-center uppercase text-[10px]" rowSpan={2}>Bulan</th>
                                    <th className="p-3 text-slate-700 font-black border-r border-slate-200 text-center bg-blue-100" colSpan={5}>BAHAN BAKAR MINYAK (BBM) SOLAR</th>
                                </tr>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-2.5 text-slate-600 font-bold border-r border-slate-200 text-center text-[10px] uppercase bg-yellow-100/50">Stock Awal</th>
                                    <th className="p-2.5 text-slate-600 font-bold border-r border-slate-200 text-center text-[10px] uppercase bg-yellow-100/50">Penerimaan</th>
                                    <th className="p-2.5 text-slate-600 font-bold border-r border-slate-200 text-center text-[10px] uppercase bg-yellow-100/50">Pengeluaran AG LHD</th>
                                    <th className="p-2.5 text-slate-600 font-bold border-r border-slate-200 text-center text-[10px] uppercase bg-yellow-100/50">Pengeluaran Proyek LHD</th>
                                    <th className="p-2.5 text-slate-600 font-bold border-r border-slate-200 text-center text-[10px] uppercase bg-yellow-100/50">Stock Akhir</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bbmList.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="p-3 border-r border-slate-100 text-slate-500 text-center font-medium">{idx + 1}</td>
                                        <td className="p-3 border-r border-slate-100 font-bold text-slate-800">{item.bulan}</td>
                                        <td className="p-3 border-r border-slate-100 text-right font-mono text-slate-700">{formatBbm(item.stock_awal_solar)}</td>
                                        <td className="p-3 border-r border-slate-100 text-right font-mono text-green-700 font-bold">{formatBbm(item.penerimaan_solar)}</td>
                                        <td className="p-3 border-r border-slate-100 text-right font-mono text-red-600">{formatBbm(item.pengeluaran_ag_solar)}</td>
                                        <td className="p-3 border-r border-slate-100 text-right font-mono text-slate-600">{formatBbm(item.pengeluaran_proyek_solar)}</td>
                                        <td className="p-3 border-r border-slate-100 text-right font-mono text-blue-700 font-bold">{formatBbm(item.stock_akhir_solar)}</td>
                                    </tr>
                                ))}
                                {bbmList.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                                            Belum ada data pemakaian BBM.
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
                fungsi="LOG" 
                currentUser={currentUser} 
                onOpenFeedback={onOpenFeedback} 
            />
        </div>
    );
}
