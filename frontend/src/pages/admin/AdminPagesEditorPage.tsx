import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { StaticPage } from '../../types';
import { Save, FileText, Loader2 } from 'lucide-react';
import { toast } from '../../stores/toastStore';

export const AdminPagesEditorPage: React.FC = () => {
  const [selectedSlug, setSelectedSlug] = useState('sambutan-kepala-sekolah');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const queryClient = useQueryClient();

  const { data: pages, isLoading } = useQuery<StaticPage[]>({
    queryKey: ['adminPagesList'],
    queryFn: () => api.get('/admin/pages'),
  });

  const currentPage = pages?.find((p) => p.slug === selectedSlug);

  React.useEffect(() => {
    if (currentPage) {
      setTitle(currentPage.title);
      setContent(currentPage.content);
    }
  }, [currentPage, selectedSlug]);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!currentPage) throw new Error('Halaman tidak ditemukan');
      return api.patch(`/admin/pages/${currentPage.id}`, { title, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPagesList'] });
      queryClient.invalidateQueries({ queryKey: ['publicPage', selectedSlug] });
      toast.success(`Konten halaman ${title} berhasil diperbarui.`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal memperbarui halaman.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Judul dan isi halaman tidak boleh kosong.');
      return;
    }
    saveMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-forest-800">
        <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
        <p className="text-xs font-medium text-gray-500 mt-3">Memuat halaman statis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Editor Halaman Profil Sekolah</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Perbarui konten sambutan, sejarah, visi misi, dan struktur kepemimpinan sekolah.
        </p>
      </div>

      {/* Page Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { slug: 'sambutan-kepala-sekolah', label: 'Sambutan Kepala Sekolah' },
          { slug: 'sejarah', label: 'Sejarah Sekolah' },
          { slug: 'visi-misi', label: 'Visi & Misi' },
          { slug: 'struktur-organisasi', label: 'Struktur Organisasi' },
        ].map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setSelectedSlug(item.slug)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSlug === item.slug
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Slug: /profil/{selectedSlug}</span>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">Edit Konten Halaman</h3>
          </div>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Halaman *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Isi Konten Halaman * (Mendukung HTML)
          </label>
          <textarea
            required
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 font-mono leading-relaxed"
          />
        </div>
      </form>
    </div>
  );
};
