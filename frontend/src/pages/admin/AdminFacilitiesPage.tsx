import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { FacilityItem } from '../../types';
import { Plus, Edit, Trash2, Building2, Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';

export const AdminFacilitiesPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FacilityItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FacilityItem | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Lab & Bengkel');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const queryClient = useQueryClient();

  const { data: facilities, isLoading } = useQuery<FacilityItem[]>({
    queryKey: ['adminFacilitiesList'],
    queryFn: () => api.get('/admin/facilities'),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (editingItem) {
        return api.patch(`/admin/facilities/${editingItem.id}`, payload);
      }
      return api.post('/admin/facilities', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFacilitiesList'] });
      toast.success(editingItem ? 'Fasilitas diperbarui.' : 'Fasilitas baru ditambahkan.');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan fasilitas.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/facilities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFacilitiesList'] });
      toast.success('Fasilitas dihapus.');
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus fasilitas.');
    },
  });

  const openCreate = () => {
    setEditingItem(null);
    setName('');
    setCategory('Lab & Bengkel');
    setDescription('');
    setLocation('');
    setImageUrl('');
    setModalOpen(true);
  };

  const openEdit = (item: FacilityItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description);
    setLocation(item.location || '');
    setImageUrl(item.imageUrl || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error('Nama dan deskripsi fasilitas wajib diisi.');
      return;
    }
    saveMutation.mutate({
      name,
      category,
      description,
      location: location.trim() || null,
      imageUrl: imageUrl.trim() || null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Fasilitas & Sarana Sekolah</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola data bengkel, laboratorium, dan sarana penunjang.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Fasilitas</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-forest-800">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            <p className="text-xs font-medium text-gray-500 mt-3">Memuat fasilitas...</p>
          </div>
        ) : !facilities?.length ? (
          <div className="text-center py-16 text-gray-500 text-xs">Belum ada fasilitas tercatat.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Nama Fasilitas</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Lokasi Gedung</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {facilities.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-emerald-700 font-semibold">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.location || '-'}</td>
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

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingItem ? 'Edit Fasilitas' : 'Tambah Fasilitas'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Fasilitas *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori Fasilitas</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
              >
                <option value="Lab & Bengkel">Lab & Bengkel</option>
                <option value="Ruang Belajar">Ruang Belajar</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Penunjang">Penunjang</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Lokasi Gedung</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Gedung Vokasi Sayap Barat"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">URL Foto Fasilitas</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... atau dari Media"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Fasilitas *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
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

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus Fasilitas">
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Hapus fasilitas <strong className="text-gray-900">"{deleteTarget?.name}"</strong>?
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
