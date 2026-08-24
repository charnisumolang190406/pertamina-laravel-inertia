import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CornerDownLeft } from 'lucide-react';

function getPageNumbers(current, total) {
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = [];
    pages.push(1);
    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
    }

    if (current < total - 2) pages.push('...');
    if (!pages.includes(total)) pages.push(total);

    return pages;
}

export default function Pagination({
    currentPage = 1,
    totalItems = 0,
    itemsPerPage = 10,
    onPageChange,
    className = ''
}) {
    const [gotoInput, setGotoInput] = useState('');
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const handleGoTo = () => {
        const pageNum = parseInt(gotoInput, 10);
        if (pageNum >= 1 && pageNum <= totalPages) {
            onPageChange(pageNum);
            setGotoInput('');
        } else {
            alert(`Silakan masukkan nomor halaman antara 1 hingga ${totalPages}`);
        }
    };

    if (totalItems <= 0) return null;

    return (
        <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-slate-200 bg-white ${className}`}>
            <div className="text-[11px] text-slate-500 font-semibold">
                Menampilkan <span className="font-bold text-slate-800">{totalItems > 0 ? startIndex + 1 : 0}</span> - <span className="font-bold text-slate-800">{endIndex}</span> dari <span className="font-bold text-slate-800">{totalItems}</span> data
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {/* Prev Button */}
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
                    title="Halaman Sebelumnya"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers(currentPage, totalPages).map((p, idx) => (
                        p === '...' ? (
                            <span key={`dots-${idx}`} className="px-1.5 text-slate-400 font-bold text-xs">...</span>
                        ) : (
                            <button
                                key={`page-${p}`}
                                onClick={() => onPageChange(p)}
                                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    currentPage === p
                                        ? 'bg-[#00529C] text-white shadow-xs'
                                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                {p}
                            </button>
                        )
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
                    title="Halaman Berikutnya"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Jump Input & Go Button */}
                {totalPages > 1 && (
                    <div className="flex items-center gap-1.5 ml-2">
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            placeholder=""
                            value={gotoInput}
                            onChange={(e) => setGotoInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGoTo()}
                            className="w-14 h-8 px-2 border border-slate-200 bg-slate-50 rounded-xl text-center text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                            onClick={handleGoTo}
                            className="h-8 bg-[#00529C] hover:bg-blue-800 text-white px-3 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                            <CornerDownLeft className="w-3.5 h-3.5" /> Go
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
