import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Folder, Database, Search, Download, Trash2, FileText, UploadCloud } from 'lucide-react';
import MomTable from '../../Components/MomTable';

export default function Arsip(props) {
    const { arsipList, uploadArchive, momList, auth, onOpenFeedback, activeSubMenu } = props;
    const currentUser = auth.user;

    const [activeSubTab, setActiveSubTab] = useState('dokumen');

    React.useEffect(() => {
        if (activeSubMenu) {
            setActiveSubTab(activeSubMenu);
        }
    }, [activeSubMenu]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterKategori, setFilterKategori] = useState('Semua');

    const categories = ['Semua', 'Laporan Bulanan', 'Kontrak & SCM', 'MOM Rapat', 'SOP & Regulasi', 'Umum'];

    const filteredArsip = arsipList.filter(d => {
        const matchesSearch = d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (d.nomor && d.nomor.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = filterKategori === 'Semua' || d.kategori === filterKategori;
        return matchesSearch && matchesCategory;
    });

    const handleDeleteArsip = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus dokumen ini dari arsip digital?')) {
            router.delete(`/arsip/${id}`);
        }
    };

    const handleDeleteUploadLog = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus log riwayat unggahan ini? (Ini tidak akan menghapus data yang sudah terimpor)')) {
            router.delete(`/arsip/log/${id}`);
        }
    };

    const isAdmin = currentUser?.role?.startsWith('Admin');

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans">
            {/* SUB TAB NAV */}
            <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-2xs">
                <button
                    onClick={() => setActiveSubTab('dokumen')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                        activeSubTab === 'dokumen' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <span className="flex items-center justify-center gap-1.5"><Folder className="w-4 h-4"/> Digital Document Library</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('history')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                        activeSubTab === 'history' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <span className="flex items-center justify-center gap-1.5"><Database className="w-4 h-4"/> Riwayat Unggahan Berkas ({uploadArchive.length})</span>
                </button>
            </div>

            {/* SUB-TAB 1: DIGITAL LIBRARY */}
            {activeSubTab === 'dokumen' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Category List Left */}
                    <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Folder / Kategori</h4>
                        <div className="space-y-1">
                            {categories.map(cat => {
                                const count = cat === 'Semua' ? arsipList.length : arsipList.filter(d => d.kategori === cat).length;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setFilterKategori(cat)}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-bold transition-colors cursor-pointer ${
                                            filterKategori === cat 
                                                ? 'bg-blue-50 text-blue-700' 
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span>{cat}</span>
                                        <span className={`px-1.5 py-0.5 text-[9px] rounded-md font-bold ${
                                            filterKategori === cat ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-500'
                                        }`}>{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Document Table Right */}
                    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-sm">Dokumen & Laporan Tersimpan</h3>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Daftar arsip digital, regulasi SOP, dan korespondensi.</p>
                            </div>
                            <div className="relative w-full md:w-64">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <Search className="w-3.5 h-3.5" />
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-250 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                                    placeholder="Cari nama atau nomor berkas..."
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-3.5 text-slate-500 font-bold w-10 text-center">No</th>
                                        <th className="p-3.5 text-slate-500 font-bold">Nama Berkas Dokumen</th>
                                        <th className="p-3.5 text-slate-500 font-bold">Kategori</th>
                                        <th className="p-3.5 text-slate-500 font-bold">Tgl Unggah</th>
                                        <th className="p-3.5 text-slate-500 font-bold">Oleh</th>
                                        <th className="p-3.5 text-slate-500 font-bold text-center w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredArsip.map((doc, idx) => (
                                        <tr key={doc.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="p-3.5 text-slate-500 text-center font-medium">{idx + 1}</td>
                                            <td className="p-3.5 max-w-xs truncate">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                                    <span className="font-bold text-slate-800" title={doc.nama}>{doc.nama}</span>
                                                </div>
                                            </td>
                                            <td className="p-3.5 text-slate-600 font-semibold">{doc.kategori}</td>
                                            <td className="p-3.5 text-slate-500 font-semibold">{doc.tanggal}</td>
                                            <td className="p-3.5 text-slate-600 font-medium">{doc.uploaded_by}</td>
                                            <td className="p-3.5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <a
                                                        href={doc.file_path}
                                                        download
                                                        className="p-1 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                                                        title="Download Berkas"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                    </a>
                                                    {isAdmin && (
                                                        <button
                                                            onClick={() => handleDeleteArsip(doc.id)}
                                                            className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"
                                                            title="Hapus Berkas"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredArsip.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                                                Tidak ada dokumen arsip yang cocok.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* SUB-TAB 2: UPLOAD HISTORY */}
            {activeSubTab === 'history' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                        <h3 className="font-extrabold text-slate-800 text-sm">Riwayat Aktivitas Unggahan & Sinkronisasi</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Log aktivitas audit berkas laporan yang diimpor ke dalam database.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-3.5 text-slate-500 font-bold w-10 text-center">No</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Nama Berkas</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Ukuran</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Tipe Modul Laporan</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Waktu Upload</th>
                                    <th className="p-3.5 text-slate-500 font-bold text-center">Baris Data</th>
                                    <th className="p-3.5 text-slate-500 font-bold">Oleh</th>
                                    {isAdmin && <th className="p-3.5 text-slate-500 font-bold text-center w-20">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {uploadArchive.map((log, idx) => (
                                    <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="p-3.5 text-slate-500 text-center font-medium">{idx + 1}</td>
                                        <td className="p-3.5 font-bold text-slate-800">{log.filename}</td>
                                        <td className="p-3.5 font-mono text-slate-500">{log.fileSize}</td>
                                        <td className="p-3.5 font-semibold text-slate-600">{log.type}</td>
                                        <td className="p-3.5 text-slate-500 font-semibold">{log.timestamp}</td>
                                        <td className="p-3.5 text-center font-bold text-slate-700">{log.rowCount} Baris</td>
                                        <td className="p-3.5 text-slate-600 font-medium">{log.uploadedBy}</td>
                                        {isAdmin && (
                                            <td className="p-3.5 text-center">
                                                <button
                                                    onClick={() => handleDeleteUploadLog(log.id)}
                                                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"
                                                    title="Hapus Log"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {uploadArchive.length === 0 && (
                                    <tr>
                                        <td colSpan={isAdmin ? 8 : 7} className="p-8 text-center text-slate-400 font-medium">
                                            Belum ada riwayat aktivitas unggahan.
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
                fungsi="BS" 
                currentUser={currentUser} 
                onOpenFeedback={onOpenFeedback} 
            />
        </div>
    );
}
