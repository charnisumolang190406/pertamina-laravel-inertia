import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Activity } from 'lucide-react';
import Pagination from '../../Components/Pagination';

export default function Index({ auth, logs }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\./g, ':');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Head title="Log Aktivitas Sistem" />
            
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2 text-blue-800 font-bold text-lg">
                            <Activity className="w-5 h-5" />
                            Log Aktivitas Sistem
                        </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-500">
                        {auth.user.name} ({auth.user.role})
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-200">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800">Riwayat Perubahan Data</h3>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                            Menampilkan {logs.data.length} aktivitas terbaru
                        </span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Waktu</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Aktor</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Aksi</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Data Terdampak</th>
                                    <th className="px-6 py-3 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Detail Perubahan</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">
                                            {formatDate(log.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-700">
                                            {log.causer ? log.causer.name : 'Sistem'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 inline-flex text-[10px] leading-5 font-bold rounded-md uppercase tracking-wide
                                                ${log.event === 'created' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                                  log.event === 'updated' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                                                  'bg-red-100 text-red-700 border border-red-200'}`}>
                                                {log.event === 'created' ? 'Tambah' : log.event === 'updated' ? 'Edit' : 'Hapus'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-600">
                                            {log.subject_type ? log.subject_type.split('\\').pop() : '-'} (ID: {log.subject_id})
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-600">
                                            {log.properties && Object.keys(log.properties).length > 0 ? (
                                                <div className="max-w-md overflow-hidden bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    {log.event === 'updated' && log.properties.old && log.properties.attributes && (
                                                        <div className="space-y-1.5">
                                                            {Object.keys(log.properties.attributes).map(key => (
                                                                <div key={key} className="grid grid-cols-[auto_1fr] gap-2">
                                                                    <span className="font-bold text-slate-700">{key}:</span>
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        <span className="line-through text-red-400">{JSON.stringify(log.properties.old[key])}</span>
                                                                        <span className="text-slate-400">➔</span>
                                                                        <span className="text-green-600 font-semibold">{JSON.stringify(log.properties.attributes[key])}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {log.event === 'created' && log.properties.attributes && (
                                                        <div className="space-y-1">
                                                            {Object.entries(log.properties.attributes).map(([key, value]) => (
                                                                <div key={key}><span className="font-bold text-slate-700">{key}:</span> <span className="text-slate-600">{JSON.stringify(value)}</span></div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {logs.data.length === 0 && (
                            <div className="text-center py-12">
                                <Activity className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">Belum ada riwayat aktivitas yang tercatat.</p>
                            </div>
                        )}
                    </div>
                    <Pagination
                        currentPage={logs.current_page}
                        totalItems={logs.total}
                        itemsPerPage={logs.per_page || 10}
                        onPageChange={(p) => router.get('/activity-logs', { page: p }, { preserveState: true })}
                    />
                </div>
            </main>
        </div>
    );
}
