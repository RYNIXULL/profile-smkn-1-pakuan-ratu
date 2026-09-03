import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { GalleryItem } from '../../types';
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';

export const AdminGalleriesPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kegiatan');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const queryClient = useQueryClient();

  const { data: galleries, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['adminGalleriesList'],
    queryFn: () => api.get('/admin/galleries'),
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/admin/galleries', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGalleriesList'] });
      toast.success('Album galeri baru berhasil dibuat.');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal membuat album.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/galleries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGalleriesList'] });
      toast.success('Album galeri berhasil dihapus.');
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus album.');
    },
  });

  const closeModal = () => {
    setModalOpen(false);
    setTitle('');
    setDescription('');
    setCoverUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Judul album wajib diisi.');
      return;
    }
    createMutation.mutate({
      title,
      category,
      description: description.trim() || null,
      coverUrl: coverUrl.trim() || null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Galeri & Album Foto</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola album foto kegiatan dan dokumentasi sekolah.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Album Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-forest-800">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            <p className="text-xs font-medium text-gray-500 mt-3">Memuat album...</p>
          </div>
        ) : !galleries?.length ? (
          <div className="text-center py-16 text-gray-500 text-xs">Belum ada album galeri.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Judul Album</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Total Foto</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {galleries.map((album) => (
                  <tr key={album.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{album.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-emerald-700 font-semibold">{album.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{album._count?.items || 0} foto</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => setDeleteTarget(album)}
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

      <Modal isOpen={modalOpen} onClose={closeModal} title="Buat Album Galeri Baru">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Album *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Gelar Karya Siswa Vokasi"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori Album</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
            >
              <option value="Kegiatan">Kegiatan Sekolah</option>
              <option value="Prestasi">Prestasi</option>
              <option value="Fasilitas">Fasilitas</option>
              <option value="Praktik">Praktik Kejuruan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">URL Cover Album</label>
            <input
              type="text"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://... atau dari Media"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Album</label>
            <textarea
              rows={3}
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
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-semibold"
            >
              {createMutation.isPending ? 'Membuat...' : 'Buat Album'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus Album">
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Hapus album <strong className="text-gray-900">"{deleteTarget?.title}"</strong>? Seluruh foto di dalamnya akan dikeluarkan dari album.
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
