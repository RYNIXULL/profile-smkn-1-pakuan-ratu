import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { PpdbConfig } from '../../types';
import {
  GraduationCap,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  FileText,
  HelpCircle,
  Send,
  MessageSquare,
  Sprout,
  Beef,
  Palette,
  Wrench,
  TrendingUp,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { toast } from '../../stores/toastStore';
import { SkeletonPageHeader, SkeletonNewsGrid } from '../../components/ui/Skeleton';
import { SeoHelmet } from '../../components/ui/SeoHelmet';

export const PpdbPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Form states
  const [name, setName] = useState('');
  const [juniorSchool, setJuniorSchool] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [programChoice1, setProgramChoice1] = useState('Agribisnis Tanaman (Pertanian)');
  const [programChoice2, setProgramChoice2] = useState('Desain Komunikasi Visual (DKV)');
  const [questions, setQuestions] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: ppdb, isLoading } = useQuery<PpdbConfig>({
    queryKey: ['publicPpdb'],
    queryFn: () => api.get('/public/ppdb'),
  });

  const consultMutation = useMutation({
    mutationFn: (payload: any) => api.post('/public/ppdb/consult', payload),
    onSuccess: () => {
      toast.success('Formulir pra-pendaftaran berhasil terkirim. Panitia akan segera menghubungi nomor WhatsApp Anda.');
      setSubmitted(true);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal mengirimkan formulir konsultasi.');
    },
  });

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !juniorSchool.trim() || !phone.trim() || !programChoice1) {
      toast.error('Mohon lengkapi nama, sekolah asal, no WhatsApp, dan pilihan jurusan.');
      return;
    }
    consultMutation.mutate({
      name,
      juniorSchool,
      phone,
      email: email.trim() || undefined,
      programChoice1,
      programChoice2,
      questions,
    });
  };

  const getMajorIcon = (slugOrMajor: string) => {
    const s = slugOrMajor.toLowerCase();
    if (s.includes('tanam') || s.includes('tani')) return <Sprout className="w-5 h-5 text-emerald-700" />;
    if (s.includes('ternak')) return <Beef className="w-5 h-5 text-amber-700" />;
    if (s.includes('dkv') || s.includes('desain')) return <Palette className="w-5 h-5 text-purple-700" />;
    if (s.includes('tbsm') || s.includes('motor')) return <Wrench className="w-5 h-5 text-blue-700" />;
    return <TrendingUp className="w-5 h-5 text-emerald-700" />;
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

  const data = ppdb;

  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      <SeoHelmet
        title="PPDB 2026/2027 - Penerimaan Peserta Didik Baru"
        description="Informasi resmi jadwal pendaftaran, syarat berkas, alur seleksi zonasi, afirmasi & prestasi PPDB SMKN 1 Pakuan Ratu."
        url="/ppdb"
      />
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-forest-900 via-forest-800 to-forest-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>PPDB Online Tahun Ajaran {data?.academicYear || '2026/2027'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {data?.title || 'Penerimaan Peserta Didik Baru SMKN 1 Pakuan Ratu'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-cream-200 leading-relaxed">
              {data?.subtitle ||
                'Wujudkan masa depan vokasi gemilang dengan kurikulum berbasis industri dan fasilitas berstandar DU/DI.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={data?.officialPortalUrl || 'https://lampung.siap-ppdb.com'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-xs sm:text-sm shadow-lg transition-all"
              >
                <span>Portal Resmi PPDB Disdik</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${data?.contactWhatsapp || '6282280001234'}?text=Halo%20Panitia%20PPDB%20SMKN%201%20Pakuan%20Ratu,%20saya%20ingin%20konsultasi%20pendaftaran`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-xs sm:text-sm transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Chat Panitia via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. JADWAL & LINIMASA SELEKSI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-white/40 shadow-sm bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-600">Pendaftaran</span>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                  {data?.startDate} s.d {data?.endDate}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/40 shadow-sm bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Pengumuman Hasil</span>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5">{data?.announcementDate}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/40 shadow-sm bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Daftar Ulang</span>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5">{data?.reRegistrationDate}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/40 shadow-sm bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Total Daya Tampung</span>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5">{data?.totalQuota} Siswa (10 Rombel)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DAYA TAMPUNG & KUOTA 5 JURUSAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Pilihan Kejuruan</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Daya Tampung 5 Program Keahlian
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Pilihlah program keahlian sesuai bakat dan cita-cita Anda. Setiap jurusan didukung sarana laboratorium industri mutakhir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.quotas?.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    {getMajorIcon(item.major)}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-xs">
                    {item.capacity} Kursi ({item.classes} Kelas)
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900">{item.major}</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{item.description}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>Kurikulum Merdeka SMK</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. JALUR SELEKSI & PERSYARATAN BERKAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Jalur Seleksi */}
          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Jalur Masuk</span>
              <h3 className="text-xl font-bold text-gray-900 mt-1">4 Jalur Seleksi Penerimaan</h3>
            </div>

            <div className="space-y-4">
              {data?.tracks?.map((track, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900">{track.name}</h4>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Kuota {track.percentage}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{track.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Persyaratan Dokumen */}
          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Kelengkapan Administrasi</span>
              <h3 className="text-xl font-bold text-gray-900 mt-1">Syarat Dokumen Pendaftaran</h3>
            </div>

            <div className="space-y-3">
              {data?.requirements?.map((req, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{req}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-xs text-emerald-900 space-y-1">
              <p className="font-bold">Bebas Biaya (100% Gratis):</p>
              <p className="text-[11px] leading-relaxed">
                Seluruh tahapan pendaftaran di SMKN 1 Pakuan Ratu tidak dipungut biaya pendaftaran apapun. Waspadai segala bentuk pungutan liar!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 4 LANGKAH PENDAFTARAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Alur Pendaftaran</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Tahapan Langkah PPDB</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data?.steps?.map((step) => (
            <div key={step.step} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs relative">
              <span className="text-4xl font-extrabold text-emerald-100 absolute top-4 right-4">0{step.step}</span>
              <div className="relative z-10 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-forest-800 text-white font-bold text-xs flex items-center justify-center">
                  {step.step}
                </div>
                <h4 className="text-sm font-bold text-gray-900 pt-1">{step.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FORMULIR PRA-PENDAFTARAN & KONSULTASI JURUSAN */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-forest-900 to-forest-800 text-white shadow-xl space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Pra-Pendaftaran & Konsultasi</span>
            <h3 className="text-2xl sm:text-3xl font-bold mt-1">
              Berminat Bergabung dengan SMKN 1 Pakuan Ratu?
            </h3>
            <p className="text-xs sm:text-sm text-cream-200 mt-2 leading-relaxed">
              Isi data diri Anda di bawah ini untuk mendapatkan panduan langsung dari panitia PPDB melalui WhatsApp dan bantuan verifikasi berkas.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Terima Kasih, Data Anda Telah Diterima!</h4>
              <p className="text-xs text-cream-200">
                Panitia PPDB SMKN 1 Pakuan Ratu akan segera menghubungi nomor WhatsApp Anda untuk konfirmasi jadwal dan asistensi pendaftaran.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-semibold text-white transition-all"
              >
                Kirim Formulir Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitConsultation} className="space-y-4 text-gray-900">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Rian Pratama"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">Asal Sekolah SMP / MTs *</label>
                  <input
                    type="text"
                    required
                    value={juniorSchool}
                    onChange={(e) => setJuniorSchool(e.target.value)}
                    placeholder="Contoh: SMP Negeri 1 Pakuan Ratu"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">Nomor WhatsApp Aktif *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">Alamat Email (Opsional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: nama@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">Pilihan Jurusan 1 (Prioritas) *</label>
                  <select
                    value={programChoice1}
                    onChange={(e) => setProgramChoice1(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="Agribisnis Tanaman (Pertanian)">Agribisnis Tanaman (Pertanian)</option>
                    <option value="Agribisnis Ternak (Peternakan)">Agribisnis Ternak (Peternakan)</option>
                    <option value="Desain Komunikasi Visual (DKV)">Desain Komunikasi Visual (DKV)</option>
                    <option value="Teknik Bisnis Sepeda Motor (TBSM)">Teknik Bisnis Sepeda Motor (TBSM)</option>
                    <option value="Akuntansi & Keuangan Lembaga (AKL)">Akuntansi & Keuangan Lembaga (AKL)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">Pilihan Jurusan 2 (Cadangan)</label>
                  <select
                    value={programChoice2}
                    onChange={(e) => setProgramChoice2(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="Desain Komunikasi Visual (DKV)">Desain Komunikasi Visual (DKV)</option>
                    <option value="Agribisnis Tanaman (Pertanian)">Agribisnis Tanaman (Pertanian)</option>
                    <option value="Agribisnis Ternak (Peternakan)">Agribisnis Ternak (Peternakan)</option>
                    <option value="Teknik Bisnis Sepeda Motor (TBSM)">Teknik Bisnis Sepeda Motor (TBSM)</option>
                    <option value="Akuntansi & Keuangan Lembaga (AKL)">Akuntansi & Keuangan Lembaga (AKL)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Pertanyaan Seputar Pendaftaran (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  placeholder="Tanyakan hal yang ingin Anda ketahui seputar pendaftaran, asrama, seragam, dll..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={consultMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {consultMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{consultMutation.isPending ? 'Mengirim Data...' : 'Kirim Formulir Konsultasi'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Tanya Jawab</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Pertanyaan Seputar PPDB</h2>
        </div>

        <div className="space-y-3">
          {data?.faq?.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-50 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
