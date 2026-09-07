import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { DownloadItem } from '../../types';
import {
  FileDown,
  FileText,
  Search,
  Calendar,
  HardDrive,
  Filter,
  DownloadCloud,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { SkeletonNewsGrid } from '../../components/ui/Skeleton';

const CATEGORIES = [
  'Semua',
  'Akademik & Kurikulum',
  'Kesiswaan & Tata Tertib',
  'PKL & Magang Industri',
  'Administrasi & Surat',
];

export const DownloadsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: documents, isLoading } = useQuery<DownloadItem[]>({
    queryKey: ['publicDownloads', selectedCategory, searchQuery],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'Semua') params.set('category', selectedCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      const qs = params.toString();
      return api.get<DownloadItem[]>(`/public/downloads${qs ? `?${qs}` : ''}`);
    },
  });

  const getFileBadgeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'DOCX':
      case 'DOC':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'XLSX':
      case 'XLS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-forest-900 via-forest-800 to-forest-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold mb-6">
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Arsip Resmi & Dokumen Publik Sekolah</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Pusat Unduhan Dokumen
            </h1>
            <p className="mt-4 text-base sm:text-lg text-cream-200 leading-relaxed">
              Unduh berkas resmi kalender akademik, tata tertib siswa, panduan magang PKL industri, serta formulir administrasi sekolah.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FILTER & PENCARIAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul dokumen atau topik..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
              />
            </div>

            <div className="text-xs text-gray-500 font-medium">
              Menampilkan <strong>{documents?.length || 0}</strong> berkas dokumen
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-gray-100">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-gray-600 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DAFTAR DOKUMEN UNDUHAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <SkeletonNewsGrid count={6} />
        ) : !documents?.length ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-white border border-dashed border-gray-200 text-xs text-gray-500">
            Tidak ada dokumen yang ditemukan untuk kategori atau kata kunci tersebut.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-md border text-[10px] font-extrabold tracking-wider uppercase ${getFileBadgeColor(
                        doc.fileType
                      )}`}
                    >
                      {doc.fileType}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {doc.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{doc.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{doc.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-[11px] text-gray-400 space-y-0.5 font-medium">
                    <div className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      <span>{doc.fileSize}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{doc.publishedDate}</span>
                    </div>
                  </div>

                  <a
                    href={doc.fileUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-2xs transition-all"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
