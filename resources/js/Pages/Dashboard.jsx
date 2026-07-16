import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  LayoutDashboard, Calculator, Users, Package, FileSignature, 
  FolderOpen, Bell, LogOut, Calendar, Database, Laptop, Shield, UploadCloud, UsersRound
} from 'lucide-react';

import MainDashboard from './Pilar/MainDashboard';
import Budgeting from './Pilar/Budgeting';
import HumanCapital from './Pilar/HumanCapital';
import Logistik from './Pilar/Logistik';
import Scm from './Pilar/Scm';
import Arsip from './Pilar/Arsip';
import ItAsset from './Pilar/ItAsset';
import CalendarTab from './Pilar/Calendar';
import FeedbackModal from '../Components/FeedbackModal';
import UploadWizardModal from '../Components/UploadWizardModal';

export default function Dashboard(props) {
    const { auth, flash, env } = props;
    const currentUser = auth.user;

    const getDefaultTab = (role) => {
        const roleLower = (role || '').toLowerCase();
        if (roleLower.includes('budget') || roleLower.includes('planning')) return 'view-budget';
        if (roleLower.includes('hc') || roleLower.includes('human')) return 'view-hc';
        if (roleLower.includes('scm')) return 'view-scm';
        if (roleLower.includes('logistik') || roleLower.includes('logistic') || roleLower.includes('facility')) return 'view-logistik';
        if (roleLower.includes('it asset') || roleLower.includes('it-asset') || roleLower.includes('ict')) return 'view-it-asset';
        return 'view-main';
    };

    const [activeTab, setActiveTab] = useState(() => getDefaultTab(currentUser.role));
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Manager / Kepala memberikan feedback baru di MOM SCM.", read: false },
        { id: 2, text: "Kontrak Driver PGE Lahendong tersisa 6 bulan lagi.", read: false }
    ]);
    const [showNotifMenu, setShowNotifMenu] = useState(false);

    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [feedbackMomId, setFeedbackMomId] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackStatus, setFeedbackStatus] = useState('Approved');
    const [uploadWizardOpen, setUploadWizardOpen] = useState(false);

    const openFeedback = (momId, initialFeedback, initialStatus) => {
        setFeedbackMomId(momId);
        setFeedbackText(initialFeedback || '');
        setFeedbackStatus(initialStatus || 'Approved');
        setFeedbackModalOpen(true);
    };

    const menuItems = [
        { id: 'view-main', title: 'Main Dashboard', label: 'Executive Recast', icon: LayoutDashboard },
        { id: 'view-budget', title: 'Budgeting', label: 'ABI & ABO Monitor', icon: Calculator },
        { id: 'view-hc', title: 'Human Capital', label: 'SDM & Organik PGE', icon: Users },
        { id: 'view-logistik', title: 'Facility Management', label: 'Logistik & SCM', icon: Package },
        { id: 'view-it-asset', title: 'IT Asset Area', label: 'Server & Workstation', icon: Laptop },
        { id: 'view-scm', title: 'Kontrak', label: 'Monitoring Vendor', icon: FileSignature },
        { id: 'view-arsip', title: 'Arsip Dokumen', label: 'Digital Library', icon: FolderOpen },
        { id: 'view-calendar', title: 'Kalender Kegiatan', label: 'Kalender Kegiatan', icon: Calendar }
    ];

    const isTabAllowed = (tabId, role) => {
        const roleLower = (role || '').toLowerCase();
        
        // Managers, Executives, and Kepala see everything (like Manager BS)
        if (roleLower.includes('manager') || roleLower.includes('kepala') || roleLower.includes('executive') || roleLower.includes('viewer')) {
            return true;
        }

        // Strict RBAC: Pilar admins can ONLY see their pilar tab, SCM (Kontrak), Arsip and Calendar
        if (roleLower.includes('budget') || roleLower.includes('planning')) {
            return tabId === 'view-budget' || tabId === 'view-scm' || tabId === 'view-arsip' || tabId === 'view-calendar';
        }
        if (roleLower.includes('hc') || roleLower.includes('human')) {
            return tabId === 'view-hc' || tabId === 'view-scm' || tabId === 'view-arsip' || tabId === 'view-calendar';
        }
        if (roleLower.includes('scm')) {
            return tabId === 'view-scm' || tabId === 'view-arsip' || tabId === 'view-calendar';
        }
        if (roleLower.includes('logistik') || roleLower.includes('logistic') || roleLower.includes('facility')) {
            return tabId === 'view-logistik' || tabId === 'view-scm' || tabId === 'view-arsip' || tabId === 'view-calendar';
        }
        if (roleLower.includes('it asset') || roleLower.includes('it-asset') || roleLower.includes('ict')) {
            return tabId === 'view-it-asset' || tabId === 'view-scm' || tabId === 'view-arsip' || tabId === 'view-calendar';
        }

        // Global Admins see everything
        if (roleLower.includes('admin') && !roleLower.includes('kepala')) return true;
        if (tabId === 'view-calendar') return true;
        return false;
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen flex bg-bg-light font-sans text-slate-800">
            <Head title={menuItems.find(m => m.id === activeTab)?.title || "Dashboard"} />

            {/* SIDEBAR */}
            <aside className="w-[260px] bg-white text-slate-600 flex flex-col border-r border-slate-200 shadow-sm shrink-0 z-30">
                {/* Brand Logo Header */}
                <div className="h-24 px-4 border-b border-slate-100 flex items-center justify-center py-2">
                    <img 
                        src="/logo-pertamina.jpg" 
                        alt="Pertamina Geothermal Energy" 
                        className="w-full max-w-[200px] h-auto object-contain mix-blend-multiply" 
                    />
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        const isAllowed = isTabAllowed(item.id, currentUser.role);
                        if (!isAllowed) return null;
                        
                        const isMain = item.id === 'view-main';

                        const isMain = item.id === 'view-main';

                        return (
                            <React.Fragment key={item.id}>
<<<<<<< HEAD
                                {!isMain && item.id === 'view-budget' && (
                                    <div className="px-5 mt-4 mb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                                        Pillar / Function
                                    </div>
                                )}
=======
>>>>>>> origin/charni
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-3.5 py-2.5 px-4 my-1 rounded-r-full mr-4 transition-all cursor-pointer border border-transparent ${
                                        !isMain ? 'w-[calc(100%-1rem)] ml-4' : 'w-full'
                                    } ${
                                        activeTab === item.id 
                                            ? 'bg-pertamina-green text-white shadow-md shadow-pertamina-green/30' 
                                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    <div className="text-left">
                                        <div className="leading-none text-[13px]">{item.title}</div>
                                    </div>
                                </button>
                            </React.Fragment>
                        );
                    })}
                </nav>

                {/* Active User Card Footer */}
                <div className="p-4 border-t border-slate-200 bg-white">
                    <div className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:bg-slate-50 transition-all">
                        <div className="w-9 h-9 bg-slate-100 text-pertamina-blue font-extrabold rounded-full flex items-center justify-center text-xs shrink-0">
                            {currentUser.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-[11px] font-bold text-slate-700 truncate leading-tight">{currentUser.fullName}</h4>
                            <span className="text-[9px] text-slate-500 font-semibold block truncate mt-0.5">{currentUser.role}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer shrink-0"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative">
                {/* TOP BAR */}
                <header className="h-16 bg-white/95 backdrop-blur-sm border border-slate-200 mx-6 mt-4 rounded-xl px-6 flex items-center justify-between shadow-xs z-20 sticky top-4">
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-green-50 border border-green-200 text-pertamina-green text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                            PGE Lahendong
                        </span>
                        <h2 className="text-[15px] font-extrabold text-slate-700 tracking-tight">
                            {menuItems.find(m => m.id === activeTab)?.title}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {currentUser?.role?.startsWith('Admin') && (
                            <button
                                onClick={() => setUploadWizardOpen(true)}
                                className="flex items-center gap-1.5 bg-pertamina-blue hover:bg-blue-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-md shadow-pertamina-blue/10 cursor-pointer transition-all active:scale-95 shrink-0"
                            >
                                <UploadCloud className="w-4 h-4 animate-[pulse_2s_infinite]" /> Upload Laporan
                            </button>
                        )}
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifMenu(!showNotifMenu)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer relative"
                            >
                                <Bell className="w-4.5 h-4.5" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                                )}
                            </button>

                            {showNotifMenu && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-150 p-4 z-50 animate-[fadeIn_0.2s_ease-in-out]">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-xs font-bold text-slate-800">Notifikasi Terbaru</h4>
                                        {notifications.length > 0 && (
                                            <button 
                                                onClick={() => setNotifications([])} 
                                                className="text-[10px] text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                                            >
                                                Bersihkan
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {notifications.length > 0 ? (
                                            notifications.map(n => (
                                                <div key={n.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-medium text-slate-600 leading-normal">
                                                    {n.text}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[11px] text-slate-400 text-center py-4">Tidak ada notifikasi baru.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

<<<<<<< HEAD
=======
                        {/* System Badge Removed */}
>>>>>>> origin/charni
                    </div>
                </header>

                {/* PAGE WRAPPER */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Flash messages / Toast banner */}
                    {flash.success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-2xl flex items-center justify-between shadow-xs animate-[fadeIn_0.2s_ease-in-out]">
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-2xl flex items-center justify-between shadow-xs animate-[fadeIn_0.2s_ease-in-out]">
                            <span>{flash.error}</span>
                        </div>
                    )}

                    {/* Rendering Tab Views */}
                    {activeTab === 'view-main' && <MainDashboard {...props} onOpenFeedback={openFeedback} />}
                    {activeTab === 'view-budget' && <Budgeting {...props} onOpenFeedback={openFeedback} />}
                    {activeTab === 'view-hc' && <HumanCapital {...props} onOpenFeedback={openFeedback} />}
                    {activeTab === 'view-logistik' && <Logistik {...props} onOpenFeedback={openFeedback} />}
                    {activeTab === 'view-scm' && <Scm {...props} onOpenFeedback={openFeedback} />}
                    {activeTab === 'view-arsip' && <Arsip {...props} onOpenFeedback={openFeedback} />}
                    {activeTab === 'view-it-asset' && <ItAsset {...props} onOpenFeedback={openFeedback} />}
                    {activeTab === 'view-calendar' && <CalendarTab {...props} />}
                </main>

                <FeedbackModal 
                    isOpen={feedbackModalOpen} 
                    onClose={() => setFeedbackModalOpen(false)} 
                    momId={feedbackMomId} 
                    initialFeedback={feedbackText} 
                    initialStatus={feedbackStatus}
                />

                <UploadWizardModal 
                    isOpen={uploadWizardOpen} 
                    onClose={() => setUploadWizardOpen(false)} 
                />
            </div>
        </div>
    );
}
