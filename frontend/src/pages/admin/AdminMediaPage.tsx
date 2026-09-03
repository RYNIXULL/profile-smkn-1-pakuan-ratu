import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { MediaItem, Pagination } from '../../types';
import {
  Upload,
  Search,
  Copy,
  Trash2,
  Image as ImageIcon,
  Check,
  Loader2,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';

export const AdminMediaPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{
    items: MediaItem[];
    pagination: Pagination;
  }>({
    queryKey: ['adminMediaList', page, search],
    queryFn: () => {
      const q = new URLSearchParams();
      q.set('page', page.toString());
      q.set('limit', '24');
      if (search) q.set('search', search);
      return api.get(`/admin/media?${q.toString()}`);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => api.upload('/admin/media/upload', formData),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminMediaList'] });
      toast.success(`${res.length} foto berhasil diunggah dan dioptimasi.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal mengunggah file media.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMediaList'] });
      toast.success('Media berhasil dihapus.');
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus file media.');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append('files', e.target.files[i]);
      }
      uploadMutation.mutate(formData);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('URL media berhasil disalin ke papan klip!');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Upload Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Media Library</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Pusat penyimpanan foto, thumbnail, dan dokumentasi sekolah teroptimasi.
          </p>
        </div>

        <div>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            id="media-file-input"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengunggah & Mengonversi...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Foto / Media</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari nama file atau keterangan foto..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <p className="text-[11px] text-gray-400 hidden sm:block">
          Format otomatis dioptimasi ke WebP berkualitas tinggi
        </p>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-forest-800">
          <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
          <p className="text-xs font-medium text-gray-500 mt-3">Memuat media library...</p>
        </div>
      ) : !data?.items.length ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-base font-bold text-gray-800">Belum ada media yang diunggah.</p>
          <p className="text-xs text-gray-500 mt-1">Klik tombol Upload Foto di atas untuk menambahkan media baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    className="p-2 rounded-xl bg-white/90 hover:bg-white text-gray-800 transition-colors"
                    title="Salin URL Gambar"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                    title="Hapus Media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-2.5 space-y-0.5">
                <p className="text-[11px] font-semibold text-gray-800 truncate" title={item.originalName}>
                  {item.originalName}
                </p>
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span>{formatFileSize(item.sizeBytes)}</span>
                  {item.width && item.height && <span>{item.width}x{item.height}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Konfirmasi Hapus Media"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus file media{' '}
            <strong className="text-gray-900 font-semibold">
              "{deleteTarget?.originalName}"
            </strong>
            ? File fisik akan dihapus dari server penyimpanan.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus File'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
