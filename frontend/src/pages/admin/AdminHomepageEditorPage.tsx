import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { HomepageSection } from '../../types';
import { Save, SlidersHorizontal, Loader2 } from 'lucide-react';
import { toast } from '../../stores/toastStore';

export const AdminHomepageEditorPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: sections, isLoading } = useQuery<HomepageSection[]>({
    queryKey: ['adminHomepageSections'],
    queryFn: () => api.get('/admin/homepage'),
  });

  // Hero section states
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [primaryCtaText, setPrimaryCtaText] = useState('Jelajahi Sekolah');
  const [secondaryCtaText, setSecondaryCtaText] = useState('Program Keahlian');

  useEffect(() => {
    if (sections) {
      const hero = sections.find((s) => s.sectionKey === 'hero');
      if (hero) {
        setHeroTitle(hero.title);
        setHeroSubtitle(hero.subtitle || '');
        if (hero.content) {
          try {
            const data = JSON.parse(hero.content);
            if (data.primaryCtaText) setPrimaryCtaText(data.primaryCtaText);
            if (data.secondaryCtaText) setSecondaryCtaText(data.secondaryCtaText);
          } catch {
            // ignore
          }
        }
      }
    }
  }, [sections]);

  const saveHeroMutation = useMutation({
    mutationFn: () =>
      api.put('/admin/homepage/hero', {
        title: heroTitle,
        subtitle: heroSubtitle,
        content: JSON.stringify({
          primaryCtaText,
          secondaryCtaText,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminHomepageSections'] });
      queryClient.invalidateQueries({ queryKey: ['homepageSections'] });
      toast.success('Pengaturan seksi Hero beranda berhasil disimpan.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan seksi hero.');
    },
  });

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroTitle.trim()) {
      toast.error('Judul Hero tidak boleh kosong.');
      return;
    }
    saveHeroMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-forest-800">
        <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
        <p className="text-xs font-medium text-gray-500 mt-3">Memuat seksi beranda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Pengaturan Beranda (Homepage)</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Kelola teks banner utama, tombol CTA, dan visibilitas seksi halaman depan tanpa coding.
        </p>
      </div>

      {/* Hero Section Card */}
      <form onSubmit={handleSaveHero} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-gray-900">Seksi Banner Utama (Hero Section)</h3>
          </div>
          <button
            type="submit"
            disabled={saveHeroMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saveHeroMutation.isPending ? 'Menyimpan...' : 'Simpan Hero'}</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Judul Utama Hero (Headline) *
          </label>
          <input
            type="text"
            required
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Tumbuh dari Akar. Melangkah ke Masa Depan."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Subjudul / Deskripsi Singkat Hero
          </label>
          <textarea
            rows={3}
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            placeholder="Penjelasan identitas keunggulan SMKN 1 Pakuan Ratu..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Teks Tombol Aksi Utama (CTA 1)
            </label>
            <input
              type="text"
              value={primaryCtaText}
              onChange={(e) => setPrimaryCtaText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Teks Tombol Aksi Kedua (CTA 2)
            </label>
            <input
              type="text"
              value={secondaryCtaText}
              onChange={(e) => setSecondaryCtaText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
