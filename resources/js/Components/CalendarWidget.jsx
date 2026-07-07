import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { 
  ChevronLeft, ChevronRight, Calendar, Plus, Edit, Trash2, Check, X, Clock, AlertCircle
} from 'lucide-react';

export default function CalendarWidget({ events, currentUser }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const { data, setData, post, put, reset, errors } = useForm({
    title: '',
    description: '',
    category: 'BS',
    date: selectedDateStr,
  });

  const categoryColors = {
    BS: 'bg-blue-500 text-white border-blue-600',
    HC: 'bg-emerald-500 text-white border-emerald-600',
    LOG: 'bg-purple-500 text-white border-purple-600',
    SCM: 'bg-orange-500 text-white border-orange-600',
    IT: 'bg-cyan-500 text-white border-cyan-600'
  };

  const categoryLabels = {
    BS: 'Budgeting (BS)',
    HC: 'Human Capital (HC)',
    LOG: 'Logistik (LOG)',
    SCM: 'SCM & Kontrak',
    IT: 'IT Asset'
  };

  // Check if current user has permission to manage events for a specific category
  const canManage = (category) => {
    if (currentUser.role.startsWith('Admin') && !currentUser.role.startsWith('Admin Bisnis') && !currentUser.role.startsWith('Admin HC') && !currentUser.role.startsWith('Admin SCM') && !currentUser.role.startsWith('Admin Logistik')) return true; // Global Admin
    if (currentUser.role === 'Manager BS' || currentUser.role.startsWith('Kepala') || currentUser.role === 'Management Executive') return true;
    
    if (currentUser.role === 'Admin Bisnis Planning and Budgeting' && category === 'BS') return true;
    if (currentUser.role === 'Admin HC' && category === 'HC') return true;
    if (currentUser.role === 'Admin SCM' && category === 'SCM') return true;
    if (currentUser.role === 'Admin Logistik' && category === 'LOG') return true;
    
    return false;
  };

  const canManageAny = () => {
    return ['BS', 'HC', 'LOG', 'SCM', 'IT'].some(cat => canManage(cat));
  };

  const getDefaultCategory = () => {
    if (currentUser.role === 'Manager BS' || currentUser.role.startsWith('Kepala')) return 'BS';
    if (currentUser.role === 'Admin Bisnis Planning and Budgeting') return 'BS';
    if (currentUser.role === 'Admin HC') return 'HC';
    if (currentUser.role === 'Admin SCM') return 'SCM';
    if (currentUser.role === 'Admin Logistik') return 'LOG';
    return 'BS';
  };

  // Month stats
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.

  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Days grid
  const daysGrid = [];

  // Previous month padding days
  const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Align to Monday first
  for (let i = startDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysGrid.push({ day: d, dateStr, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    daysGrid.push({ day: i, dateStr, isCurrentMonth: true });
  }

  // Next month padding days
  const remainingCells = 42 - daysGrid.length;
  for (let i = 1; i <= remainingCells; i++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    daysGrid.push({ day: i, dateStr, isCurrentMonth: false });
  }

  // Filter events for selected date
  const selectedDayEvents = events.filter(e => e.date === selectedDateStr);

  const openAddModal = () => {
    reset();
    setEditingEvent(null);
    setData({
      title: '',
      description: '',
      category: getDefaultCategory(),
      date: selectedDateStr,
    });
    setShowEventModal(true);
  };

  const openEditModal = (evt) => {
    reset();
    setEditingEvent(evt);
    setData({
      title: evt.title,
      description: evt.description || '',
      category: evt.category,
      date: evt.date,
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!data.title.trim()) return;

    if (!canManage(data.category)) {
      alert(`Anda tidak memiliki wewenang untuk menambahkan/mengubah kegiatan pada kategori ${categoryLabels[data.category] || data.category}.`);
      return;
    }

    if (editingEvent) {
      put(`/calendar/${editingEvent.id}`, {
        onSuccess: () => {
          setShowEventModal(false);
          reset();
        }
      });
    } else {
      post('/calendar', {
        onSuccess: () => {
          setShowEventModal(false);
          reset();
        }
      });
    }
  };

  const handleDeleteEvent = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus agenda kegiatan ini?')) {
      router.delete(`/calendar/${id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans text-slate-800">
      {/* LEFT COLUMN: Calendar Grid */}
      <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-800">
              {monthNames[month]} {year}
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-250 p-1 rounded-xl">
            <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={handleNextMonth} className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">
          <div>Sen</div>
          <div>Sel</div>
          <div>Rab</div>
          <div>Kam</div>
          <div>Jum</div>
          <div className="text-red-400">Sab</div>
          <div className="text-red-400">Min</div>
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {daysGrid.map((cell, index) => {
            const hasEvents = events.filter(e => e.date === cell.dateStr);
            const isSelected = selectedDateStr === cell.dateStr;
            const isToday = new Date().toISOString().split('T')[0] === cell.dateStr;

            return (
              <button
                key={index}
                onClick={() => setSelectedDateStr(cell.dateStr)}
                className={`h-20 p-2 border rounded-xl flex flex-col justify-between text-left transition-all cursor-pointer relative group active:scale-95 ${
                  cell.isCurrentMonth ? 'bg-white border-slate-200' : 'bg-slate-50/50 border-slate-100 text-slate-400'
                } ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 border-transparent shadow-md bg-blue-50/20' 
                    : 'hover:border-slate-350 hover:bg-slate-50/30'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-xs font-black ${
                    isToday 
                      ? 'bg-blue-600 text-white w-5 h-5 rounded-md flex items-center justify-center shadow-md shadow-blue-600/20' 
                      : (index % 7 === 5 || index % 7 === 6) ? 'text-red-500' : ''
                  }`}>
                    {cell.day}
                  </span>
                </div>
                {/* Event dots container */}
                <div className="flex flex-wrap gap-1 mt-1 max-w-full overflow-hidden h-6 items-end">
                  {hasEvents.slice(0, 3).map(e => (
                    <span 
                      key={e.id} 
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        e.category === 'BS' ? 'bg-blue-500' :
                        e.category === 'HC' ? 'bg-emerald-500' :
                        e.category === 'LOG' ? 'bg-purple-500' :
                        e.category === 'SCM' ? 'bg-orange-500' : 'bg-cyan-500'
                      }`}
                      title={e.title}
                    />
                  ))}
                  {hasEvents.length > 3 && (
                    <span className="text-[8px] font-black text-slate-500 leading-none">+{hasEvents.length - 3}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Selected Day Events */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start pb-4 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Detail Agenda Kegiatan</h4>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">Tanggal: {selectedDateStr}</p>
            </div>
            {canManageAny() && (
              <button
                type="button"
                onClick={openAddModal}
                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl cursor-pointer transition-all active:scale-95 border border-blue-100"
                title="Tambah Agenda Baru"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-3.5 mt-4 max-h-[360px] overflow-y-auto pr-1">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map(evt => (
                <div 
                  key={evt.id} 
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between relative group/event hover:shadow-xs hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        evt.category === 'BS' ? 'bg-blue-500' :
                        evt.category === 'HC' ? 'bg-emerald-500' :
                        evt.category === 'LOG' ? 'bg-purple-500' :
                        evt.category === 'SCM' ? 'bg-orange-500' : 'bg-cyan-500'
                      }`} />
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide">
                        {categoryLabels[evt.category] || evt.category}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-800 text-xs mt-1 leading-normal">{evt.title}</h5>
                    {evt.description && (
                      <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">
                        {evt.description}
                      </p>
                    )}
                  </div>

                  {canManage(evt.category) && (
                    <div className="flex gap-1.5 justify-end mt-3 border-t border-slate-100 pt-2 opacity-0 group-hover/event:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(evt)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded-lg cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
                <Clock className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-[11px] font-bold">Tidak Ada Kegiatan</p>
                <span className="text-[9px] text-slate-400 font-medium mt-0.5">Belum ada jadwal terencana hari ini.</span>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-slate-100 mt-6 space-y-2 text-[9px] font-extrabold text-slate-500 tracking-wide uppercase">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" /> Budget (BS)</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /> Human Capital (HC)</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" /> Logistik (LOG)</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" /> SCM & Kontrak</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" /> IT Asset</div>
        </div>

        {/* EVENT INPUT MODAL */}
        {showEventModal && (
          <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-in-out]">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm">
                  {editingEvent ? 'Edit Rencana Agenda' : 'Tambah Agenda Baru'}
                </h3>
                <button onClick={() => setShowEventModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="date"
                    value={data.date}
                    onChange={(e) => setData('date', e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Kategori Fungsi
                  </label>
                  <select
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-700"
                  >
                    {canManage('BS') && <option value="BS">Budget (BS)</option>}
                    {canManage('HC') && <option value="HC">Human Capital (HC)</option>}
                    {canManage('LOG') && <option value="LOG">Logistik (LOG)</option>}
                    {canManage('SCM') && <option value="SCM">SCM & Kontrak</option>}
                    {canManage('IT') && <option value="IT">IT Asset</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Judul Agenda Kegiatan
                  </label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                    placeholder="Contoh: Kick-off Meeting TA 2026"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Keterangan Tambahan
                  </label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold resize-none"
                    placeholder="Tulis detail deskripsi, lokasi, atau penanggung jawab..."
                  />
                </div>

                <div className="flex justify-end gap-2 text-xs font-bold pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4" /> Simpan Agenda
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
