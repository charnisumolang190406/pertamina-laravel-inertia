import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, TrendingUp, UploadCloud } from 'lucide-react';
import UploadWizardModal from '../../Components/UploadWizardModal';

export default function FinancialPerformance({ auth, financials }) {
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // Helper to format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Head title="Financial Performance" />
            
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2 text-blue-800 font-bold text-lg">
                            <TrendingUp className="w-5 h-5" />
                            Financial Performance
                        </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-500">
                        {auth.user.name} ({auth.user.role})
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Data Kinerja Finansial</h2>
                        <p className="text-sm text-slate-500">Kelola dan lihat data performa keuangan per tahun.</p>
                    </div>
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Upload Data (Excel)
                    </button>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Cost</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Depreciation</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Net Profit</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">ABO</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">EBITDA</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Cost/kWh</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {financials && financials.length > 0 ? (
                                    financials.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{item.year}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{formatCurrency(item.revenue)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{formatCurrency(item.cost)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{formatCurrency(item.depreciation)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800 text-right">{formatCurrency(item.net_profit)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{formatCurrency(item.abo)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-700 text-right">{formatCurrency(item.ebitda)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{Number(item.cost_per_kwh).toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-8 text-center text-sm text-slate-500">
                                            Belum ada data Financial Performance. Silakan upload Excel.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <UploadWizardModal 
                isOpen={isUploadOpen} 
                onClose={() => setIsUploadOpen(false)} 
            />
        </div>
    );
}
