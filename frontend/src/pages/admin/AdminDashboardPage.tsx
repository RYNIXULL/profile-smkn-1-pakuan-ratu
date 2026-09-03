import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import {
  Newspaper,
  Calendar,
  Award,
  HardDrive,
  Plus,
  ArrowUpRight,
  Clock,
  ScrollText,
  Mail,
  Loader2,
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import { useAuth } from '../../stores/authStore';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<{
    news: { total: number; draft: number; published: number };
    upcomingEvents: number;
    totalAchievements: number;
    totalMedia: number;
    unreadMessages: number;
    recentAudits: Array<{
      id: string;
      action: string;
      resource: string;
      createdAt: string;
      user?: { name: string; email: string };
    }>;
  }>({
    queryKey: ['adminDashboardStats'],
    queryFn: () => api.get('/admin/dashboard/stats'),
  });

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-forest-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-forest-800 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
            Status: Aktif & Terhubung
          </span>
          <h2 className="editorial-title text-2xl sm:text-3xl font-bold leading-tight">
            Selamat Datang, {user?.name || 'Administrator'}!
          </h2>
          <p className="text-xs text-cream-200/80 max-w-xl font-light">
            Kelola publikasi berita, perbarui agenda kegiatan, unggah foto media dokumentasi, dan pantau seluruh konten sekolah dengan mudah tanpa menyentuh kode.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/news/create"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Berita</span>
          </Link>
          <Link
            to="/admin/events"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-100 text-xs font-semibold border border-forest-700 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Agenda</span>
          </Link>
          <Link
            to="/admin/media"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-100 text-xs font-semibold border border-forest-700 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-forest-800">
          <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
          <p className="text-xs font-medium text-gray-500 mt-3">Menghitung data statistik...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* News Stat */}
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Total Berita
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Newspaper className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900 font-serif">
                  {stats?.news.total || 0}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-2 font-medium">
                  <span className="text-emerald-600 font-bold">{stats?.news.published || 0} Terbit</span>
                  <span>•</span>
                  <span className="text-amber-600 font-bold">{stats?.news.draft || 0} Draf</span>
                </div>
              </div>
            </div>

            {/* Events Stat */}
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Agenda Mendatang
                </span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900 font-serif">
                  {stats?.upcomingEvents || 0}
                </p>
                <p className="text-[11px] text-gray-500 mt-2">
                  Kegiatan terjadwal di kalender
                </p>
              </div>
            </div>

            {/* Achievements Stat */}
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Total Prestasi
                </span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900 font-serif">
                  {stats?.totalAchievements || 0}
                </p>
                <p className="text-[11px] text-gray-500 mt-2">
                  Medali & kejuaraan tercatat
                </p>
              </div>
            </div>

            {/* Media Stat */}
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Media Library
                </span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                  <HardDrive className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900 font-serif">
                  {stats?.totalMedia || 0}
                </p>
                <p className="text-[11px] text-gray-500 mt-2">
                  Foto & file media terunggah
                </p>
              </div>
            </div>
          </div>

          {/* Recent Audit Activities */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-forest-100 text-forest-800">
                  <ScrollText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Aktivitas Administrator Terbaru
                </h3>
              </div>
              {user?.role === 'SUPER_ADMIN' && (
                <Link
                  to="/admin/audit-logs"
                  className="text-xs font-semibold text-forest-800 hover:text-emerald-700 transition-colors flex items-center gap-1"
                >
                  <span>Lihat Seluruh Log</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {!stats?.recentAudits.length ? (
              <p className="text-xs text-gray-500 py-4">Belum ada aktivitas tercatat.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentAudits.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-2 py-0.5 rounded-md bg-forest-800 text-white font-bold text-[10px]">
                        {log.action}
                      </span>
                      <p className="text-gray-700 font-medium truncate">
                        {log.user?.name || 'Sistem'} memperbarui modul{' '}
                        <strong className="text-gray-900 font-semibold">{log.resource}</strong>
                      </p>
                    </div>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDateTime(log.createdAt)}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
