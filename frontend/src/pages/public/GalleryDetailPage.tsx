import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { GalleryItem } from '../../types';
import { ArrowLeft, X, ZoomIn, Loader2 } from 'lucide-react';

export const GalleryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption?: string | null } | null>(null);

  const { data: gallery, isLoading, isError } = useQuery<GalleryItem>({
    queryKey: ['publicGalleryDetail', slug],
    queryFn: () => api.get(`/public/galleries/${slug}`),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-forest-800">
        <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
        <p className="text-xs font-medium text-gray-500 mt-3">Memuat album foto...</p>
      </div>
    );
  }

  if (isError || !gallery) {
    return <Navigate to="/galeri" replace />;
  }

  // Gabungkan foto: sertakan coverUrl sebagai foto utama jika belum ada di dalam daftar items
  const photos = [...(gallery.items || [])];
  if (gallery.coverUrl && !photos.some((p) => p.media?.url === gallery.coverUrl)) {
    photos.unshift({
      id: `cover-${gallery.id}`,
      caption: gallery.title,
      orderIndex: -1,
      media: {
        id: 'cover',
        filename: 'cover.webp',
        originalName: gallery.title,
        url: gallery.coverUrl,
        mimeType: 'image/webp',
        sizeBytes: 0,
        createdAt: gallery.createdAt,
      },
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back Link */}
      <div>
        <Link
          to="/galeri"
          className="inline-flex items-center gap-2 text-xs font-semibold text-forest-800 hover:text-forest-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Semua Galeri</span>
        </Link>
      </div>

      {/* Album Info */}
      <div className="space-y-3 max-w-3xl">
        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
          Album: {gallery.category}
        </span>
        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-forest-950">
          {gallery.title}
        </h1>
        {gallery.description && (
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
            {gallery.description}
          </p>
        )}
      </div>

      {/* Photo Grid */}
      {!photos.length ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-base font-bold text-gray-800">Belum ada foto dalam album ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage({ url: item.media.url, caption: item.caption })}
              className="group relative rounded-3xl overflow-hidden aspect-square bg-forest-900 cursor-pointer shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={item.media.url}
                alt={item.caption || gallery.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold leading-snug">
                    {item.caption || item.media.originalName}
                  </p>
                  <ZoomIn className="w-5 h-5 text-purple-300 flex-shrink-0 ml-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Tutup foto"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] flex flex-col items-center"
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.caption || 'Foto Galeri'}
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
            {selectedImage.caption && (
              <p className="text-xs sm:text-sm text-cream-200 mt-4 text-center font-medium">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
