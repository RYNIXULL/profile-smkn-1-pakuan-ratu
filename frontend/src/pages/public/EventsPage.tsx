import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { EventItem } from '../../types';
import { MapPin, Clock, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import { SkeletonEventList } from '../../components/ui/Skeleton';

export const EventsPage: React.FC = () => {
  const { data: events, isLoading } = useQuery<EventItem[]>({
    queryKey: ['publicEventsPage'],
    queryFn: () => api.get('/public/events'),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider inline-block">
          Kalender Pendidikan
        </span>
        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-forest-900">
          Agenda & Kegiatan Sekolah
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
          Jadwal pelaksanaan uji kompetensi, pameran karya vokasi, workshop kemitraan industri, dan kegiatan akademik SMKN 1 Pakuan Ratu.
        </p>
      </div>

      {isLoading ? (
        <SkeletonEventList count={4} />
      ) : !events?.length ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-base font-bold text-gray-800">Belum ada agenda terdekat saat ini.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="glass-card p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              {/* Date Box */}
              <div className="p-4 rounded-2xl bg-forest-800 text-white text-center flex-shrink-0 min-w-[90px] shadow-sm">
                <span className="block text-3xl font-extrabold font-serif leading-none">
                  {new Date(ev.startDate).getDate()}
                </span>
                <span className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mt-1">
                  {new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(new Date(ev.startDate))}
                </span>
                <span className="block text-[10px] text-cream-300 mt-0.5">
                  {new Date(ev.startDate).getFullYear()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {ev.status}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                  {ev.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-forest-600" />
                    <span>{formatDateTime(ev.startDate)}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-forest-600" />
                    <span>{ev.location}</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-2">
                  {ev.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
