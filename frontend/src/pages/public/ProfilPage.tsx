import React from 'react';
import { NavLink, useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { StaticPage } from '../../types';
import { BookOpen, Award, Users, Compass, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';

export const ProfilPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();

  // Default to 'sambutan-kepala-sekolah' if on base /profil
  const activeSlug = slug || 'sambutan-kepala-sekolah';

  const { data: page, isLoading, isError } = useQuery<StaticPage>({
    queryKey: ['publicPage', activeSlug],
    queryFn: () => api.get(`/public/pages/${activeSlug}`),
  });

  const tabs = [
    { to: '/profil/sambutan-kepala-sekolah', slug: 'sambutan-kepala-sekolah', label: 'Sambutan Kepala Sekolah', icon: Compass },
    { to: '/profil/sejarah', slug: 'sejarah', label: 'Sejarah Sekolah', icon: BookOpen },
    { to: '/profil/visi-misi', slug: 'visi-misi', label: 'Visi & Misi', icon: Award },
    { to: '/profil/struktur-organisasi', slug: 'struktur-organisasi', label: 'Struktur Organisasi', icon: Users },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-lg bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider inline-block">
          Identitas & Informasi Resmi
        </span>
        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-forest-900">
          Profil SMKN 1 Pakuan Ratu
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
          Mengenal lebih dekat visi kejuruan, kepemimpinan, dan perjalanan sejarah pengembangan pusat keunggulan vokasi Way Kanan.
        </p>
      </div>

      {/* Glassmorphism Sub-navigation Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/60 shadow-sm overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeSlug === tab.slug;
          return (
            <NavLink
              key={tab.slug}
              to={tab.to}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'text-gray-600 hover:text-forest-900 hover:bg-forest-50/60'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Content Container */}
      <div className="glass-card p-6 sm:p-12 rounded-3xl border border-forest-100 shadow-sm min-h-[360px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-forest-800">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            <p className="text-xs font-medium text-gray-500 mt-3">Memuat konten halaman profil...</p>
          </div>
        ) : isError || !page ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Konten halaman sedang diperbarui oleh admin sekolah.</p>
          </div>
        ) : (
          <article className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-forest-950 prose-a:text-forest-700 prose-img:rounded-2xl">
            <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-forest-900 mb-6 pb-4 border-b border-gray-100">
              {page.title}
            </h2>
            <div
              className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }}
            />
          </article>
        )}
      </div>
    </div>
  );
};
