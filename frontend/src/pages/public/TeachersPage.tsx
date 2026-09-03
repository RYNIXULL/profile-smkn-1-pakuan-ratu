import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { TeacherItem } from '../../types';
import { Users, GraduationCap, Briefcase, Loader2 } from 'lucide-react';

export const TeachersPage: React.FC = () => {
  const [filterStaff, setFilterStaff] = useState<'ALL' | 'GURU' | 'STAFF'>('ALL');

  const { data: teachers, isLoading } = useQuery<TeacherItem[]>({
    queryKey: ['publicTeachersList', filterStaff],
    queryFn: () => {
      let endpoint = '/public/teachers';
      if (filterStaff === 'GURU') endpoint += '?staff=false';
      if (filterStaff === 'STAFF') endpoint += '?staff=true';
      return api.get(endpoint);
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-lg bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider inline-block">
          Pendidik & Tenaga Kependidikan
        </span>
        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-forest-900">
          Guru & Staf SMKN 1 Pakuan Ratu
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
          Didukung oleh tenaga pendidik profesional, bersertifikasi keahlian industri, dan berdedikasi membimbing potensi vokasi siswa.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setFilterStaff('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterStaff === 'ALL'
              ? 'bg-forest-800 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-forest-50 border border-gray-200/60'
          }`}
        >
          Semua Pendidik & Staf
        </button>
        <button
          onClick={() => setFilterStaff('GURU')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterStaff === 'GURU'
              ? 'bg-forest-800 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-forest-50 border border-gray-200/60'
          }`}
        >
          Dewan Guru
        </button>
        <button
          onClick={() => setFilterStaff('STAFF')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterStaff === 'STAFF'
              ? 'bg-forest-800 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-forest-50 border border-gray-200/60'
          }`}
        >
          Tenaga Kependidikan (TU)
        </button>
      </div>

      {/* Grid Teachers */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-forest-800">
          <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
          <p className="text-xs font-medium text-gray-500 mt-3">Memuat data guru...</p>
        </div>
      ) : !teachers?.length ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-base font-bold text-gray-800">Data belum tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teachers.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col items-center text-center p-6 space-y-4"
            >
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-forest-100 shadow-inner flex-shrink-0">
                <img
                  src={
                    item.photoUrl ||
                    '/images/kepsek.jpg'
                  }
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900 leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-700">
                  {item.position}
                </p>
                {item.subject && (
                  <p className="text-[11px] text-gray-500 font-medium">
                    {item.subject}
                  </p>
                )}
                {item.nip && (
                  <p className="text-[10px] text-gray-400 font-mono">
                    NIP: {item.nip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
