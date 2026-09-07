import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { FacilityItem } from '../../types';
import { Building2, MapPin, Loader2 } from 'lucide-react';
import { SkeletonNewsGrid } from '../../components/ui/Skeleton';

export const FacilitiesPage: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: facilities, isLoading } = useQuery<FacilityItem[]>({
    queryKey: ['publicFacilitiesList', categoryFilter],
    queryFn: () => {
      const q = new URLSearchParams();
      if (categoryFilter) q.set('category', categoryFilter);
      return api.get(`/public/facilities?${q.toString()}`);
    },
  });

  const categories = ['Lab & Bengkel', 'Ruang Belajar', 'Olahraga', 'Penunjang'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-lg bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider inline-block">
          Infrastruktur & Sarana
        </span>
        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-forest-900">
          Fasilitas Sekolah
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
          Ruang praktik, bengkel modern, laboratorium komputer, dan sarana penunjang berstandar industri untuk mendukung proses belajar mengajar optimal.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => setCategoryFilter('')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            !categoryFilter
              ? 'bg-forest-800 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-forest-50 border border-gray-200/60'
          }`}
        >
          Semua Fasilitas
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              categoryFilter === cat
                ? 'bg-forest-800 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-forest-50 border border-gray-200/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Facilities Grid */}
      {isLoading ? (
        <SkeletonNewsGrid count={6} />
      ) : !facilities?.length ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-base font-bold text-gray-800">Tidak ada fasilitas pada kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-forest-900">
                  <img
                    src={
                      item.imageUrl ||
                      '/images/campus.jpg'
                    }
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-forest-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {item.name}
                  </h3>
                  {item.location && (
                    <p className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-600 leading-relaxed font-light pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
