import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { 
  Package, Laptop, Folder, Trash2, Database, AlertCircle, CheckCircle, Droplet, Plus, Download, UploadCloud, Truck, Warehouse
} from 'lucide-react';
import Swal from 'sweetalert2';
import KpiCard from '../../Components/KpiCard';
import Pagination from '../../Components/Pagination';
import PerbaikanRumahDinasSection from '../../Components/PerbaikanRumahDinasSection';
import AlatBeratKrpSection from '../../Components/AlatBeratKrpSection';
import StokMaterialSection from '../../Components/StokMaterialSection';

export default function Logistik(props) {
    const { 
        stokList = [], 
        materialBalanceList = [], 
        alatBeratList = [], 
        perbaikanList = [], 
        momList = [], 
        bbmList = [], 
        auth, 
        onOpenFeedback, 
        activeSubMenu 
    } = props;
    const currentUser = auth?.user || {};

    const [activeSubTab, setActiveSubTab] = useState('perbaikan');
    const [perbaikanPage, setPerbaikanPage] = useState(1);
    const [alatBeratPage, setAlatBeratPage] = useState(1);
    const [bbmPage, setBbmPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const fileInputRef = useRef(null);

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const url = type === 'bbm' ? '/import-bbm' : '/import-perbaikan';
        const label = type === 'bbm' ? 'BBM' : 'Perbaikan';

        router.post(url, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                alert(`File Excel berhasil diunggah dan data ${label} telah diperbarui!`);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: (errors) => {
                alert('Gagal mengunggah file. Pastikan format file benar sesuai template.');
                console.error(errors);
            }
        });
    };

    React.useEffect(() => {
        if (activeSubMenu) {
            setActiveSubTab(activeSubMenu);
        }
    }, [activeSubMenu]);

    const totalStockItems = materialBalanceList.length > 0 
        ? materialBalanceList.reduce((acc, curr) => acc + (Number(curr.stock_akhir) || 0), 0)
        : stokList.length;
    const totalJenisMaterial = materialBalanceList.length > 0
        ? materialBalanceList.length
        : new Set(stokList.map(item => item?.nama || '')).size;
    const totalAlatBerat = alatBeratList.length;
    const totalPerbaikan = perbaikanList.length;
    const totalRealisasi = perbaikanList.reduce((acc, c) => acc + (Number(c?.realisasi) || 0), 0);

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
        } else if (activeSubTab === 'stok_material' || activeSubTab === 'stok' || activeSubTab === 'bbm') {
            url = `/logistik/material-balance/${id}`;
            confirmText = 'Hapus item material ini?';
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

    const roleLower = (currentUser?.role || '').toLowerCase();
    const isHeadOrManager = roleLower.includes('kepala') || roleLower.includes('manager') || roleLower.includes('executive');
    // HANYA Admin Facility Management yang berhak mengunggah dan mengelola data di pilar Facility Management
    const canUploadFM = roleLower.startsWith('admin') && (roleLower.includes('facility') || roleLower.includes('logistik')) && !isHeadOrManager;
    const isAdmin = canUploadFM;

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans text-slate-800">
            {/* KPI CARDS: Urutan diselaraskan dengan tab di bawahnya (Total Perbaikan di urutan pertama) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard 
                    title="Total Perbaikan" 
                    value={`${totalPerbaikan} Item`} 
                    subtitle="Rumah Dinas & Kantor" 
                    icon={Folder} 
                    colorClass="text-indigo-600" 
                    bgClass="bg-indigo-50" 
                />
                <KpiCard 
                    title="Aset Alat Berat & KRP" 
                    value={`${totalAlatBerat} Unit`} 
                    subtitle="Crane, TMC, & Mobil KRP" 
                    icon={Truck} 
                    colorClass="text-amber-600" 
                    bgClass="bg-amber-50" 
                />
                <KpiCard 
                    title="Total Stok Gudang" 
                    value={`${totalStockItems.toLocaleString()} Unit`} 
                    subtitle="Material Fisik SOH & 2YSP" 
                    icon={Package} 
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50" 
                />
                <KpiCard 
                    title="Total Jenis Material" 
                    value={`${totalJenisMaterial} KIMAP`} 
                    subtitle="Item SOH & 2 Years Spare Part" 
                    icon={Database} 
                    colorClass="text-emerald-600" 
                    bgClass="bg-emerald-50" 
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
                    <span className="flex items-center justify-center gap-1.5"><Folder className="w-4 h-4"/> Perbaikan Rumah Dinas & Kantor ({totalPerbaikan})</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('alat_berat')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                        activeSubTab === 'alat_berat' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <span className="flex items-center justify-center gap-1.5"><Truck className="w-4 h-4"/> Alat Berat dan KRP ({totalAlatBerat})</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('stok_material')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                        activeSubTab === 'stok_material' || activeSubTab === 'stok' || activeSubTab === 'bbm' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <span className="flex items-center justify-center gap-1.5"><Warehouse className="w-4 h-4"/> Stok Material Gudang ({materialBalanceList.length})</span>
                </button>
            </div>

            {/* SUB-TAB 1: PERBAIKAN (5 Kategori Kerusakan, 3 Grafik Analitik, SLA & CRUD) */}
            {activeSubTab === 'perbaikan' && (
                <PerbaikanRumahDinasSection
                    perbaikanList={perbaikanList}
                    isAdmin={canUploadFM}
                    formatDate={formatDate}
                />
            )}

            {/* SUB-TAB 2: ALAT BERAT & KRP */}
            {activeSubTab === 'alat_berat' && (
                <AlatBeratKrpSection
                    alatBeratList={alatBeratList}
                    isAdmin={true}
                    formatDate={formatDate}
                />
            )}

            {/* SUB-TAB 3: STOK MATERIAL GUDANG (MATERIAL BALANCE SOH & 2YSP) */}
            {(activeSubTab === 'stok_material' || activeSubTab === 'stok' || activeSubTab === 'bbm') && (
                <StokMaterialSection
                    materialBalanceList={materialBalanceList}
                    isAdmin={canUploadFM}
                />
            )}


        </div>
    );
}
