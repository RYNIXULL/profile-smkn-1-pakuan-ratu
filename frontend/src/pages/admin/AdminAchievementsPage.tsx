import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { AchievementItem } from '../../types';
import { Plus, Edit, Trash2, Award, Trophy, Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';

export const AdminAchievementsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AchievementItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AchievementItem | null>(null);

  const [title, setTitle] = useState('');
  const [studentName, setStudentName] = useState('');
  const [competition, setCompetition] = useState('');
  const [level, setLevel] = useState('Kabupaten');
  const [category, setCategory] = useState('Vokasi');
  const [year, setYear] = useState(new Date().getFullYear());
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const queryClient = useQueryClient();

  const { data: achievements, isLoading } = useQuery<AchievementItem[]>({
    queryKey: ['adminAchievementsList'],
    queryFn: () => api.get('/admin/achievements'),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (editingItem) {
        return api.patch(`/admin/achievements/${editingItem.id}`, payload);
      }
      return api.post('/admin/achievements', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAchievementsList'] });
      toast.success(editingItem ? 'Prestasi diperbarui.' : 'Prestasi berhasil ditambahkan.');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan prestasi.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/achievements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAchievementsList'] });
      toast.success('Prestasi dihapus.');
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus prestasi.');
    },
  });

  const openCreate = () => {
    setEditingItem(null);
    setTitle('');
    setStudentName('');
    setCompetition('');
    setLevel('Kabupaten');
    setCategory('Vokasi');
    setYear(new Date().getFullYear());
    setDescription('');
    setPhotoUrl('');
    setModalOpen(true);
  };

  const openEdit = (item: AchievementItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setStudentName(item.studentName);
    setCompetition(item.competition);
    setLevel(item.level);
    setCategory(item.category);
    setYear(item.year);
    setDescription(item.description || '');
    setPhotoUrl(item.photoUrl || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !studentName.trim() || !competition.trim()) {
      toast.error('Mohon lengkapi data prestasi.');
      return;
    }
    saveMutation.mutate({
      title,
      studentName,
      competition,
      level,
      category,
      year: Number(year),
      description: description.trim() || null,
      photoUrl: photoUrl.trim() || null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Prestasi Siswa</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola rekam jejak juara dan penghargaan siswa.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Prestasi Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-forest-800">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            <p className="text-xs font-medium text-gray-500 mt-3">Memuat prestasi...</p>
          </div>
        ) : !achievements?.length ? (
          <div className="text-center py-16 text-gray-500 text-xs">Belum ada prestasi tercatat.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Nama Prestasi</th>
                  <th className="px-6 py-4">Siswa / Tim</th>
                  <th className="px-6 py-4">Ajang Lomba</th>
                  <th className="px-6 py-4">Tingkat & Tahun</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {achievements.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 text-emerald-700 font-semibold">{item.studentName}</td>
                    <td className="px-6 py-4 text-gray-600">{item.competition}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {item.level} • {item.year}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingItem ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Prestasi / Juara *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Juara 1 LKS Desain Grafis"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Siswa / Tim *</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Kompetisi *</label>
              <input
                type="text"
                required
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tingkat</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
              >
                <option value="Kabupaten">Kabupaten</option>
                <option value="Provinsi">Provinsi</option>
                <option value="Nasional">Nasional</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
              >
                <option value="Vokasi">Vokasi</option>
                <option value="Akademik">Akademik</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Seni">Seni</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tahun *</label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">URL Foto Prestasi</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://... atau dari Media Library"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-semibold">
              Batal
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-semibold"
            >
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus Prestasi">
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Hapus prestasi <strong className="text-gray-900">"{deleteTarget?.title}"</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-semibold">
              Batal
            </button>
            <button
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
