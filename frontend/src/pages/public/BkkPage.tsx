import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { BkkConfig } from '../../types';
import {
  Briefcase,
  Building2,
  GraduationCap,
  MapPin,
  Calendar,
  ExternalLink,
  Send,
  CheckCircle2,
  Search,
  Filter,
  Users,
  Award,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { toast } from '../../stores/toastStore';
import { SkeletonPageHeader, SkeletonNewsGrid } from '../../components/ui/Skeleton';
import { SeoHelmet } from '../../components/ui/SeoHelmet';

export const BkkPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'partners' | 'tracer'>('jobs');
  const [searchJob, setSearchJob] = useState('');
  const [selectedMajorFilter, setSelectedMajorFilter] = useState('Semua');

  // Tracer study form states
  const [fullName, setFullName] = useState('');
  const [graduationYear, setGraduationYear] = useState('2025');
  const [programMajor, setProgramMajor] = useState('Teknik Bisnis Sepeda Motor (TBSM)');
  const [currentStatus, setCurrentStatus] = useState<'Bekerja' | 'Wirausaha' | 'Kuliah' | 'Mencari Kerja'>('Bekerja');
  const [institutionName, setInstitutionName] = useState('');
  const [jobTitleOrField, setJobTitleOrField] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [tracerSubmitted, setTracerSubmitted] = useState(false);

  const { data: bkk, isLoading } = useQuery<BkkConfig>({
    queryKey: ['publicBkk'],
    queryFn: () => api.get('/public/bkk'),
  });

  const tracerMutation = useMutation({
    mutationFn: (payload: any) => api.post('/public/bkk/tracer', payload),
    onSuccess: () => {
      toast.success('Data pelacakan alumni (tracer study) berhasil tersimpan. Terima kasih atas partisipasi Anda!');
      setTracerSubmitted(true);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal mengirimkan data tracer study.');
    },
  });

  const handleSubmitTracer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !graduationYear) {
      toast.error('Mohon lengkapi nama lengkap, tahun lulus, dan nomor HP/WhatsApp.');
      return;
    }
    tracerMutation.mutate({
      fullName,
      graduationYear: Number(graduationYear),
      programMajor,
      currentStatus,
      institutionName: institutionName.trim() || undefined,
      jobTitleOrField: jobTitleOrField.trim() || undefined,
      phone,
      email: email.trim() || undefined,
      notes,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <SkeletonPageHeader />
        <SkeletonNewsGrid count={3} />
        <SkeletonNewsGrid count={3} />
      </div>
    );
  }

  const data = bkk;

  const filteredJobs = data?.jobs?.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(searchJob.toLowerCase()) ||
      j.company.toLowerCase().includes(searchJob.toLowerCase()) ||
      j.location.toLowerCase().includes(searchJob.toLowerCase());
    const matchMajor = selectedMajorFilter === 'Semua' || j.targetMajor.includes(selectedMajorFilter);
    return matchSearch && matchMajor;
  });

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      <SeoHelmet
        title="Bursa Kerja Khusus (BKK) & Mitra Industri DUDI"
        description="Pusat penyaluran kerja lulusan SMK, informasi lowongan kerja mitra industri, dan tracer study alumni SMKN 1 Pakuan Ratu."
        url="/bkk"
      />
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-forest-900 via-forest-800 to-forest-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold mb-6">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Bursa Kerja Khusus & Vokasi Link and Match</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {data?.heroTitle || 'Bursa Kerja Khusus & Kemitraan Industri'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-cream-200 leading-relaxed">
              {data?.heroSubtitle ||
                'Menghubungkan keahlian vokasi siswa dan alumni SMKN 1 Pakuan Ratu secara terarah dengan kebutuhan nyata dunia kerja.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK PENYERAPAN BKK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-white/40 shadow-sm bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-600">Mitra Industri DU/DI</span>
                <p className="text-lg font-extrabold text-gray-900">{data?.stats.totalPartners} Perusahaan</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/40 shadow-sm bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Tingkat Terserap</span>
                <p className="text-lg font-extrabold text-gray-900">{data?.stats.absorptionRate} Lulusan</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/40 shadow-sm bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Lowongan Aktif</span>
                <p className="text-lg font-extrabold text-gray-900">{data?.stats.activeVacancies} Posisi Kerja</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/40 shadow-sm bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Alumni Terlacak</span>
                <p className="text-lg font-extrabold text-gray-900">{data?.stats.trackedAlumni} Orang</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TABS NAVIGASI BKK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'jobs'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Lowongan Kerja ({data?.jobs?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('partners')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'partners'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Mitra Industri & MoU ({data?.partners?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tracer')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'tracer'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Tracer Study Alumni</span>
          </button>
        </div>

        {/* TAB 1: LOWONGAN KERJA */}
        {activeTab === 'jobs' && (
          <div className="mt-8 space-y-6">
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchJob}
                  onChange={(e) => setSearchJob(e.target.value)}
                  placeholder="Cari lowongan, posisi, atau perusahaan..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedMajorFilter}
                  onChange={(e) => setSelectedMajorFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:outline-none focus:border-forest-700"
                >
                  <option value="Semua">Semua Jurusan</option>
                  <option value="Pertanian">Agribisnis Tanaman (Pertanian)</option>
                  <option value="Peternakan">Agribisnis Ternak (Peternakan)</option>
                  <option value="DKV">Desain Komunikasi Visual (DKV)</option>
                  <option value="TBSM">Teknik Bisnis Sepeda Motor (TBSM)</option>
                  <option value="Akuntansi">Akuntansi & Keuangan (AKL)</option>
                </select>
              </div>
            </div>

            {/* Jobs List Grid */}
            {!filteredJobs?.length ? (
              <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-gray-200 text-xs text-gray-500 bg-white">
                Tidak ada lowongan kerja yang cocok dengan kata kunci pencarian.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            {job.targetMajor}
                          </span>
                          <h3 className="text-base font-bold text-gray-900 mt-2">{job.title}</h3>
                          <p className="text-xs font-semibold text-gray-600 mt-0.5">{job.company}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-gray-700 text-[10px] font-bold whitespace-nowrap">
                          {job.type}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>Batas: {job.deadline}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed pt-1">{job.requirements}</p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700">{job.salaryRange}</span>
                      <a
                        href={job.contactUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-2xs transition-all"
                      >
                        <span>Lamar Lowongan</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MITRA INDUSTRI DUDI */}
        {activeTab === 'partners' && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.partners?.map((p) => (
                <div
                  key={p.id}
                  className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-gray-100 flex items-center justify-center p-1 overflow-hidden">
                        {p.logoUrl ? (
                          <img src={p.logoUrl} alt={p.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <Building2 className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{p.name}</h4>
                        <span className="text-[11px] font-medium text-emerald-700">{p.sector}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Lingkup Kerja Sama (MoU):
                      </span>
                      <p className="text-xs text-gray-600 leading-relaxed">{p.mouScope}</p>
                    </div>
                  </div>

                  {p.websiteUrl && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <a
                        href={p.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-forest-800 hover:text-emerald-700 transition-colors"
                      >
                        <span>Kunjungi Situs Perusahaan</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TRACER STUDY ALUMNI FORM */}
        {activeTab === 'tracer' && (
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Pelacakan Alumni</span>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">Formulir Tracer Study Alumni</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Bantu almamater Anda dalam pemetaan mutu lulusan, akreditasi sekolah vokasi, dan penguatan kurikulum berbasis industri.
                </p>
              </div>

              {tracerSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-950">Data Tracer Study Berhasil Dikirim!</h4>
                  <p className="text-xs text-emerald-800">
                    Terima kasih atas kontribusi Anda sebagai alumni SMKN 1 Pakuan Ratu. Semoga sukses dalam karier dan karya Anda.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTracerSubmitted(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition-all"
                  >
                    Kirim Data Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitTracer} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Nama Lengkap Alumni *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Dedi Kurniawan"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Tahun Kelulusan *</label>
                      <select
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
                      >
                        {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((yr) => (
                          <option key={yr} value={yr}>
                            Lulusan Tahun {yr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Jurusan / Program Keahlian *</label>
                      <select
                        value={programMajor}
                        onChange={(e) => setProgramMajor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
                      >
                        <option value="Agribisnis Tanaman (Pertanian)">Agribisnis Tanaman (Pertanian)</option>
                        <option value="Agribisnis Ternak (Peternakan)">Agribisnis Ternak (Peternakan)</option>
                        <option value="Desain Komunikasi Visual (DKV)">Desain Komunikasi Visual (DKV)</option>
                        <option value="Teknik Bisnis Sepeda Motor (TBSM)">Teknik Bisnis Sepeda Motor (TBSM)</option>
                        <option value="Akuntansi & Keuangan Lembaga (AKL)">Akuntansi & Keuangan Lembaga (AKL)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Status Utama Saat Ini *</label>
                      <select
                        value={currentStatus}
                        onChange={(e) => setCurrentStatus(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700 bg-white"
                      >
                        <option value="Bekerja">Bekerja di Perusahaan / Instansi</option>
                        <option value="Wirausaha">Berwirausaha / Buka Usaha Mandiri</option>
                        <option value="Kuliah">Melanjutkan Studi di Perguruan Tinggi</option>
                        <option value="Mencari Kerja">Sedang Mencari Pekerjaan</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Nama Perusahaan / Kampus / Usaha
                      </label>
                      <input
                        type="text"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        placeholder="Contoh: PT Astra Honda Motor / Univ Lampung"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Posisi Jabatan / Program Studi</label>
                      <input
                        type="text"
                        value={jobTitleOrField}
                        onChange={(e) => setJobTitleOrField(e.target.value)}
                        placeholder="Contoh: Mekanik Bengkel / Mahasiswa Agroteknologi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Nomor WhatsApp Aktif *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Alamat Email (Opsional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Contoh: alumni@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Saran atau Kesan untuk Adik Kelas / Sekolah (Opsional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Bagikan pengalaman Anda saat belajar dan memasuki dunia kerja..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-forest-700"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={tracerMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                    >
                      {tracerMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{tracerMutation.isPending ? 'Mengirim Data...' : 'Kirim Tracer Study'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
