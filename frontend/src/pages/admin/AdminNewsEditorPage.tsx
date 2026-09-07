import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { NewsCategory, NewsItem, NewsStatus } from '../../types';
import { ArrowLeft, Save, Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from '../../stores/toastStore';
import { ImageUploadInput } from '../../components/ui/ImageUploadInput';

export const AdminNewsEditorPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [status, setStatus] = useState<NewsStatus>('DRAFT');
  const [isFeatured, setIsFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');

  // Fetch Categories
  const { data: categories } = useQuery<NewsCategory[]>({
    queryKey: ['adminNewsCategories'],
    queryFn: () => api.get('/public/news-categories'),
  });

  // Fetch existing news if editing
  const { data: existingNews, isLoading: isFetching } = useQuery<NewsItem>({
    queryKey: ['adminNewsDetail', id],
    queryFn: () => api.get(`/admin/news/${id}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingNews) {
      setTitle(existingNews.title);
      setCategoryId(existingNews.category?.id || '');
      setSummary(existingNews.summary);
      setContent(existingNews.content);
      setThumbnailUrl(existingNews.thumbnailUrl || '');
      setStatus(existingNews.status);
      setIsFeatured(existingNews.isFeatured);
      setMetaTitle(existingNews.metaTitle || '');
      setMetaDesc(existingNews.metaDesc || '');
    }
  }, [existingNews]);

  // Set default category when categories load
  useEffect(() => {
    if (categories && categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (isEdit) {
        return api.patch(`/admin/news/${id}`, payload);
      }
      return api.post('/admin/news', payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Berita berhasil diperbarui.' : 'Berita berhasil dibuat.');
      navigate('/admin/news');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan berita.');
    },
  });

  const handleSubmit = (targetStatus?: NewsStatus) => {
    if (!title.trim()) {
      toast.error('Judul berita wajib diisi.');
      return;
    }
    if (!categoryId) {
      toast.error('Kategori berita wajib dipilih.');
      return;
    }
    if (!summary.trim() || summary.length < 10) {
      toast.error('Ringkasan berita minimal 10 karakter.');
      return;
    }
    if (!content.trim() || content.length < 20) {
      toast.error('Isi konten berita minimal 20 karakter.');
      return;
    }

    const payload = {
      title,
      categoryId,
      summary,
      content,
      thumbnailUrl: thumbnailUrl.trim() || null,
      status: targetStatus || status,
      isFeatured,
      metaTitle: metaTitle.trim() || title,
      metaDesc: metaDesc.trim() || summary,
    };

    saveMutation.mutate(payload);
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-forest-800">
        <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
        <p className="text-xs font-medium text-gray-500 mt-3">Memuat artikel berita...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/news"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Edit Berita' : 'Tulis Berita Baru'}
            </h2>
            <p className="text-xs text-gray-500">
              {isEdit ? 'Perbarui informasi artikel warta sekolah.' : 'Buat artikel warta baru untuk website sekolah.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={saveMutation.isPending}
            onClick={() => handleSubmit('DRAFT')}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-gray-500" />
            <span>Simpan Draf</span>
          </button>
          <button
            type="button"
            disabled={saveMutation.isPending}
            onClick={() => handleSubmit('PUBLISHED')}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-4 h-4 text-emerald-200" />
            <span>{saveMutation.isPending ? 'Menyimpan...' : 'Terbitkan'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Judul Artikel Berita *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Panen Raya Melon Emas Hidroponik Jurusan Pertanian"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ringkasan Berita * (Tampil pada kartu beranda & list)
              </label>
              <textarea
                required
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Tuliskan 1-2 kalimat ringkasan penting artikel..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Konten Lengkap Berita * (Mendukung tag HTML & paragraf)
              </label>
              <div className="flex items-center gap-1 p-2 bg-slate-50 border border-b-0 border-gray-200 rounded-t-xl text-xs text-gray-600">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">
                  Editor Teks Kaya
                </span>
              </div>
              <textarea
                required
                rows={14}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="<p>Tuliskan isi berita lengkap di sini...</p><h2>Sub Judul</h2><p>Penjelasan detail kegiatan...</p>"
                className="w-full px-4 py-3 rounded-b-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 font-mono leading-relaxed"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Format HTML akan otomatis disanitasi di sisi server demi keamanan aplikasi.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Configuration (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Pengaturan Publikasi
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Status Alur Berita
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NewsStatus)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
              >
                <option value="DRAFT">Draf (Disimpan sementara)</option>
                <option value="REVIEW">Ditinjau (Menunggu persetujuan)</option>
                <option value="PUBLISHED">Diterbitkan (Muncul di website)</option>
                <option value="ARCHIVED">Diarsipkan (Tidak tampil di publik)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kategori Berita *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
              >
                {(categories || []).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <ImageUploadInput
              label="Gambar Sampul Berita (Thumbnail)"
              value={thumbnailUrl}
              onChange={setThumbnailUrl}
              aspectRatio="video"
              helperText="Pilih foto sampul berita dari komputer (format JPG, PNG, WebP maks. 5MB). Otomatis dioptimasi ke WebP."
            />

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-gray-300 text-forest-800 focus:ring-forest-700 w-4 h-4"
              />
              <label htmlFor="isFeatured" className="text-xs font-semibold text-gray-700 cursor-pointer">
                Tampilkan sebagai Berita Unggulan
              </label>
            </div>
          </div>

          {/* SEO Metadata Box */}
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Optimasi Mesin Pencari (SEO)
            </h3>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Judul untuk Google Search"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                placeholder="Deskripsi singkat artikel di hasil pencarian..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
