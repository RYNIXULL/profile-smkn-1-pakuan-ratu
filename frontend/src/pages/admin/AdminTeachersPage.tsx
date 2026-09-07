import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { TeacherItem } from '../../types';
import { Plus, Edit, Trash2, Users, Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';
import { ImageUploadInput } from '../../components/ui/ImageUploadInput';

export const AdminTeachersPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeacherItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeacherItem | null>(null);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [subject, setSubject] = useState('');
  const [nip, setNip] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isStaff, setIsStaff] = useState(false);

  const queryClient = useQueryClient();

  const { data: teachers, isLoading } = useQuery<TeacherItem[]>({
    queryKey: ['adminTeachersList'],
    queryFn: () => api.get('/admin/teachers'),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (editingItem) {
        return api.patch(`/admin/teachers/${editingItem.id}`, payload);
      }
      return api.post('/admin/teachers', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTeachersList'] });
      toast.success(editingItem ? 'Data guru diperbarui.' : 'Guru baru ditambahkan.');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan data.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/teachers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTeachersList'] });
      toast.success('Data guru dihapus.');
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus data.');
    },
  });

  const openCreate = () => {
    setEditingItem(null);
    setName('');
    setPosition('');
    setSubject('');
    setNip('');
    setPhotoUrl('');
    setIsStaff(false);
    setModalOpen(true);
  };

  const openEdit = (item: TeacherItem) => {
    setEditingItem(item);
    setName(item.name);
    setPosition(item.position);
    setSubject(item.subject || '');
    setNip(item.nip || '');
    setPhotoUrl(item.photoUrl || '');
    setIsStaff(item.isStaff);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim()) {
      toast.error('Nama dan jabatan wajib diisi.');
      return;
    }
    saveMutation.mutate({
      name,
      position,
      subject: subject.trim() || null,
      nip: nip.trim() || null,
      photoUrl: photoUrl.trim() || null,
      isStaff,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Guru & Tenaga Kependidikan</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola direktori dewan guru dan staf tata usaha sekolah.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Guru / Staf</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-forest-800">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            <p className="text-xs font-medium text-gray-500 mt-3">Memuat guru...</p>
          </div>
        ) : !teachers?.length ? (
          <div className="text-center py-16 text-gray-500 text-xs">Belum ada data guru.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">Jabatan</th>
                  <th className="px-6 py-4">Mata Pelajaran / Bidang</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teachers.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-emerald-700 font-semibold">{item.position}</td>
                    <td className="px-6 py-4 text-gray-600">{item.subject || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px]">
                        {item.isStaff ? 'Tenaga Kependidikan' : 'Guru'}
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

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingItem ? 'Edit Data Guru' : 'Tambah Guru / Staf'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap & Gelar *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Jabatan *</label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Contoh: Kepala Sekolah / Guru DKV"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Mata Pelajaran / Bidang</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Contoh: Desain Grafis Percetakan"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">NIP (Opsional)</label>
            <input
              type="text"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              placeholder="Contoh: 19800101 200501 1 001"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <ImageUploadInput
            label="Foto Profil Guru / Tenaga Kependidikan"
            value={photoUrl}
            onChange={setPhotoUrl}
            aspectRatio="square"
            helperText="Pilih foto profil dari komputer (format JPG, PNG, WebP maks. 5MB). Disarankan rasio pasfoto/persegi."
          />
          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isStaff}
                onChange={(e) => setIsStaff(e.target.checked)}
                className="rounded border-gray-300 text-forest-700"
              />
              <span>Merupakan Tenaga Kependidikan / Staf TU</span>
            </label>
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

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus Data Guru">
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Hapus data <strong className="text-gray-900">"{deleteTarget?.name}"</strong>?
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
