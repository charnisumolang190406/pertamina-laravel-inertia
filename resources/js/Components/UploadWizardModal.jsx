import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import { X, UploadCloud, CheckCircle2, ChevronRight, AlertCircle, RefreshCw, Table } from 'lucide-react';

const MAPPING_SPECS = {
    scm: { nomor: 'Nomor Kontrak', nama: 'Nama Pekerjaan', vendor: 'Mitra/Vendor', nilai: 'Nilai Kontrak', mulai: 'Tgl Mulai', selesai: 'Tgl Selesai', progres: 'Progres (%)', status: 'Status', fungsi: 'Fungsi' },
    logistik: { item_number: 'Item Number', deskripsi: 'Deskripsi', uom: 'UoM', stok: 'Jumlah Stok', kategori: 'Kategori', lokasi: 'Lokasi' },
    lembur_tad: { nopok: 'Nopek/Nopok', nama: 'Nama TAD', jabatan: 'Jabatan', fungsi: 'Fungsi', upah: 'Upah Pokok', jam_lembur: 'Jam Lembur', lembur_val: 'Nilai Lembur (Rp)', periode: 'Periode (Bulan Tahun)' },
    budget_detail: { fundCent: 'Fund Center', name: 'Deskripsi Cost Center', commitItem: 'Commitment Item', text: 'Nama Pos Anggaran', budget: 'Target RKAP', consumed: 'Consumed', actual: 'Realisasi Pemakaian', available: 'Sisa Anggaran', kategori: 'Kategori (ABI/ABO)' },
    alat_berat: { jenis: 'Jenis Alat', nopol: 'Nomor Polisi', expired_kir: 'KIR Expired', expired_stnk: 'STNK Expired', expired_sio: 'SIO Expired', expired_sia: 'SIA Expired', status: 'Status' },
    perbaikan_rumdin: { nomor_rumah: 'Nomor Rumah', estimasi: 'Estimasi Biaya', realisasi: 'Realisasi Biaya', progress: 'Progress (%)', keterangan: 'Keterangan' },
    hc: { bulan: 'Periode', nama: 'Nama Pegawai', jenis: 'Jenis Mutasi', fungsi: 'Fungsi Tujuan', keterangan: 'Keterangan' },
    tad_mutation: { bulan: 'Periode', nama: 'Nama TAD', jenis: 'Jenis Mutasi', peran: 'Peran Kerja', vendor: 'Vendor Penyedia', keterangan: 'Keterangan' },
    it_asset: { nomor_seri: 'Nomor Seri / Tag', jenis: 'Jenis Aset', merek: 'Merek/Model', user: 'Pengguna', fungsi: 'Fungsi', status: 'Status' },
    mom: { fungsi: 'Fungsi', isu: 'Isu / Detail Laporan', tindak_lanjut: 'Rencana Tindak Lanjut' },
    master_organik: { nopok: 'No. Pegawai', nama: 'Nama Pegawai', gender: 'Jenis Kelamin', umur: 'Umur', jabatan: 'Jabatan', fungsi: 'Fungsi/Departemen' },
    master_tad: { nama: 'Nama Lengkap', peran: 'Peran Kerja', vendor: 'Vendor Penyedia', status: 'Status Kontrak' },
    master_pensiun: { nama: 'Nama Karyawan', jabatan: 'Jabatan Terakhir', umur: 'Umur Pensiun', tahun: 'Tahun Pensiun', tanggal: 'Tanggal Efektif', keterangan: 'Keterangan' }
};

