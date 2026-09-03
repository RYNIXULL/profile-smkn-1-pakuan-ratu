import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { User } from '../../types';
import { Plus, Edit, Trash2, Shield, UserCheck, UserX, Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';
import { formatDateTime } from '../../lib/utils';

export const AdminUsersPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isActive, setIsActive] = useState(true);

  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['adminUsersList'],
    queryFn: () => api.get('/admin/users'),
  });

  const { data: roles } = useQuery<Array<{ id: string; name: string; displayName: string }>>({
    queryKey: ['adminRolesList'],
    queryFn: () => api.get('/admin/roles'),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (editingUser) {
        return api.patch(`/admin/users/${editingUser.id}`, payload);
      }
      return api.post('/admin/users', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });
      toast.success(editingUser ? 'Pengguna diperbarui.' : 'Pengguna baru berhasil didaftarkan.');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan pengguna.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });
      toast.success('Pengguna berhasil dihapus.');
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus pengguna.');
    },
  });

  const openCreate = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setRoleId(roles?.[0]?.id || '');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPassword('');
    setRoleId((u.role as any)?.id || '');
    setIsActive(u.isActive ?? true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Nama dan email wajib diisi.');
      return;
    }
    if (!editingUser && !password.trim()) {
      toast.error('Password wajib diisi untuk pengguna baru.');
      return;
    }

    const payload: any = { name, email, isActive };
    if (roleId) payload.roleId = roleId;
    if (password.trim()) payload.password = password.trim();

    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manajemen Pengguna & Hak Akses</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola akun staf, administrator, dan izin akses sistem CMS.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-forest-800">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            <p className="text-xs font-medium text-gray-500 mt-3">Memuat pengguna...</p>
          </div>
        ) : !users?.length ? (
          <div className="text-center py-16 text-gray-500 text-xs">Belum ada pengguna tercatat.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Nama & Email</th>
                  <th className="px-6 py-4">Role Akses</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Login Terakhir</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900 leading-snug">{u.name}</p>
                        <p className="text-[11px] text-gray-500">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {(u.role as any)?.displayName || u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.isActive ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                          <UserCheck className="w-3.5 h-3.5" /> Aktif
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-500 font-semibold text-xs">
                          <UserX className="w-3.5 h-3.5" /> Dinonaktifkan
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {u.lastLoginAt ? formatDateTime(u.lastLoginAt) : 'Belum pernah'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
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

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {editingUser ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password Awal *'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Role Akses</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
            >
              {(roles || []).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.displayName} ({r.name})
                </option>
              ))}
            </select>
          </div>
          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 text-forest-700"
              />
              <span>Akun Aktif (Dapat Login)</span>
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

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus Pengguna">
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Hapus akun <strong className="text-gray-900">"{deleteTarget?.name}" ({deleteTarget?.email})</strong>?
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
