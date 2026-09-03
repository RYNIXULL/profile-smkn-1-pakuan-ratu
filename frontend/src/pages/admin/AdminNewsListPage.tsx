import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { NewsItem, NewsStatus, Pagination } from '../../types';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Archive,
  FileEdit,
  Loader2,
} from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';

export const AdminNewsListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{
    items: NewsItem[];
    pagination: Pagination;
  }>({
    queryKey: ['adminNews', page, statusFilter, search],
    queryFn: () => {
      const q = new URLSearchParams();
      q.set('page', page.toString());
      q.set('limit', '10');
      if (statusFilter) q.set('status', statusFilter);
      if (search) q.set('search', search);
      return api.get(`/admin/news?${q.toString()}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNews'] });
      toast.success('Berita berhasil dihapus.');
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus berita.');
    },
  });

  const statusBadge = (status: NewsStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Terbit</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">Draf</span>;
      case 'REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Ditinjau</span>;
      case 'ARCHIVED':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Diarsipkan</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manajemen Berita & Artikel</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola alur publikasi warta sekolah.</p>
        </div>
        <Link
          to="/admin/news/create"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Berita Baru</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['', 'PUBLISHED', 'DRAFT', 'REVIEW', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'bg-slate-50 text-gray-600 hover:bg-slate-100'
              }`}
            >
              {st === '' ? 'Semua Status' : st === 'PUBLISHED' ? 'Terbit' : st === 'DRAFT' ? 'Draf' : st === 'REVIEW' ? 'Review' : 'Arsip'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari judul..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-forest-800">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            <p className="text-xs font-medium text-gray-500 mt-3">Memuat berita...</p>
          </div>
        ) : !data?.items.length ? (
          <div className="text-center py-16 text-gray-500 text-xs">
            Tidak ada data berita yang ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Judul & Kategori</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Penulis</th>
                  <th className="px-6 py-4">Tanggal Terbit</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">
                          {item.category?.name}
                        </span>
                        <h4 className="font-bold text-gray-900 mt-0.5 line-clamp-1">
                          {item.title}
                        </h4>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-600">
                      {item.author?.name || 'Humas'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {item.publishedAt ? formatDate(item.publishedAt) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <Link
                        to={`/berita/${item.slug}`}
                        target="_blank"
                        className="inline-flex p-1.5 rounded-lg text-gray-400 hover:text-forest-800 hover:bg-forest-50 transition-colors"
                        title="Lihat di Website Publik"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/news/${item.id}/edit`}
                        className="inline-flex p-1.5 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                        title="Edit Berita"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="inline-flex p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Berita"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal (Replaces Native Alert/Confirm) */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Konfirmasi Hapus Berita"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus artikel berita{' '}
            <strong className="text-gray-900 font-semibold">
              "{deleteTarget?.title}"
            </strong>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
