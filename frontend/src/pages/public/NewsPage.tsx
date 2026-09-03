import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { NewsItem, NewsCategory, Pagination } from '../../types';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const NewsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const category = searchParams.get('category') || '';
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const { data: categories } = useQuery<NewsCategory[]>({
    queryKey: ['publicCategories'],
    queryFn: () => api.get('/public/news-categories'),
  });

  const { data: newsResponse, isLoading } = useQuery<{
    items: NewsItem[];
    pagination: Pagination;
  }>({
    queryKey: ['publicNewsList', page, category, searchParams.get('search')],
    queryFn: () => {
      const q = new URLSearchParams();
      q.set('page', page.toString());
      q.set('limit', '9');
      if (category) q.set('category', category);
      const s = searchParams.get('search');
      if (s) q.set('search', s);
      return api.get(`/public/news?${q.toString()}`);
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategoryClick = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-lg bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider inline-block">
          Warta & Pengumuman
        </span>
        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-forest-900">
          Kabar & Berita Sekolah
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
          Informasi terkini seputar kegiatan akademik, prestasi siswa, inovasi kejuruan, dan kemitraan industri di SMKN 1 Pakuan Ratu.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <button
              onClick={() => handleCategoryClick('')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                !category
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-white/80 text-gray-600 hover:bg-forest-50 border border-gray-200/60'
              }`}
            >
              Semua Kategori
            </button>
            {(categories || []).map((cat) => {
              const active = category === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-white/80 text-gray-600 hover:bg-forest-50 border border-gray-200/60'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari judul berita..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-forest-700 shadow-xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* News Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-forest-800">
          <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
          <p className="text-xs font-medium text-gray-500 mt-3">Memuat artikel berita...</p>
        </div>
      ) : !newsResponse?.items.length ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-base font-bold text-gray-800">Tidak ada berita yang ditemukan.</p>
          <p className="text-xs text-gray-500 mt-1">Coba gunakan kata kunci lain atau pilih kategori berbeda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsResponse.items.map((item) => (
            <Link
              key={item.id}
              to={`/berita/${item.slug}`}
              className="group rounded-3xl bg-white border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-forest-900">
                  <img
                    src={
                      item.thumbnailUrl ||
                      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=600&auto=format&fit=crop'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-forest-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                      {item.category?.name || 'Vokasi'}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <span className="text-[11px] text-gray-400 font-medium block">
                    {formatDate(item.publishedAt)}
                  </span>
                  <h2 className="text-base font-bold text-gray-900 group-hover:text-forest-700 transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 font-light">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                <span>Baca Selengkapnya</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {newsResponse && newsResponse.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            disabled={page <= 1}
            onClick={() => {
              const p = new URLSearchParams(searchParams);
              p.set('page', (page - 1).toString());
              setSearchParams(p);
            }}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-forest-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-gray-600">
            Halaman {page} dari {newsResponse.pagination.totalPages}
          </span>
          <button
            disabled={page >= newsResponse.pagination.totalPages}
            onClick={() => {
              const p = new URLSearchParams(searchParams);
              p.set('page', (page + 1).toString());
              setSearchParams(p);
            }}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-forest-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
