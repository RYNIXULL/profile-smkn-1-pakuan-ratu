import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { EventItem } from '../../types';
import { Plus, Edit, Trash2, Calendar, MapPin, Loader2 } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';

export const AdminEventsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [status, setStatus] = useState<'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');

  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery<EventItem[]>({
    queryKey: ['adminEventsList'],
    queryFn: () => api.get('/admin/events'),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (editingItem) {
        return api.patch(`/admin/events/${editingItem.id}`, payload);
      }
      return api.post('/admin/events', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEventsList'] });
      toast.success(editingItem ? 'Agenda berhasil diperbarui.' : 'Agenda berhasil ditambahkan.');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan agenda.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEventsList'] });
      toast.success('Agenda berhasil dihapus.');
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus agenda.');
    },
  });

  const openCreate = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setStartDate(new Date().toISOString().slice(0, 16));
    setStatus('UPCOMING');
    setModalOpen(true);
  };

  const openEdit = (item: EventItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setLocation(item.location);
    setStartDate(new Date(item.startDate).toISOString().slice(0, 16));
    setStatus(item.status);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim() || !startDate) {
      toast.error('Mohon lengkapi data agenda.');
      return;
    }

    saveMutation.mutate({
      title,
      description,
      location,
      startDate: new Date(startDate).toISOString(),
      status,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Agenda & Kegiatan</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola jadwal kegiatan sekolah dan kalender pendidikan.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-forest-800">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            <p className="text-xs font-medium text-gray-500 mt-3">Memuat agenda...</p>
          </div>
        ) : !events?.length ? (
          <div className="text-center py-16 text-gray-500 text-xs">Belum ada agenda kegiatan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Judul Agenda</th>
                  <th className="px-6 py-4">Waktu Mulai</th>
                  <th className="px-6 py-4">Lokasi</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{ev.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDateTime(ev.startDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{ev.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {ev.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => openEdit(ev)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(ev)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingItem ? 'Edit Agenda' : 'Tambah Agenda Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Agenda *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Lokasi Kegiatan *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Waktu Mulai *</label>
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
              >
                <option value="UPCOMING">Mendatang</option>
                <option value="ONGOING">Sedang Berlangsung</option>
                <option value="COMPLETED">Selesai</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Agenda *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-semibold text-gray-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-semibold"
            >
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus Agenda">
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Hapus agenda <strong className="text-gray-900">"{deleteTarget?.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-semibold">
              Batal
            </button>
            <button
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
