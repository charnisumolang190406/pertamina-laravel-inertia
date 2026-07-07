import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, MessageSquare, AlertCircle, Check, X, FileCheck2 } from 'lucide-react';

export default function MomTable({ momList, fungsi, currentUser, onOpenFeedback }) {
    const filteredMoms = momList.filter(m => m.fungsi === fungsi);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, reset, errors } = useForm({
        fungsi: fungsi,
        isu: '',
        tindak_lanjut: '',
        status: 'Menunggu Review',
    });

    const openAdd = () => {
        reset();
        setEditingId(null);
        setData({
            fungsi: fungsi,
            isu: '',
            tindak_lanjut: '',
            status: 'Menunggu Review',
        });
        setShowAddModal(true);
    };

    const openEdit = (mom) => {
        reset();
        setEditingId(mom.id);
        setData({
            fungsi: mom.fungsi,
            isu: mom.isu,
            tindak_lanjut: mom.tindak_lanjut,
            status: mom.status,
        });
        setShowAddModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(`/mom/${editingId}`, {
                onSuccess: () => {
                    setShowAddModal(false);
                    reset();
                }
            });
        } else {
            post('/mom', {
                onSuccess: () => {
                    setShowAddModal(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengajuan review ini?')) {
            router.delete(`/mom/${id}`);
        }
    };

    const isAdminFor = (checkFungsi) => {
        if (currentUser.role === 'Admin') return true;
        if (currentUser.role === 'Admin Bisnis Planning and Budgeting' && checkFungsi === 'BS') return true;
        if (currentUser.role === 'Admin HC' && checkFungsi === 'HC') return true;
        if (currentUser.role === 'Admin SCM' && checkFungsi === 'SCM') return true;
        if (currentUser.role === 'Admin Logistik' && checkFungsi === 'LOG') return true;
        return false;
    };

    const canManageMom = (mom) => {
        if (currentUser.role === 'Admin') return true;
        if (currentUser.role === 'Admin Bisnis Planning and Budgeting' && (mom.fungsi === 'BS' || mom.fungsi === 'MTC')) return true;
        if (currentUser.role === 'Admin HC' && (mom.fungsi === 'HC' || mom.fungsi === 'BS')) return true;
        if (currentUser.role === 'Admin SCM' && mom.fungsi === 'SCM') return true;
        if (currentUser.role === 'Admin Logistik' && mom.fungsi === 'LOG') return true;
        return false;
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-50 text-green-700 border border-green-200';
            case 'Revisi':
                return 'bg-red-50 text-red-700 border border-red-200';
            default:
                return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                        <FileCheck2 className="w-5 h-5 text-blue-600" />
                        Feedback Loop & Approval (Sistem Review)
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Siklus review persetujuan laporan dan arahan tindak lanjut khusus pilar/fungsi {fungsi}.</p>
                </div>
                {isAdminFor(fungsi === 'HC' ? 'HC' : fungsi) && (
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-green-500/10 transition-all active:scale-95 cursor-pointer animate-[pulse_3s_infinite]"
                    >
                        <Plus className="w-3.5 h-3.5" /> Ajukan Review Baru
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-3.5 text-slate-500 font-bold w-20">Fungsi</th>
                            <th className="p-3.5 text-slate-500 font-bold max-w-xs text-wrap">Detail Laporan / Isu</th>
                            <th className="p-3.5 text-slate-500 font-bold max-w-xs text-wrap">Tindak Lanjut Laporan</th>
                            <th className="p-3.5 text-slate-500 font-bold w-28">Status Approval</th>
                            {(currentUser.role.startsWith('Admin') || currentUser.role === 'Manager BS' || currentUser.role.startsWith('Kepala') || currentUser.role === 'Management Executive') && (
                                <th className="p-3.5 text-slate-500 font-bold text-center w-24">Aksi</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredMoms.map(mom => (
                            <tr key={mom.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-3.5 font-extrabold text-slate-700">{mom.fungsi}</td>
                                <td className="p-3.5 max-w-xs text-wrap">
                                    <div className="font-bold text-slate-800 text-xs">{mom.isu}</div>
                                    {mom.feedback && (
                                        <div className="mt-2 text-[10px] bg-slate-50 text-slate-700 border border-slate-200 rounded-xl p-2.5 max-w-xs whitespace-normal shadow-2xs font-semibold">
                                            <span className="font-extrabold block text-blue-700 mb-0.5">Komentar / Catatan Reviewer:</span>
                                            <span className="font-medium text-slate-600">{mom.feedback}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="p-3.5 max-w-xs text-wrap text-slate-600 font-medium leading-relaxed">{mom.tindak_lanjut}</td>
                                <td className="p-3.5">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold shadow-2xs ${getStatusStyle(mom.status)}`}>
                                        {mom.status}
                                    </span>
                                </td>
                                {(currentUser.role.startsWith('Admin') || currentUser.role === 'Manager BS' || currentUser.role.startsWith('Kepala') || currentUser.role === 'Management Executive') && (
                                    <td className="p-3.5 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            {canManageMom(mom) && (
                                                <>
                                                    <button
                                                        onClick={() => openEdit(mom)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                                                        title="Edit Pengajuan"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(mom.id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                                                        title="Hapus Pengajuan"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            )}
                                            {(currentUser.role === 'Manager BS' || currentUser.role.startsWith('Kepala')) && (
                                                <button
                                                    onClick={() => onOpenFeedback(mom.id, mom.feedback, mom.status)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-extrabold shadow-sm cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                                                    title="Beri Review & Keputusan"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5" /> Review
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {filteredMoms.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                                    Tidak ada laporan review khusus untuk fungsi {fungsi}.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ADD / EDIT ISSUES MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-in-out]">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-sm">
                                {editingId ? 'Edit Laporan Review' : 'Ajukan Laporan Review Baru'}
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detail Laporan / Isu Utama</label>
                                <input
                                    type="text"
                                    value={data.isu}
                                    onChange={(e) => setData('isu', e.target.value)}
                                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                                    placeholder="Contoh: Rekap Lembur Supir Bulan Mei 2026"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tindak Lanjut / Penjelasan Laporan</label>
                                <textarea
                                    value={data.tindak_lanjut}
                                    onChange={(e) => setData('tindak_lanjut', e.target.value)}
                                    rows={3}
                                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold resize-none"
                                    placeholder="Contoh: Total upah lembur sudah disesuaikan dengan daftar hadir lembur."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status Review</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-700"
                                    disabled={!currentUser.role.startsWith('Admin') && currentUser.role !== 'Admin'}
                                >
                                    <option value="Menunggu Review">Menunggu Review</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Revisi">Revisi</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 text-xs font-bold pt-2">
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
                                    <Check className="w-4 h-4" /> Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
