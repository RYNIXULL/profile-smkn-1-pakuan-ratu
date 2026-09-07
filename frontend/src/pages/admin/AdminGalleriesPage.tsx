import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { GalleryItem } from '../../types';
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2, Layers, FolderPlus } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';
import { ImageUploadInput } from '../../components/ui/ImageUploadInput';

export const AdminGalleriesPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'photos'>('info');

  // Album info states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kegiatan');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  // Add photo states
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  const queryClient = useQueryClient();

  const { data: galleries, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['adminGalleriesList'],
    queryFn: () => api.get('/admin/galleries'),
  });

  const currentAlbum = editingItem
    ? galleries?.find((g) => g.id === editingItem.id) || editingItem
    : null;

  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (editingItem) {
        return api.patch(`/admin/galleries/${editingItem.id}`, payload);
      }
      return api.post('/admin/galleries', payload);
    },
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['adminGalleriesList'] });
      queryClient.invalidateQueries({ queryKey: ['publicGalleries'] });
      if (editingItem) {
        toast.success('Album galeri berhasil diperbarui.');
        setEditingItem(res);
      } else {
        toast.success('Album galeri baru berhasil dibuat.');
        closeModal();
      }
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan album.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/galleries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGalleriesList'] });
      queryClient.invalidateQueries({ queryKey: ['publicGalleries'] });
      toast.success('Album galeri berhasil dihapus.');
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus album.');
    },
  });

  const addPhotoMutation = useMutation({
    mutationFn: ({ galleryId, url, caption }: { galleryId: string; url: string; caption?: string }) =>
      api.post(`/admin/galleries/${galleryId}/items`, { url, caption }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGalleriesList'] });
      queryClient.invalidateQueries({ queryKey: ['publicGalleries'] });
      toast.success('Foto berhasil ditambahkan ke album.');
      setNewPhotoUrl('');
      setNewPhotoCaption('');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menambahkan foto ke album.');
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: ({ galleryId, itemId }: { galleryId: string; itemId: string }) =>
      api.delete(`/admin/galleries/${galleryId}/items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGalleriesList'] });
      queryClient.invalidateQueries({ queryKey: ['publicGalleries'] });
      toast.success('Foto berhasil dihapus dari album.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus foto dari album.');
    },
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Kegiatan');
    setDescription('');
    setCoverUrl('');
    setActiveTab('info');
    setModalOpen(true);
  };

  const openEditModal = (album: GalleryItem, tab: 'info' | 'photos' = 'info') => {
    setEditingItem(album);
    setTitle(album.title);
    setCategory(album.category);
    setDescription(album.description || '');
    setCoverUrl(album.coverUrl || '');
    setActiveTab(tab);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setCoverUrl('');
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setActiveTab('info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Judul album wajib diisi.');
      return;
    }
    saveMutation.mutate({
      title,
      category,
      description: description.trim() || null,
      coverUrl: coverUrl.trim() || null,
    });
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAlbum) return;
    if (!newPhotoUrl.trim()) {
      toast.error('Silakan pilih foto terlebih dahulu.');
      return;
    }
    addPhotoMutation.mutate({
      galleryId: currentAlbum.id,
      url: newPhotoUrl,
      caption: newPhotoCaption.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Galeri & Album Foto</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola album foto kegiatan, dokumentasi, dan koleksi foto sekolah.</p>
        </div>
        <button
          onClick={openCreateModal}
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
                  <th className="px-6 py-4">Sampul</th>
                  <th className="px-6 py-4">Judul Album</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Total Foto</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {galleries.map((album) => (
                  <tr key={album.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      {album.coverUrl ? (
                        <img
                          src={album.coverUrl}
                          alt={album.title}
                          className="w-14 h-10 rounded-lg object-cover border border-gray-100 shadow-2xs"
                        />
                      ) : (
                        <div className="w-14 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-bold text-gray-900">{album.title}</div>
                      <div className="text-[11px] text-gray-400 font-mono">/galeri/{album.slug}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-emerald-700 font-semibold">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[11px]">
                        {album.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-gray-500">
                      {album.items?.length ?? album._count?.items ?? 0} foto
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right space-x-1">
                      <button
                        onClick={() => openEditModal(album, 'info')}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-forest-800 hover:bg-forest-50 transition-colors"
                        title="Edit Informasi Album"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(album, 'photos')}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Kelola Foto Album"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(album)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Album"
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

      {/* Create & Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        maxWidth={editingItem ? '2xl' : 'lg'}
        title={editingItem ? `Edit Album: ${editingItem.title}` : 'Buat Album Galeri Baru'}
      >
        <div>
          {/* Tab Navigation when editing */}
          {editingItem && (
            <div className="flex border-b border-gray-100 mb-5 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'info'
                    ? 'border-forest-700 text-forest-800'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Informasi Album</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'photos'
                    ? 'border-forest-700 text-forest-800'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Foto dalam Album ({currentAlbum?.items?.length ?? currentAlbum?._count?.items ?? 0})</span>
              </button>
            </div>
          )}

          {/* Tab 1: Info Form */}
          {activeTab === 'info' && (
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
              <ImageUploadInput
                label="Foto Sampul Album (Cover)"
                value={coverUrl}
                onChange={setCoverUrl}
                aspectRatio="video"
                helperText="Pilih foto sampul album dari komputer (format JPG, PNG, WebP maks. 5MB)."
              />
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Album</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan singkat tentang album ini..."
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
                  {saveMutation.isPending ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Buat Album'}
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Photos Management */}
          {activeTab === 'photos' && currentAlbum && (
            <div className="space-y-6">
              {/* Add New Photo Form */}
              <form onSubmit={handleAddPhoto} className="p-4 rounded-2xl bg-slate-50 border border-gray-200/80 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <FolderPlus className="w-4 h-4 text-emerald-700" />
                  <span>Tambah Foto Baru ke Album Ini</span>
                </div>
                <ImageUploadInput
                  label="Pilih File Foto"
                  value={newPhotoUrl}
                  onChange={setNewPhotoUrl}
                  aspectRatio="video"
                  helperText="Format JPG, PNG, WebP maks. 5MB. Otomatis dikompresi ke WebP."
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Keterangan / Caption Foto (Opsional)</label>
                  <input
                    type="text"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    placeholder="Contoh: Peserta didik mempresentasikan hasil karya mesin bubut"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={addPhotoMutation.isPending || !newPhotoUrl}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all"
                  >
                    {addPhotoMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>{addPhotoMutation.isPending ? 'Menambahkan...' : 'Tambahkan Foto ke Album'}</span>
                  </button>
                </div>
              </form>

              {/* Photos List Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900">
                    Daftar Foto dalam Album ({currentAlbum.items?.length || 0})
                  </h4>
                </div>

                {!currentAlbum.items || currentAlbum.items.length === 0 ? (
                  <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400">
                    Belum ada foto dalam album ini. Gunakan formulir di atas untuk mengunggah foto pertama.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                    {currentAlbum.items.map((item) => (
                      <div
                        key={item.id}
                        className="group relative rounded-xl border border-gray-100 bg-white shadow-2xs overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                          <img
                            src={item.media?.url}
                            alt={item.caption || 'Foto Galeri'}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              deletePhotoMutation.mutate({ galleryId: currentAlbum.id, itemId: item.id })
                            }
                            disabled={deletePhotoMutation.isPending}
                            className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white shadow-sm transition-all"
                            title="Hapus foto ini dari album"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-2">
                          <p className="text-[11px] text-gray-700 font-medium line-clamp-2">
                            {item.caption || <span className="text-gray-400 italic">Tanpa keterangan</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus Album">
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Hapus album <strong className="text-gray-900">"{deleteTarget?.title}"</strong>? Seluruh foto di dalamnya akan dikeluarkan dari album. Tindakan ini tidak dapat dibatalkan.
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
              {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
