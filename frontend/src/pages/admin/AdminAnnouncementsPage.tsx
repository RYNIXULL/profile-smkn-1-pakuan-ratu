import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { AnnouncementItem } from '../../types';
import { Plus, Edit, Trash2, Bell, AlertCircle, Loader2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';

export const AdminAnnouncementsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AnnouncementItem | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const queryClient = useQueryClient();

  const { data: announcements, isLoading } = useQuery<AnnouncementItem[]>({
    queryKey: ['adminAnnouncementsList'],
    queryFn: () => api.get('/admin/announcements'),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (editingItem) {
        return api.patch(`/admin/announcements/${editingItem.id}`, payload);
      }
      return api.post('/admin/announcements', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncementsList'] });
      toast.success(editingItem ? 'Pengumuman diperbarui.' : 'Pengumuman berhasil diterbitkan.');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan pengumuman.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/announcements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncementsList'] });
      toast.success('Pengumuman dihapus.');
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus pengumuman.');
    },
  });

  const openCreate = () => {
    setEditingItem(null);
    setTitle('');
    setContent('');
    setIsUrgent(false);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEdit = (item: AnnouncementItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setContent(item.content);
    setIsUrgent(item.isUrgent);
    setIsActive(item.isActive);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Judul dan isi pengumuman wajib diisi.');
      return;
    }
    saveMutation.mutate({ title, content, isUrgent, isActive });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pengumuman Sekolah</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola informasi kedinasan dan edaran resmi sekolah.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Pengumuman</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-forest-800">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            <p className="text-xs font-medium text-gray-500 mt-3">Memuat pengumuman...</p>
          </div>
        ) : !announcements?.length ? (
          <div className="text-center py-16 text-gray-500 text-xs">Belum ada pengumuman.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Judul Pengumuman</th>
                  <th className="px-6 py-4">Prioritas</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tanggal Terbit</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.isUrgent ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">Penting</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Biasa</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.isActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Aktif</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">Nonaktif</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(item.publishedAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
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

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingItem ? 'Edit Pengumuman' : 'Terbitkan Pengumuman'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Pengumuman *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Isi Pengumuman *</label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="rounded border-gray-300 text-rose-600"
              />
              <span>Tandai Sebagai Penting / Darurat</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 text-forest-700"
              />
              <span>Status Aktif</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-semibold">
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

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus Pengumuman">
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Hapus pengumuman <strong className="text-gray-900">"{deleteTarget?.title}"</strong>?
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
