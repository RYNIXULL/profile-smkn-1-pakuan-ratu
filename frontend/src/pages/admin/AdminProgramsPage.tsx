import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { ProgramItem } from '../../types';
import { Edit, BookOpen, Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';

export const AdminProgramsPage: React.FC = () => {
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const queryClient = useQueryClient();

  const { data: programs, isLoading } = useQuery<ProgramItem[]>({
    queryKey: ['adminProgramsList'],
    queryFn: () => api.get('/admin/programs'),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) => api.patch(`/admin/programs/${editingProgram?.id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProgramsList'] });
      toast.success('Informasi program keahlian berhasil diperbarui.');
      setEditingProgram(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal memperbarui program.');
    },
  });

  const openEdit = (p: ProgramItem) => {
    setEditingProgram(p);
    setName(p.name);
    setTagline(p.tagline || '');
    setShortDesc(p.shortDesc);
    setFullDesc(p.fullDesc || '');
    setImageUrl(p.imageUrl || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortDesc.trim()) {
      toast.error('Nama dan deskripsi singkat wajib diisi.');
      return;
    }
    saveMutation.mutate({
      name,
      tagline: tagline.trim() || null,
      shortDesc,
      fullDesc: fullDesc.trim() || null,
      imageUrl: imageUrl.trim() || null,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Manajemen Program Keahlian</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Perbarui informasi kurikulum, deskripsi, dan media 5 jurusan kejuruan sekolah.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
          </div>
        ) : (
          (programs || []).map((prog) => (
            <div
              key={prog.id}
              className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Slug: {prog.slug}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">{prog.name}</h3>
                {prog.tagline && (
                  <p className="text-xs text-gray-500 italic mt-0.5">{prog.tagline}</p>
                )}
                <p className="text-xs text-gray-600 line-clamp-3 mt-2 leading-relaxed font-light">
                  {prog.shortDesc}
                </p>
              </div>

              <button
                onClick={() => openEdit(prog)}
                className="w-full py-2.5 rounded-xl bg-forest-50 hover:bg-forest-800 hover:text-white text-forest-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Program Keahlian</span>
              </button>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={!!editingProgram} onClose={() => setEditingProgram(null)} title="Edit Program Keahlian">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Program Keahlian *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline / Slogan Jurusan</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">URL Gambar Utama</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Ringkasan Jurusan *</label>
            <textarea
              required
              rows={3}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Lengkap & Detail</label>
            <textarea
              rows={5}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingProgram(null)}
              className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-semibold"
            >
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
