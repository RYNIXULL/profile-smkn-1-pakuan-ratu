import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { GalleryItem } from '../../types';
import { Image as ImageIcon, ArrowRight, Loader2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const GalleriesPage: React.FC = () => {
  const { data: galleries, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['publicGalleriesList'],
    queryFn: () => api.get('/public/galleries'),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider inline-block">
          Dokumentasi Visual
        </span>
        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-forest-900">
          Galeri & Album Sekolah
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
          Kumpulan momen berharga, pembelajaran praktik lahan, gelar karya siswa, dan kegiatan ekstrakurikuler di SMKN 1 Pakuan Ratu.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-forest-800">
          <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
          <p className="text-xs font-medium text-gray-500 mt-3">Memuat album galeri...</p>
        </div>
      ) : !galleries?.length ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-base font-bold text-gray-800">Belum ada album galeri.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((album) => {
            const coverImage =
              album.coverUrl ||
              album.items?.[0]?.media?.url ||
              'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop';

            return (
              <Link
                key={album.id}
                to={`/galeri/${album.slug}`}
                className="group rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-forest-900">
                    <img
                      src={coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-forest-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                        {album.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <span className="text-[11px] text-gray-400 block">
                      {formatDate(album.createdAt)}
                    </span>
                    <h2 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-forest-700 transition-colors">
                      {album.title}
                    </h2>
                    {album.description && (
                      <p className="text-xs text-gray-600 leading-relaxed font-light line-clamp-2">
                        {album.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between text-xs font-semibold text-purple-700 group-hover:text-purple-900">
                  <span>Lihat Seluruh Foto</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
