import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { BkkConfig, BkkJob, IndustryPartner, TracerStudySubmission } from '../../types';
import {
  Briefcase,
  Building2,
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  ExternalLink,
  Save,
  Loader2,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/toastStore';
import { ImageUploadInput } from '../../components/ui/ImageUploadInput';

export const AdminBkkPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'partners' | 'tracer'>('jobs');

  // Job Modal State
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<BkkJob | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLogoUrl, setJobLogoUrl] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Penuh Waktu');
  const [jobSalary, setJobSalary] = useState('UMK Way Kanan');
  const [jobMajor, setJobMajor] = useState('Semua Jurusan');
  const [jobRequirements, setJobRequirements] = useState('');
  const [jobDeadline, setJobDeadline] = useState('');
  const [jobContactUrl, setJobContactUrl] = useState('');

  // Partner Modal State
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<IndustryPartner | null>(null);
  const [partnerName, setPartnerName] = useState('');
  const [partnerSector, setPartnerSector] = useState('');
  const [partnerMou, setPartnerMou] = useState('');
  const [partnerLogoUrl, setPartnerLogoUrl] = useState('');
  const [partnerWebsite, setPartnerWebsite] = useState('');

  const queryClient = useQueryClient();

  const { data: bkkData, isLoading: loadingBkk } = useQuery<BkkConfig>({
    queryKey: ['adminBkkConfig'],
    queryFn: () => api.get('/admin/bkk'),
  });

  const { data: tracerList, isLoading: loadingTracer } = useQuery<TracerStudySubmission[]>({
    queryKey: ['adminTracerSubmissions'],
    queryFn: () => api.get('/admin/bkk/tracer'),
  });

  const saveBkkMutation = useMutation({
    mutationFn: (payload: any) => api.put('/admin/bkk', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBkkConfig'] });
      queryClient.invalidateQueries({ queryKey: ['publicBkk'] });
      toast.success('Data BKK berhasil disimpan.');
      setJobModalOpen(false);
      setPartnerModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menyimpan data BKK.');
    },
  });

  // Handle Job Save
  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bkkData) return;
    let updatedJobs = [...(bkkData.jobs || [])];
    if (editingJob) {
      updatedJobs = updatedJobs.map((j) =>
        j.id === editingJob.id
          ? {
              ...j,
              title: jobTitle,
              company: jobCompany,
              logoUrl: jobLogoUrl,
              location: jobLocation,
              type: jobType,
              salaryRange: jobSalary,
              targetMajor: jobMajor,
              requirements: jobRequirements,
              deadline: jobDeadline,
              contactUrl: jobContactUrl,
            }
          : j
      );
    } else {
      updatedJobs.push({
        id: `job-${Date.now()}`,
        title: jobTitle,
        company: jobCompany,
        logoUrl: jobLogoUrl,
        location: jobLocation,
        type: jobType,
        salaryRange: jobSalary,
        targetMajor: jobMajor,
        requirements: jobRequirements,
        deadline: jobDeadline,
        contactUrl: jobContactUrl,
        status: 'Aktif',
      });
    }

    saveBkkMutation.mutate({
      ...bkkData,
      jobs: updatedJobs,
    });
  };

  const handleDeleteJob = (id: string) => {
    if (!bkkData) return;
    if (!confirm('Hapus lowongan kerja ini?')) return;
    saveBkkMutation.mutate({
      ...bkkData,
      jobs: bkkData.jobs.filter((j) => j.id !== id),
    });
  };

  const openAddJob = () => {
    setEditingJob(null);
    setJobTitle('');
    setJobCompany('');
    setJobLogoUrl('');
    setJobLocation('');
    setJobType('Penuh Waktu');
    setJobSalary('UMK');
    setJobMajor('Semua Jurusan');
    setJobRequirements('');
    setJobDeadline('');
    setJobContactUrl('');
    setJobModalOpen(true);
  };

  const openEditJob = (j: BkkJob) => {
    setEditingJob(j);
    setJobTitle(j.title);
    setJobCompany(j.company);
    setJobLogoUrl(j.logoUrl || '');
    setJobLocation(j.location);
    setJobType(j.type);
    setJobSalary(j.salaryRange);
    setJobMajor(j.targetMajor);
    setJobRequirements(j.requirements);
    setJobDeadline(j.deadline);
    setJobContactUrl(j.contactUrl);
    setJobModalOpen(true);
  };

  // Handle Partner Save
  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bkkData) return;
    let updatedPartners = [...(bkkData.partners || [])];
    if (editingPartner) {
      updatedPartners = updatedPartners.map((p) =>
        p.id === editingPartner.id
          ? {
              ...p,
              name: partnerName,
              sector: partnerSector,
              mouScope: partnerMou,
              logoUrl: partnerLogoUrl,
              websiteUrl: partnerWebsite,
            }
          : p
      );
    } else {
      updatedPartners.push({
        id: `partner-${Date.now()}`,
        name: partnerName,
        sector: partnerSector,
        mouScope: partnerMou,
        logoUrl: partnerLogoUrl,
        websiteUrl: partnerWebsite,
      });
    }

    saveBkkMutation.mutate({
      ...bkkData,
      partners: updatedPartners,
    });
  };

  const handleDeletePartner = (id: string) => {
    if (!bkkData) return;
    if (!confirm('Hapus mitra industri ini?')) return;
    saveBkkMutation.mutate({
      ...bkkData,
      partners: bkkData.partners.filter((p) => p.id !== id),
    });
  };

  const openAddPartner = () => {
    setEditingPartner(null);
    setPartnerName('');
    setPartnerSector('');
    setPartnerMou('');
    setPartnerLogoUrl('');
    setPartnerWebsite('');
    setPartnerModalOpen(true);
  };

  const openEditPartner = (p: IndustryPartner) => {
    setEditingPartner(p);
    setPartnerName(p.name);
    setPartnerSector(p.sector);
    setPartnerMou(p.mouScope);
    setPartnerLogoUrl(p.logoUrl || '');
    setPartnerWebsite(p.websiteUrl || '');
    setPartnerModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bursa Kerja Khusus & Mitra Industri</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola informasi lowongan kerja lulusan, mitra industri DU/DI, dan rekap tracer study alumni.
          </p>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'jobs'
              ? 'bg-forest-800 text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Lowongan Kerja ({bkkData?.jobs?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('partners')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'partners'
              ? 'bg-forest-800 text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Mitra Industri DU/DI ({bkkData?.partners?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tracer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tracer'
              ? 'bg-forest-800 text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Data Tracer Alumni ({tracerList?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: LOWONGAN KERJA */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={openAddJob}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Lowongan Kerja</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            {loadingBkk ? (
              <div className="flex flex-col items-center justify-center py-20 text-forest-800">
                <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
                <p className="text-xs font-medium text-gray-500 mt-3">Memuat lowongan kerja...</p>
              </div>
            ) : !bkkData?.jobs?.length ? (
              <div className="text-center py-16 text-gray-500 text-xs">Belum ada data lowongan kerja.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-4">Posisi Lowongan</th>
                      <th className="px-6 py-4">Perusahaan</th>
                      <th className="px-6 py-4">Kualifikasi Jurusan</th>
                      <th className="px-6 py-4">Batas Akhir</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bkkData.jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{job.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{job.company}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-emerald-700 font-semibold">{job.targetMajor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{job.deadline}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                          <button
                            onClick={() => openEditJob(job)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-forest-800 hover:bg-forest-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
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
        </div>
      )}

      {/* TAB 2: MITRA INDUSTRI DU/DI */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={openAddPartner}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Mitra Industri</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            {loadingBkk ? (
              <div className="flex flex-col items-center justify-center py-20 text-forest-800">
                <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
                <p className="text-xs font-medium text-gray-500 mt-3">Memuat mitra industri...</p>
              </div>
            ) : !bkkData?.partners?.length ? (
              <div className="text-center py-16 text-gray-500 text-xs">Belum ada data mitra industri.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-4">Nama Perusahaan / Instansi</th>
                      <th className="px-6 py-4">Bidang Industri</th>
                      <th className="px-6 py-4">Lingkup Kerja Sama (MoU)</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bkkData.partners.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{p.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-emerald-700 font-semibold">{p.sector}</td>
                        <td className="px-6 py-4 text-gray-500 max-w-sm truncate">{p.mouScope}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                          <button
                            onClick={() => openEditPartner(p)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-forest-800 hover:bg-forest-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePartner(p.id)}
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
        </div>
      )}

      {/* TAB 3: TRACER STUDY ALUMNI */}
      {activeTab === 'tracer' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          {loadingTracer ? (
            <div className="flex flex-col items-center justify-center py-20 text-forest-800">
              <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
              <p className="text-xs font-medium text-gray-500 mt-3">Memuat respons tracer study...</p>
            </div>
          ) : !tracerList?.length ? (
            <div className="text-center py-20 text-gray-500 text-xs">
              Belum ada alumni yang mengisi formulir tracer study.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Nama Alumni</th>
                    <th className="px-6 py-4">Tahun Lulus</th>
                    <th className="px-6 py-4">Jurusan</th>
                    <th className="px-6 py-4">Status & Perusahaan</th>
                    <th className="px-6 py-4">No WhatsApp</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tracerList.map((t) => {
                    const cleanPhone = t.phone.replace(/[^0-9]/g, '');
                    const waLink = `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}?text=Halo%20${encodeURIComponent(t.fullName)},%20kami%20dari%20BKK%20SMKN%201%20Pakuan%20Ratu`;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{t.fullName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{t.graduationYear}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-emerald-800 font-semibold">{t.programMajor}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                            {t.currentStatus}
                          </span>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {t.institutionName} ({t.jobTitleOrField})
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600">{t.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-semibold text-[11px] transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat WA</span>
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

      {/* JOB MODAL */}
      <Modal
        isOpen={jobModalOpen}
        onClose={() => setJobModalOpen(false)}
        maxWidth="lg"
        title={editingJob ? 'Edit Lowongan Kerja BKK' : 'Tambah Lowongan Kerja BKK'}
      >
        <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Judul / Posisi Pekerjaan *</label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Contoh: Staff Mekanik AHASS"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Nama Perusahaan / DU-DI *</label>
              <input
                type="text"
                required
                value={jobCompany}
                onChange={(e) => setJobCompany(e.target.value)}
                placeholder="Contoh: PT Tunas Dwipa Matra"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Lokasi Kerja</label>
              <input
                type="text"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                placeholder="Way Kanan & Sekitarnya"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tipe Pekerjaan</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
              >
                <option value="Penuh Waktu">Penuh Waktu</option>
                <option value="Magang / Prakerin">Magang / Prakerin</option>
                <option value="Kontrak">Kontrak</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Kualifikasi Jurusan</label>
              <input
                type="text"
                value={jobMajor}
                onChange={(e) => setJobMajor(e.target.value)}
                placeholder="Contoh: TBSM / Otomotif"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Perkiraan Gaji</label>
              <input
                type="text"
                value={jobSalary}
                onChange={(e) => setJobSalary(e.target.value)}
                placeholder="UMK Lampung"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Kualifikasi / Syarat Pelamar</label>
            <textarea
              rows={3}
              value={jobRequirements}
              onChange={(e) => setJobRequirements(e.target.value)}
              placeholder="Syarat kelulusan, sertifikat keahlian, usia, dll..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Batas Akhir Pendaftaran</label>
              <input
                type="text"
                value={jobDeadline}
                onChange={(e) => setJobDeadline(e.target.value)}
                placeholder="Contoh: 30 Juni 2026"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Link Kontak / Tautan Lamar</label>
              <input
                type="text"
                value={jobContactUrl}
                onChange={(e) => setJobContactUrl(e.target.value)}
                placeholder="https://wa.me/628xxx"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setJobModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 font-semibold text-gray-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saveBkkMutation.isPending}
              className="px-4 py-2 rounded-xl bg-forest-800 text-white font-semibold"
            >
              {saveBkkMutation.isPending ? 'Menyimpan...' : 'Simpan Lowongan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* PARTNER MODAL */}
      <Modal
        isOpen={partnerModalOpen}
        onClose={() => setPartnerModalOpen(false)}
        maxWidth="lg"
        title={editingPartner ? 'Edit Mitra Industri' : 'Tambah Mitra Industri DU/DI'}
      >
        <form onSubmit={handleSavePartner} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Nama Perusahaan / Mitra *</label>
            <input
              type="text"
              required
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="Contoh: PT Great Giant Pineapple"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Sektor / Bidang Industri</label>
              <input
                type="text"
                value={partnerSector}
                onChange={(e) => setPartnerSector(e.target.value)}
                placeholder="Contoh: Agroindustri & Perkebunan"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Website Perusahaan (Opsional)</label>
              <input
                type="text"
                value={partnerWebsite}
                onChange={(e) => setPartnerWebsite(e.target.value)}
                placeholder="https://perusahaan.com"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>

          <ImageUploadInput
            label="Logo Perusahaan Mitra"
            value={partnerLogoUrl}
            onChange={setPartnerLogoUrl}
            aspectRatio="square"
            helperText="Pilih logo perusahaan mitra dari komputer (format JPG, PNG, WebP)."
          />

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Lingkup Kerja Sama (MoU)</label>
            <textarea
              rows={3}
              value={partnerMou}
              onChange={(e) => setPartnerMou(e.target.value)}
              placeholder="Contoh: Prakerin (PKL), Kelas Industri, Rekrutmen Lulusan Vokasi..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPartnerModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 font-semibold text-gray-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saveBkkMutation.isPending}
              className="px-4 py-2 rounded-xl bg-forest-800 text-white font-semibold"
            >
              {saveBkkMutation.isPending ? 'Menyimpan...' : 'Simpan Mitra'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
