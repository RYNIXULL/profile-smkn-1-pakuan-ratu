import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Mail, Check, Trash2, Clock, Phone, Loader2 } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import { toast } from '../../stores/toastStore';
import { Modal } from '../../components/ui/Modal';

export const AdminContactsPage: React.FC = () => {
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<any[]>({
    queryKey: ['adminContactsList'],
    queryFn: () => api.get('/admin/contacts'),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/contacts/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContactsList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContactsList'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      toast.success('Pesan berhasil dihapus.');
      setDeleteTarget(null);
      if (selectedMsg?.id === deleteTarget?.id) setSelectedMsg(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus pesan.');
    },
  });

  const handleOpenMsg = (msg: any) => {
    setSelectedMsg(msg);
    if (!msg.isRead) {
      markReadMutation.mutate(msg.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Pesan Masuk & Pengaduan</h2>
        <p className="text-xs text-gray-500 mt-0.5">Daftar pertanyaan dan aspirasi dari pengunjung website sekolah.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-forest-800">
              <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            </div>
          ) : !messages?.length ? (
            <div className="text-center py-16 text-gray-500 text-xs">Belum ada pesan masuk.</div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {messages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleOpenMsg(m)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedMsg?.id === m.id
                      ? 'bg-emerald-50/70 border-l-4 border-emerald-600'
                      : !m.isRead
                      ? 'bg-slate-50 font-semibold'
                      : 'hover:bg-slate-50/50 text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className={`font-bold ${!m.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                      {m.name}
                    </span>
                    <span className="text-gray-400 text-[10px]">{formatDateTime(m.createdAt)}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 truncate">{m.subject}</h4>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail (7 cols) */}
        <div className="lg:col-span-7">
          {selectedMsg ? (
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedMsg.subject}</h3>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                    Dari: {selectedMsg.name} ({selectedMsg.email})
                  </p>
                  {selectedMsg.phone && (
                    <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {selectedMsg.phone}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setDeleteTarget(selectedMsg)}
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Hapus Pesan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-gray-100">
                  {selectedMsg.message}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Diterima pada: {formatDateTime(selectedMsg.createdAt)}</span>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center p-8 rounded-3xl bg-white border border-gray-100 text-center text-gray-400 text-xs">
              Pilih salah satu pesan dari daftar sebelah kiri untuk membaca detail.
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus Pesan">
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Hapus pesan dari <strong className="text-gray-900">"{deleteTarget?.name}"</strong>?
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