const MAPPING_DEFAULTS = {
    scm: { nomor: '', nama: 'Kontrak Baru', vendor: 'PT Vendor', nilai: 0, mulai: '', selesai: '', progres: 0, status: 'Aktif', fungsi: 'BS' },
    logistik: { item_number: '', deskripsi: 'Item Baru', uom: 'PCS', stok: 0, kategori: 'Fast Moving', lokasi: 'Gudang LHD' },
    lembur_tad: { nopok: '-', nama: 'Pekerja TAD', jabatan: 'Staff', fungsi: 'BUSINESS SUPPORT', upah: 0, jam_lembur: 0, lembur_val: 0, periode: '' },
    budget_detail: { fundCent: '', name: 'Pos Anggaran', commitItem: '500000', text: '', budget: 0, consumed: 0, actual: 0, available: 0, kategori: 'ABO' },
    alat_berat: { jenis: 'Forklift', nopol: '-', expired_kir: '', expired_stnk: '', expired_sio: '', expired_sia: '', status: 'Optimal' },
    perbaikan_rumdin: { nomor_rumah: 'N-00', estimasi: 0, realisasi: 0, progress: 0, keterangan: '' },
    hc: { bulan: '', nama: 'Nama Karyawan', jenis: 'Masuk', fungsi: 'BS', keterangan: '' },
    tad_mutation: { bulan: '', nama: 'Nama TAD', jenis: 'Masuk', peran: 'Staff', vendor: 'PT Vendor', keterangan: '' },
    it_asset: { nomor_seri: '', jenis: 'PC', merek: 'HP', user: 'Staff', fungsi: 'BS', status: 'Optimal' },
    mom: { fungsi: 'BS', isu: 'Isu Laporan', tindak_lanjut: 'Segera diproses' },
    master_organik: { nopok: '-', nama: 'Nama Pegawai', gender: 'Laki-laki', umur: 30, jabatan: 'Staff', fungsi: 'Operasi' },
    master_tad: { nama: 'Nama TAD', peran: 'Security', vendor: 'PT Daya', status: 'Aktif' },
    master_pensiun: { nama: 'Nama Pensiun', jabatan: 'Staff', umur: 56, tahun: 2026, tanggal: '2026-01-01', keterangan: 'Pensiun Normal' }
};

