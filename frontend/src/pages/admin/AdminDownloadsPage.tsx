import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { DownloadItem } from '../../types';
import { DownloadCloud, Plus, Edit, Trash2, FileText, Loader2, HardDrive, Calendar } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';

export const AdminDownloadsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DownloadItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DownloadItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Akademik & Kurikulum');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [fileType, setFileType] = useState('PDF');
  const [publishedDate, setPublishedDate] = useState('1 Juli 2026');

  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery<DownloadItem[]>({
    queryKey: ['adminDownloadsList'],
    queryFn: () => api.get('/admin/downloads'),
  });

  const saveMutation = useMutation({
    mutationFn: (items: DownloadItem[]) => api.put('/admin/downloads', { items }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDownloadsList'] });
      queryClient.invalidateQueries({ queryKey: ['publicDownloads'] });
      toast.success('Daftar dokumen unduhan berhasil disimpan.');
      setModalOpen(false);
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan dokumen.');
    },
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Akademik & Kurikulum');
    setDescription('');
    setFileUrl('');
    setFileSize('1.5 MB');
    setFileType('PDF');
    setPublishedDate(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    setModalOpen(true);
  };

  const openEditModal = (item: DownloadItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description);
    setFileUrl(item.fileUrl);
    setFileSize(item.fileSize);
    setFileType(item.fileType);
    setPublishedDate(item.publishedDate);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileUrl.trim()) {
      toast.error('Judul dokumen dan tautan file wajib diisi.');
      return;
    }

    const currentList = [...(documents || [])];
    let updatedList: DownloadItem[];

    if (editingItem) {
      updatedList = currentList.map((doc) =>
        doc.id === editingItem.id
          ? {
              ...doc,
              title,
              category,
              description,
              fileUrl,
              fileSize,
              fileType,
              publishedDate,
            }
          : doc
      );
    } else {
      updatedList = [
        ...currentList,
        {
          id: `doc-${Date.now()}`,
          title,
          category,
          description,
          fileUrl,
          fileSize,
          fileType,
          downloadCount: 0,
          publishedDate,
        },
      ];
    }

    saveMutation.mutate(updatedList);
  };

  const handleDelete = (id: string) => {
    const currentList = [...(documents || [])];
    const updatedList = currentList.filter((doc) => doc.id !== id);
    saveMutation.mutate(updatedList);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pusat Unduhan Dokumen</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola berkas resmi kalender akademik, tata tertib, panduan PKL, dan formulir permohonan sekolah.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumen Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-forest-800">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            <p className="text-xs font-medium text-gray-500 mt-3">Memuat dokumen...</p>
          </div>
        ) : !documents?.length ? (
          <div className="text-center py-16 text-gray-500 text-xs">Belum ada dokumen yang dipublikasikan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Format</th>
                  <th className="px-6 py-4">Judul Dokumen</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Ukuran & Tanggal</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-gray-200 text-gray-700 font-extrabold text-[10px]">
                        {doc.fileType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{doc.title}</div>
                      <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{doc.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-emerald-800 font-semibold">{doc.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      <div>{doc.fileSize}</div>
                      <div className="text-[11px] text-gray-400">{doc.publishedDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                      <button
                        onClick={() => openEditModal(doc)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-forest-800 hover:bg-forest-50 transition-colors"
                        title="Edit Dokumen"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(doc)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Dokumen"
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

      {/* CREATE & EDIT MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="lg"
        title={editingItem ? 'Edit Dokumen Unduhan' : 'Tambah Dokumen Unduhan Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Judul Dokumen Resmi *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kalender Pendidikan TA 2026/2027"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Kategori Dokumen</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
              >
                <option value="Akademik & Kurikulum">Akademik & Kurikulum</option>
                <option value="Kesiswaan & Tata Tertib">Kesiswaan & Tata Tertib</option>
                <option value="PKL & Magang Industri">PKL & Magang Industri</option>
                <option value="Administrasi & Surat">Administrasi & Surat</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Format Ekstensi File</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
              >
                <option value="PDF">PDF (Dokumen Standar)</option>
                <option value="DOCX">DOCX (Microsoft Word)</option>
                <option value="XLSX">XLSX (Microsoft Excel)</option>
                <option value="ZIP">ZIP (Arsip Berkas)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tautan / URL File Dokumen *</label>
              <input
                type="text"
                required
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="/uploads/nama-file.pdf atau https://..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Ukuran File</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="Contoh: 1.8 MB"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Tanggal Terbit Dokumen</label>
            <input
              type="text"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              placeholder="Contoh: 1 Juli 2026"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Deskripsi Singkat Dokumen</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan isi berkas dan peruntukan dokumen ini..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 font-semibold text-gray-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-4 py-2 rounded-xl bg-forest-800 text-white font-semibold"
            >
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Dokumen'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus Dokumen">
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Hapus dokumen <strong className="text-gray-900">"{deleteTarget?.title}"</strong> dari pusat unduhan?
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl bg-gray-100 font-semibold">
              Batal
            </button>
            <button
              onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
              disabled={saveMutation.isPending}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold"
            >
              {saveMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
