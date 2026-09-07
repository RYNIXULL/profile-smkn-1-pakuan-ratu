import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { AnnouncementItem } from '../../types';
import { Bell, AlertCircle, Calendar, Download, Loader2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { SkeletonEventList } from '../../components/ui/Skeleton';

export const AnnouncementsPage: React.FC = () => {
  const { data: announcements, isLoading } = useQuery<AnnouncementItem[]>({
    queryKey: ['publicAnnouncementsList'],
    queryFn: () => api.get('/public/announcements'),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider inline-block">
          Warta Kampus
        </span>
        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-forest-900">
          Pengumuman Resmi
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
          Edaran penting mengenai penerimaan siswa baru, libur semester, jadwal ujian, dan surat dinas resmi SMKN 1 Pakuan Ratu.
        </p>
      </div>

      {isLoading ? (
        <SkeletonEventList count={4} />
      ) : !announcements?.length ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-base font-bold text-gray-800">Tidak ada pengumuman aktif saat ini.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((item) => (
            <div
              key={item.id}
              className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all ${
                item.isUrgent
                  ? 'bg-rose-50/50 border-rose-200 shadow-rose-100'
                  : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {item.isUrgent && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      <AlertCircle className="w-3 h-3" /> Penting
                    </span>
                  )}
                  <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Diterbitkan: {formatDate(item.publishedAt)}</span>
                  </span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                {item.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-3 whitespace-pre-line">
                {item.content}
              </p>

              {item.attachment && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={item.attachment}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Dokumen Lampiran</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
