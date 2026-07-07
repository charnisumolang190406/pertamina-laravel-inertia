import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { X, MessageSquare, Check, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose, momId, initialFeedback = '', initialStatus = 'Approved' }) {
    const [feedbackText, setFeedbackText] = useState('');
    const [status, setStatus] = useState('Approved');

    useEffect(() => {
        if (isOpen) {
            // Remove the "- [Reviewer Name]" signature if editing so they don't double append
            const cleanText = initialFeedback.replace(/\s*-\s*.+$/, '').trim();
            setFeedbackText(cleanText);
            setStatus(initialStatus || 'Approved');
        }
    }, [isOpen, initialFeedback, initialStatus]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(`/mom/${momId}/feedback`, {
            feedback: feedbackText,
            status: status
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-[fadeIn_0.2s_ease-in-out]">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2 text-blue-600">
                        <MessageSquare className="w-5 h-5" />
                        <h3 className="font-bold text-slate-800 text-sm">Feedback & Review</h3>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Status Approval Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Keputusan / Status Review
                        </label>
                        <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => setStatus('Approved')}
                                className={`flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-2xl border cursor-pointer transition-all ${
                                    status === 'Approved'
                                        ? 'bg-green-50 border-green-500 text-green-700 ring-2 ring-green-500/10'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                                Approved
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus('Revisi')}
                                className={`flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-2xl border cursor-pointer transition-all ${
                                    status === 'Revisi'
                                        ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-500/10'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                                Revisi
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Catatan / Arahan Reviewer
                        </label>
                        <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            rows={4}
                            className="w-full p-3 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium resize-none"
                            placeholder="Tulis arahan tindak lanjut pilar di sini..."
                            required
                        />
                        <p className="text-[10px] text-slate-400 font-semibold mt-2">
                            Catatan ini akan otomatis ditandai dengan nama Anda di baris feedback.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 text-xs font-bold pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-all active:scale-95"
                        >
                            <Check className="w-4 h-4" /> Simpan Catatan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
