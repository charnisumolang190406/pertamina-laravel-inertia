import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { 
  FileSignature, Calculator, CheckCircle, AlertCircle, Plus, Trash2, Database, UploadCloud, Check, X 
} from 'lucide-react';
import KpiCard from '../../Components/KpiCard';
import MomTable from '../../Components/MomTable';

export default function Scm(props) {
    const { scmList, momList, auth, onOpenFeedback } = props;
    const currentUser = auth.user;

    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, reset, errors } = useForm({
        nomor: '',
        nama: '',
        vendor: '',
        nilai: '',
        mulai: '',
        selesai: '',
        progres: 0,
        status: 'Aktif',
        fungsi: 'BS',
    });

    const filteredScm = scmList.filter(c => 
        c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nomor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalContracts = scmList.length;
    const totalValue = scmList.reduce((acc, c) => acc + c.nilai, 0);
    const activeContracts = scmList.filter(c => c.status === 'Aktif' || c.status === 'Amandemen').length;
    const criticalContracts = scmList.filter(c => c.status === 'Kritis').length;

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const handleAddContractSubmit = (e) => {
        e.preventDefault();
        post('/scm', {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            }
        });
    };

    const handleDeleteScm = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data monitoring kontrak ini?')) {
            router.delete(`/scm/${id}`);
        }
    };

    const handleResetScmData = (mode) => {
        if (mode === 'clear') {
            if (confirm('Apakah Anda yakin ingin menghapus SEMUA data kontrak monitoring?')) {
                router.post('/scm/clear');
            }
        } else if (mode === 'default') {
            if (confirm('Apakah Anda yakin ingin mengembalikan data kontrak ke data default awal?')) {
                router.post('/scm/reset');
            }
        }
    };

    const isAdmin = currentUser?.role?.startsWith('Admin');

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans text-slate-800">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard 
                    title="Total Kontrak" 
                    value={`${totalContracts} Kontrak`} 
                    subtitle="Mencakup semua fungsi" 
                    icon={FileSignature} 
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50" 
                />
                <KpiCard 
                    title="Nilai Total Kontrak" 
                    value={formatCurrency(totalValue)} 
                    subtitle="PGE Area Lahendong" 
                    icon={Calculator} 
                    colorClass="text-green-600" 
                    bgClass="bg-green-50" 
                />
                <KpiCard 
                    title="Kontrak Aktif" 
                    value={`${activeContracts} Kontrak`} 
                    subtitle="Status Aktif & Amandemen" 
                    icon={CheckCircle} 
                    colorClass="text-indigo-600" 
                    bgClass="bg-indigo-50" 
                />
                <KpiCard 
                    title="Kontrak Status Kritis" 
                    value={`${criticalContracts} Unit`} 
                    subtitle="Butuh perhatian / percepatan" 
                    icon={AlertCircle} 
                    colorClass="text-red-600" 
                    bgClass="bg-red-50" 
                />
            </div>

            {/* ACTION BUTTONS & SEARCH BAR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-2 text-xs font-bold">
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-all active:scale-95"
                            >
                                <Plus className="w-4 h-4" /> Tambah Kontrak
                            </button>
                            <button
                                onClick={() => handleResetScmData('clear')}
                                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-xl border border-red-200 cursor-pointer transition-all active:scale-95"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Kosongkan Kontrak
                            </button>
                            <button
                                onClick={() => handleResetScmData('default')}
                                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer transition-all active:scale-95"
                            >
                                <Database className="w-3.5 h-3.5" /> Reset Default
                            </button>
                        </>
                    )}
                </div>

                <div className="relative w-full md:w-64">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-250 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                        placeholder="Cari kontrak, nomor, vendor..."
                    />
                </div>
            </div>

            {/* CONTRACTS TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                    <h3 className="font-extrabold text-slate-800 text-sm">Monitoring Progress & Nilai Kontrak Vendor</h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Daftar keseluruhan pengadaan jasa dan barang di PGE Area Lahendong.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-3.5 text-slate-500 font-bold">Nomor Kontrak</th>
                                <th className="p-3.5 text-slate-500 font-bold max-w-xs text-wrap">Nama Pekerjaan Kontrak</th>
                                <th className="p-3.5 text-slate-500 font-bold">Mitra Kerja / Vendor</th>
                                <th className="p-3.5 text-slate-500 font-bold text-right">Nilai Kontrak</th>
                                <th className="p-3.5 text-slate-500 font-bold text-center">Jangka Waktu</th>
                                <th className="p-3.5 text-slate-500 font-bold text-center w-24">Progress</th>
                                <th className="p-3.5 text-slate-500 font-bold w-24">Status</th>
                                {isAdmin && <th className="p-3.5 text-slate-500 font-bold text-center w-20">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredScm.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="p-3.5 font-mono text-slate-600 font-bold">{item.nomor}</td>
                                    <td className="p-3.5 max-w-xs text-wrap font-bold text-slate-800">{item.nama}</td>
                                    <td className="p-3.5 text-slate-600 font-semibold">{item.vendor}</td>
                                    <td className="p-3.5 text-right font-mono font-bold text-slate-900">{formatCurrency(item.nilai)}</td>
                                    <td className="p-3.5 text-center text-slate-500 font-semibold">
                                        {item.mulai} s/d {item.selesai}
                                    </td>
                                    <td className="p-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200 shrink-0">
                                                <div 
                                                    className={`h-full rounded-full ${
                                                        item.progres >= 100 ? 'bg-green-500' :
                                                        item.progres >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                                                    }`}
                                                    style={{ width: `${Math.min(item.progres, 100)}%` }}
                                                />
                                            </div>
                                            <span className="font-bold text-slate-700 text-[10px]">{item.progres}%</span>
                                        </div>
                                    </td>
                                    <td className="p-3.5">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold shadow-2xs ${
                                            item.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                                            item.status === 'Aktif' ? 'bg-blue-100 text-blue-800' :
                                            item.status === 'Amandemen' ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td className="p-3.5 text-center">
                                            <button
                                                onClick={() => handleDeleteScm(item.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                                title="Hapus Kontrak"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {filteredScm.length === 0 && (
                                <tr>
                                    <td colSpan={isAdmin ? 8 : 7} className="p-8 text-center text-slate-400 font-medium">
                                        Tidak ada data monitoring kontrak vendor.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD CONTRACT MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-in-out]">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-sm">Tambah Data Monitoring Kontrak</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddContractSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nomor Kontrak</label>
                                    <input
                                        type="text"
                                        value={data.nomor}
                                        onChange={(e) => setData('nomor', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                                        placeholder="Contoh: 012/PGE-LHD/BS/2026"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mitra / Vendor</label>
                                    <input
                                        type="text"
                                        value={data.vendor}
                                        onChange={(e) => setData('vendor', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                                        placeholder="Contoh: PT Kawanua Multi Mandiri"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Pekerjaan</label>
                                <textarea
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    rows={2}
                                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800 resize-none"
                                    placeholder="Tulis judul lengkap lingkup pekerjaan kontrak..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nilai Kontrak (Rp)</label>
                                    <input
                                        type="number"
                                        value={data.nilai}
                                        onChange={(e) => setData('nilai', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                                        placeholder="Contoh: 1500000000"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori / Fungsi</label>
                                    <select
                                        value={data.fungsi}
                                        onChange={(e) => setData('fungsi', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-700"
                                    >
                                        <option value="BS">BUSINESS SUPPORT (BS)</option>
                                        <option value="SCM">SCM / KONTRAK</option>
                                        <option value="MTC">MAINTENANCE (MTC)</option>
                                        <option value="HSSE">HSSE / LINGKUNGAN</option>
                                        <option value="OP">OPERASI (OP)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={data.mulai}
                                        onChange={(e) => setData('mulai', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Selesai</label>
                                    <input
                                        type="date"
                                        value={data.selesai}
                                        onChange={(e) => setData('selesai', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status Awal</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-700"
                                    >
                                        <option value="Aktif">Aktif</option>
                                        <option value="Amandemen">Amandemen</option>
                                        <option value="Selesai">Selesai</option>
                                        <option value="Kritis">Kritis (Terlambat)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Progress Fisik (%)</label>
                                    <input
                                        type="number"
                                        value={data.progres}
                                        onChange={(e) => setData('progres', e.target.value)}
                                        min="0"
                                        max="100"
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 text-xs font-bold pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                                >
                                    <Check className="w-4 h-4" /> Simpan Kontrak
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MOM TABLE AT BOTTOM */}
            <MomTable 
                momList={momList} 
                fungsi="SCM" 
                currentUser={currentUser} 
                onOpenFeedback={onOpenFeedback} 
            />
        </div>
    );
}
