import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { PpdbConfig, PpdbApplicant } from '../../types';
import {
  GraduationCap,
  Save,
  Users,
  Calendar,
  Phone,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';
import { toast } from '../../stores/toastStore';

export const AdminPpdbPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'applicants'>('settings');

  // Form states
  const [academicYear, setAcademicYear] = useState('2026/2027');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [announcementDate, setAnnouncementDate] = useState('');
  const [reRegistrationDate, setReRegistrationDate] = useState('');
  const [officialPortalUrl, setOfficialPortalUrl] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [totalQuota, setTotalQuota] = useState(360);

  const queryClient = useQueryClient();

  const { data: ppdbData, isLoading: loadingConfig } = useQuery<PpdbConfig>({
    queryKey: ['adminPpdbConfig'],
    queryFn: () => api.get('/admin/ppdb'),
  });

  const { data: applicants, isLoading: loadingApplicants } = useQuery<PpdbApplicant[]>({
    queryKey: ['adminPpdbApplicants'],
    queryFn: () => api.get('/admin/ppdb/applicants'),
  });

  useEffect(() => {
    if (ppdbData) {
      setAcademicYear(ppdbData.academicYear || '2026/2027');
      setTitle(ppdbData.title || '');
      setSubtitle(ppdbData.subtitle || '');
      setIsOpen(ppdbData.isOpen ?? true);
      setStartDate(ppdbData.startDate || '');
      setEndDate(ppdbData.endDate || '');
      setAnnouncementDate(ppdbData.announcementDate || '');
      setReRegistrationDate(ppdbData.reRegistrationDate || '');
      setOfficialPortalUrl(ppdbData.officialPortalUrl || '');
      setContactWhatsapp(ppdbData.contactWhatsapp || '');
      setTotalQuota(ppdbData.totalQuota || 360);
    }
  }, [ppdbData]);

  const saveMutation = useMutation({
    mutationFn: (payload: any) => api.put('/admin/ppdb', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPpdbConfig'] });
      queryClient.invalidateQueries({ queryKey: ['publicPpdb'] });
      toast.success('Pengaturan PPDB berhasil disimpan.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan pengaturan PPDB.');
    },
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ppdbData) return;
    saveMutation.mutate({
      ...ppdbData,
      academicYear,
      title,
      subtitle,
      isOpen,
      startDate,
      endDate,
      announcementDate,
      reRegistrationDate,
      officialPortalUrl,
      contactWhatsapp,
      totalQuota: Number(totalQuota),
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Manajemen PPDB Online</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Kelola informasi jadwal, kuota pendaftaran, tautan portal dinas, serta rekap calon siswa yang mendaftar konsultasi.
        </p>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-forest-800 text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Pengaturan & Linimasa PPDB</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('applicants')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'applicants'
              ? 'bg-forest-800 text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Calon Pendaftar & Konsultasi ({applicants?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: PENGATURAN PPDB */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-sm font-bold text-gray-900">Konfigurasi Jadwal & Kuota PPDB</h3>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saveMutation.isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tahun Ajaran *</label>
              <input
                type="text"
                required
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2026/2027"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Status Pendaftaran</label>
              <select
                value={isOpen ? 'OPEN' : 'CLOSED'}
                onChange={(e) => setIsOpen(e.target.value === 'OPEN')}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
              >
                <option value="OPEN">Pendaftaran Dibuka</option>
                <option value="CLOSED">Pendaftaran Ditutup</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Total Kuota Keseluruhan</label>
              <input
                type="number"
                value={totalQuota}
                onChange={(e) => setTotalQuota(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Halaman PPDB *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Subjudul / Deskripsi Singkat</label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Mulai Pendaftaran</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Contoh: 15 Juni 2026"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Akhir Pendaftaran</label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Contoh: 10 Juli 2026"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Pengumuman Hasil Seleksi</label>
              <input
                type="text"
                value={announcementDate}
                onChange={(e) => setAnnouncementDate(e.target.value)}
                placeholder="Contoh: 15 Juli 2026"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Periode Daftar Ulang</label>
              <input
                type="text"
                value={reRegistrationDate}
                onChange={(e) => setReRegistrationDate(e.target.value)}
                placeholder="Contoh: 16 - 20 Juli 2026"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tautan Resmi Portal PPDB Disdik Lampung
              </label>
              <input
                type="text"
                value={officialPortalUrl}
                onChange={(e) => setOfficialPortalUrl(e.target.value)}
                placeholder="https://lampung.siap-ppdb.com"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nomor WhatsApp Panitia PPDB (Format: 628xxx)
              </label>
              <input
                type="text"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                placeholder="Contoh: 6282280001234"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: DATA CALON SISWA DAFTAR MINAT */}
      {activeTab === 'applicants' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          {loadingApplicants ? (
            <div className="flex flex-col items-center justify-center py-20 text-forest-800">
              <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
              <p className="text-xs font-medium text-gray-500 mt-3">Memuat data pendaftar minat...</p>
            </div>
          ) : !applicants?.length ? (
            <div className="text-center py-20 text-gray-500 text-xs">
              Belum ada calon siswa yang mengisi formulir pra-pendaftaran/konsultasi PPDB.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Nama Calon Siswa</th>
                    <th className="px-6 py-4">Asal SMP / MTs</th>
                    <th className="px-6 py-4">Pilihan Jurusan</th>
                    <th className="px-6 py-4">Kontak WhatsApp</th>
                    <th className="px-6 py-4">Pertanyaan / Catatan</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applicants.map((a) => {
                    const cleanPhone = a.phone.replace(/[^0-9]/g, '');
                    const waLink = `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}?text=Halo%20${encodeURIComponent(a.name)},%20kami%20dari%20Panitia%20PPDB%20SMKN%201%20Pakuan%20Ratu`;
                    return (
                      <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{a.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{a.juniorSchool}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-emerald-800">{a.programChoice1}</div>
                          <div className="text-[11px] text-gray-400">Cadangan: {a.programChoice2}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600">{a.phone}</td>
                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{a.questions}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-semibold text-[11px] transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Hubungi WA</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
