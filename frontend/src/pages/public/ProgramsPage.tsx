import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { ProgramItem } from '../../types';
import { Sprout, Beef, TrendingUp, Palette, Wrench, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { SkeletonNewsGrid } from '../../components/ui/Skeleton';

const programIcons: Record<string, React.ReactNode> = {
  pertanian: <Sprout className="w-8 h-8 text-emerald-600" />,
  peternakan: <Beef className="w-8 h-8 text-amber-600" />,
  'akuntansi-bisnis-digital': <TrendingUp className="w-8 h-8 text-blue-600" />,
  dkv: <Palette className="w-8 h-8 text-purple-600" />,
  tbsm: <Wrench className="w-8 h-8 text-rose-600" />,
};

const programImages: Record<string, string> = {
  pertanian: '/images/pertanian.jpg',
  peternakan: '/images/peternakan.jpg',
  'akuntansi-bisnis-digital': '/images/akuntansi.jpg',
  dkv: '/images/dkv.jpg',
  tbsm: '/images/tbsm.jpg',
};

export const ProgramsPage: React.FC = () => {
  const { data: programs, isLoading } = useQuery<ProgramItem[]>({
    queryKey: ['publicProgramsList'],
    queryFn: () => api.get('/public/programs'),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider inline-block">
          Pilihan Kejuruan Vokasi
        </span>
        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-forest-900">
          Lima Program Keahlian Unggulan
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
          Dirancang untuk menjawab kebutuhan nyata industri, kewirausahaan mandiri, dan kemajuan potensi daerah di Way Kanan dan sekitarnya.
        </p>
      </div>

      {isLoading ? (
        <SkeletonNewsGrid count={5} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(programs || []).map((prog) => (
            <div
              key={prog.id}
              className="group rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-forest-900">
                  <img
                    src={
                      prog.imageUrl ||
                      programImages[prog.slug] ||
                      '/images/campus.jpg'
                    }
                    alt={prog.name}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-md">
                    {programIcons[prog.slug] || <BookOpen className="w-6 h-6 text-forest-800" />}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-forest-800 transition-colors">
                    {prog.name}
                  </h2>
                  {prog.tagline && (
                    <p className="text-xs text-emerald-700 font-semibold leading-relaxed">
                      {prog.tagline}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {prog.shortDesc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/program-keahlian/${prog.slug}`}
                  className="w-full py-3 rounded-xl bg-forest-50 hover:bg-forest-800 hover:text-white text-forest-900 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>Detail Kurikulum & Fasilitas</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