export default function UploadWizardModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [step, setStep] = useState(1); // 1: Select Type, 2: Upload, 3: Preview & Map
    const [dataType, setDataType] = useState('lembur_tad');
    const [file, setFile] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [rawRows, setRawRows] = useState([]);
    const [mappings, setMappings] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    const fileInputRef = useRef(null);

    const groupedDataTypes = {
        'Human Capital (HC)': [
            { id: 'master_organik', label: 'Master Data Pegawai Organik (Demografi & Gender)' },
            { id: 'master_tad', label: 'Master Data Tenaga Alih Daya (Daftar Aktif TAD)' },
            { id: 'hc', label: 'Mutasi Organik (HC)' },
            { id: 'tad_mutation', label: 'Mutasi Tenaga Alih Daya (TAD)' },
            { id: 'lembur_tad', label: 'Data Lembur TAD (Human Capital)' },
        ],
        'Logistik': [
            { id: 'logistik', label: 'Stok Material Gudang (Logistik)' },
            { id: 'alat_berat', label: 'Aset Alat Berat & KIR (Logistik)' },
            { id: 'perbaikan_rumdin', label: 'Perbaikan Rumah Dinas (Logistik)' },
        ],
        'Budgeting & SCM': [
            { id: 'budget_detail', label: 'Data Detail Budget ABI/ABO (Budgeting)' },
            { id: 'scm', label: 'Data Monitoring Kontrak (SCM)' },
        ],
        'Lainnya': [
            { id: 'it_asset', label: 'Aset Perangkat IT (IT Asset)' },
            { id: 'mom', label: 'Agenda Feedback Loop & Review (MOM)' }
        ]
    };

    const handleTypeSelect = (type) => {
        setDataType(type);
        setStep(2);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setIsProcessing(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (json.length === 0) {
                    alert('File kosong atau tidak dapat dibaca.');
                    setIsProcessing(false);
                    return;
                }

                // Locate header row: Find the row within the first 15 rows that has the most non-empty columns
                let headerIdx = 0;
                let maxCols = 0;
                for (let i = 0; i < Math.min(json.length, 15); i++) {
                    const row = json[i];
                    if (row && Array.isArray(row)) {
                        const filledCols = row.filter(c => c !== null && c !== undefined && String(c).trim() !== '').length;
                        if (filledCols > maxCols) {
                            maxCols = filledCols;
                            headerIdx = i;
                        }
                    }
                }

                const sheetHeaders = Array.from(json[headerIdx] || []).map(h => String(h || '').trim());
                const parsedRows = json.slice(headerIdx + 1)
                    .map(row => Array.isArray(row) ? row.map(cell => cell === null || cell === undefined ? '' : String(cell).trim()) : [])
                    .filter(row => row.length > 0 && row.some(c => c.length > 0));

                setHeaders(sheetHeaders);
                setRawRows(parsedRows);

                // Auto-map logic based on similarity
                const initialMappings = {};
                const specKeys = Object.keys(MAPPING_SPECS[dataType]);

                specKeys.forEach(key => {
                    const label = MAPPING_SPECS[dataType][key].toLowerCase();
                    const keyLower = key.toLowerCase();

                    // Find index in headers matching label or key name
                    const idx = sheetHeaders.findIndex(h => {
                        const hLower = h.toLowerCase();
                        return hLower.includes(label) || label.includes(hLower) || hLower.includes(keyLower) || keyLower.includes(hLower);
                    });

                    initialMappings[key] = idx !== -1 ? idx : 0; // Default to first column if no match
                });

                setMappings(initialMappings);
                setStep(3);
            } catch (err) {
                console.error(err);
                alert('Gagal memproses file Excel: ' + err.message);
            } finally {
                setIsProcessing(false);
            }
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleMappingChange = (key, valIdx) => {
        setMappings(prev => ({
            ...prev,
            [key]: parseInt(valIdx)
        }));
    };

    const handleSave = () => {
        if (rawRows.length === 0) return;

        setIsProcessing(true);

        const cleanInt = (v) => {
            if (v === undefined || v === null) return 0;
            return parseInt(String(v).replace(/[^0-9-]/g, '')) || 0;
        };

        const cleanFloat = (v) => {
            if (v === undefined || v === null) return 0;
            return parseFloat(String(v).replace(/[^0-9.-]/g, '')) || 0;
        };

        const cleanString = (v) => {
            if (v === undefined || v === null) return '';
            return String(v).trim();
        };

        const getVal = (row, key, fallback = '') => {
            const idx = mappings[key];
            if (idx === undefined || idx === -1 || !row) return fallback;
            return row[idx] !== undefined ? row[idx] : fallback;
        };

        // Format rows according to mapping
        const formattedRows = rawRows.map(row => {
            const item = {};
            const specKeys = Object.keys(MAPPING_SPECS[dataType]);
            const defaults = MAPPING_DEFAULTS[dataType];

            specKeys.forEach(key => {
                const rawVal = getVal(row, key);
                const typeVal = typeof defaults[key];

                if (typeVal === 'number') {
                    item[key] = key.includes('jam') || key.includes('progress') ? cleanFloat(rawVal) : cleanInt(rawVal);
                } else {
                    item[key] = cleanString(rawVal) || defaults[key];
                }
            });
            return item;
        });

        // Submit to Laravel backend via Inertia post
        router.post('/import', {
            type: dataType,
            rows: formattedRows,
            filename: file.name,
            fileSize: `${(file.size / 1024).toFixed(1)} KB`
        }, {
            onSuccess: () => {
                onClose();
            },
            onFinish: () => {
                setIsProcessing(false);
            }
        });
    };

    const resetWizard = () => {
        setStep(1);
        setFile(null);
        setHeaders([]);
        setRawRows([]);
        setMappings({});
    };

    return (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-[fadeIn_0.2s_ease-in-out]">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2 text-blue-600">
                        <UploadCloud className="w-5 h-5 animate-bounce" />
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-sm">Upload Laporan / Excel</h3>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Data Validation & Auto-Archive UI</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Wizard Steps indicator */}
                <div className="px-6 py-3 border-b border-slate-100 flex justify-around items-center text-[10px] font-extrabold text-slate-400 select-none">
                    <div className={`flex items-center gap-1 ${step >= 1 ? 'text-blue-600' : ''}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center border font-mono ${step >= 1 ? 'bg-blue-100 border-blue-500' : 'bg-slate-100'}`}>1</span>
                        KATEGORI
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <div className={`flex items-center gap-1 ${step >= 2 ? 'text-blue-600' : ''}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center border font-mono ${step >= 2 ? 'bg-blue-100 border-blue-500' : 'bg-slate-100'}`}>2</span>
                        UNGGAH EXCEL
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <div className={`flex items-center gap-1 ${step >= 3 ? 'text-blue-600' : ''}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center border font-mono ${step >= 3 ? 'bg-blue-100 border-blue-500' : 'bg-slate-100'}`}>3</span>
                        PREVIEW & MAPS
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                    {/* STEP 1: SELECT TYPE */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-800 text-xs text-center mb-4">Pilih kategori data laporan yang ingin Anda impor:</h4>
                            <div className="space-y-6">
                                {Object.keys(groupedDataTypes).map(groupName => (
                                    <div key={groupName} className="space-y-3">
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 border-b border-slate-100 pb-1">{groupName}</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {groupedDataTypes[groupName].map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => handleTypeSelect(t.id)}
                                                    className="text-left px-4 py-3 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 rounded-2xl cursor-pointer text-xs font-bold text-slate-700 transition-all flex justify-between items-center group active:scale-98"
                                                >
                                                    <span className="leading-relaxed pr-2">{t.label}</span>
                                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1 shrink-0" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: FILE UPLOAD */}
                    {step === 2 && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full max-w-md border-2 border-dashed border-slate-250 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/10 p-8 rounded-3xl cursor-pointer text-center transition-all flex flex-col items-center justify-center space-y-3 group"
                            >
                                <UploadCloud className="w-12 h-12 text-slate-400 group-hover:text-blue-500 transition-colors animate-pulse" />
                                <div>
                                    <h4 className="text-xs font-extrabold text-slate-700">Tarik berkas Excel di sini, atau klik untuk memilih</h4>
                                    <span className="text-[10px] text-slate-400 font-bold mt-1 block">Hanya berkas .xlsx, .xls atau .csv yang didukung.</span>
                                </div>
                            </div>

                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept=".xlsx,.xls,.csv" 
                            />

                            <button 
                                onClick={resetWizard}
                                className="text-xs text-slate-500 hover:text-slate-700 font-bold transition-colors cursor-pointer"
                            >
                                Kembali ke Kategori
                            </button>
                        </div>
                    )}

                    {/* STEP 3: MAPPING & PREVIEW */}
                    {step === 3 && (
                        <div className="space-y-6">
                            {/* File Info Alert */}
                            <div className="bg-blue-50/60 p-3 border border-blue-150 rounded-2xl text-[11px] font-bold text-blue-800 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Berhasil membaca berkas: {file?.name} ({rawRows.length} baris data)</span>
                                </div>
                                <button 
                                    onClick={resetWizard} 
                                    className="text-xs font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                                >
                                    <RefreshCw className="w-3 h-3" /> Ganti File
                                </button>
                            </div>

                            {/* COLUMN MAPPING SECTION */}
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <Table className="w-3.5 h-3.5" /> Konfigurasi Pemetaan Kolom Excel
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.keys(MAPPING_SPECS[dataType]).map(key => (
                                        <div key={key} className="flex flex-col gap-1.5">
                                            <span className="text-[10px] font-bold text-slate-600 flex justify-between">
                                                <span>{MAPPING_SPECS[dataType][key]}</span>
                                                <span className="font-mono text-slate-400 font-semibold">{key}</span>
                                            </span>
                                            <select
                                                value={mappings[key] ?? 0}
                                                onChange={(e) => handleMappingChange(key, e.target.value)}
                                                className="w-full p-2 border border-slate-250 bg-white rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                                            >
                                                {headers.map((h, i) => (
                                                    <option key={i} value={i}>Kolom {i+1}: {h || `(Kolom Kosong)`}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* EXCEL PREVIEW TABLE */}
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Preview 5 Baris Pertama</h4>
                                <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
                                    <table className="w-full text-left text-[11px] whitespace-nowrap">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="p-2.5 text-slate-500 font-bold w-10 text-center">No</th>
                                                {Object.keys(MAPPING_SPECS[dataType]).map(key => (
                                                    <th key={key} className="p-2.5 text-slate-600 font-bold">{MAPPING_SPECS[dataType][key]}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-medium">
                                            {rawRows.slice(0, 5).map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-2.5 text-slate-400 text-center font-bold">{idx + 1}</td>
                                                    {Object.keys(MAPPING_SPECS[dataType]).map(key => {
                                                        const colIdx = mappings[key];
                                                        const cellVal = row[colIdx] !== undefined ? row[colIdx] : '-';
                                                        return (
                                                            <td key={key} className="p-2.5 text-slate-700 truncate max-w-[120px]" title={cellVal}>{cellVal}</td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold bg-slate-50">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer disabled:opacity-50"
                    >
                        Batal
                    </button>
                    {step === 3 && (
                        <button
                            onClick={handleSave}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isProcessing ? 'Mengimpor...' : 'Simpan & Auto-Archive'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
