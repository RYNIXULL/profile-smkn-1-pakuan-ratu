import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { AchievementItem } from '../../types';
import { Award, Trophy, Medal, Filter, Loader2 } from 'lucide-react';
import { SkeletonNewsGrid } from '../../components/ui/Skeleton';

export const AchievementsPage: React.FC = () => {
  const [levelFilter, setLevelFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: achievements, isLoading } = useQuery<AchievementItem[]>({
    queryKey: ['publicAchievementsList', levelFilter, categoryFilter],
    queryFn: () => {
      const q = new URLSearchParams();
      if (levelFilter) q.set('level', levelFilter);
      if (categoryFilter) q.set('category', categoryFilter);
      return api.get(`/public/achievements?${q.toString()}`);
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider inline-block">
          Jejak Prestasi
        </span>
        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-forest-900">
          Prestasi & Kejuaraan Siswa
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
          Dedikasi, kerja keras, dan bimbingan guru yang mengantarkan peserta didik SMKN 1 Pakuan Ratu meraih panggung juara tingkat daerah hingga nasional.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-forest-700" />
          <span className="text-xs font-bold text-gray-700">Filter Prestasi:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:border-forest-700"
          >
            <option value="">Semua Tingkat</option>
            <option value="Kabupaten">Kabupaten</option>
            <option value="Provinsi">Provinsi</option>
            <option value="Nasional">Nasional</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:border-forest-700"
          >
            <option value="">Semua Kategori</option>
            <option value="Vokasi">Keahlian Vokasi / LKS</option>
            <option value="Akademik">Akademik & Sains</option>
            <option value="Olahraga">Olahraga</option>
            <option value="Seni">Seni & Kreatif</option>
          </select>
        </div>
      </div>

      {/* Grid Prestasi */}
      {isLoading ? (
        <SkeletonNewsGrid count={6} />
      ) : !achievements?.length ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-base font-bold text-gray-800">Tidak ada data prestasi yang cocok dengan filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white border border-gray-100 hover:border-amber-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-forest-900">
                  <img
                    src={
                      item.photoUrl ||
                      '/images/dkv.jpg'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      <span>{item.level} • {item.year}</span>
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <span className="text-[11px] text-emerald-700 font-semibold block">
                    Kategori: {item.category}
                  </span>
                  <h2 className="text-base font-bold text-gray-900 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-xs font-bold text-forest-800">
                    Peraih: {item.studentName}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Ajang: {item.competition}
                  </p>
                  {item.description && (
                    <p className="text-xs text-gray-600 leading-relaxed font-light line-clamp-3 pt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
