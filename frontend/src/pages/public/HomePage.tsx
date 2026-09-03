import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import {
  NewsItem,
  EventItem,
  ProgramItem,
  AchievementItem,
  GalleryItem,
  HomepageSection,
} from '../../types';
import {
  Sprout,
  Beef,
  TrendingUp,
  Palette,
  Wrench,
  ArrowRight,
  Calendar,
  Award,
  BookOpen,
  MapPin,
  ChevronRight,
  Compass,
  CheckCircle2,
  Sparkle,
  Image as ImageIcon,
} from 'lucide-react';
import { formatDate, truncateText } from '../../lib/utils';
import { motion } from 'framer-motion';

const programIcons: Record<string, React.ReactNode> = {
  pertanian: <Sprout className="w-6 h-6 text-emerald-600" />,
  peternakan: <Beef className="w-6 h-6 text-amber-600" />,
  'akuntansi-bisnis-digital': <TrendingUp className="w-6 h-6 text-blue-600" />,
  dkv: <Palette className="w-6 h-6 text-purple-600" />,
  tbsm: <Wrench className="w-6 h-6 text-rose-600" />,
};

export const HomePage: React.FC = () => {
  // 1. Fetch Dynamic Data from REST API
  const { data: sections } = useQuery<HomepageSection[]>({
    queryKey: ['homepageSections'],
    queryFn: () => api.get('/public/homepage'),
  });

  const { data: programs } = useQuery<ProgramItem[]>({
    queryKey: ['publicPrograms'],
    queryFn: () => api.get('/public/programs'),
  });

  const { data: newsData } = useQuery<{ items: NewsItem[] }>({
    queryKey: ['publicNewsHome'],
    queryFn: () => api.get('/public/news?limit=3'),
  });

  const { data: events } = useQuery<EventItem[]>({
    queryKey: ['publicEventsHome'],
    queryFn: () => api.get('/public/events'),
  });

  const { data: achievements } = useQuery<AchievementItem[]>({
    queryKey: ['publicAchievementsHome'],
    queryFn: () => api.get('/public/achievements'),
  });

  const { data: galleries } = useQuery<GalleryItem[]>({
    queryKey: ['publicGalleriesHome'],
    queryFn: () => api.get('/public/galleries'),
  });

  // Extract Hero Section settings if available
  const heroSection = sections?.find((s) => s.sectionKey === 'hero');
  const heroData = heroSection?.content ? JSON.parse(heroSection.content) : null;

  return (
    <div className="space-y-24 pb-20">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-forest-950 text-white px-4 sm:px-6 lg:px-8 -mt-20 pt-24">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop"
            alt="Suasana Pendidikan Vokasi SMKN 1 Pakuan Ratu"
            className="w-full h-full object-cover opacity-25 scale-105 transform animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/80 to-forest-900/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-800/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Pusat Keunggulan Pendidikan Vokasi Kabupaten Way Kanan</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="editorial-title text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
          >
            {heroSection?.title || 'Tumbuh dari Akar. Melangkah ke Masa Depan.'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto text-base sm:text-lg text-cream-200/90 leading-relaxed font-light"
          >
            {heroSection?.subtitle ||
              'SMK Negeri 1 Pakuan Ratu mendidik generasi muda berdaya saing tinggi melalui lima program keahlian unggulan berstandar industri. Mengembangkan potensi agribisnis, kreativitas digital, dan teknologi daerah.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a
              href="#identitas-sekolah"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg hover:shadow-emerald-900/40 transition-all flex items-center justify-center gap-2"
            >
              <span>{heroData?.primaryCtaText || 'Jelajahi Sekolah'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/program-keahlian"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{heroData?.secondaryCtaText || '5 Program Keahlian'}</span>
              <BookOpen className="w-4 h-4 text-emerald-300" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. IDENTITAS & POSITIONING SEKOLAH */}
      {/* ------------------------------------------------------------- */}
      <section id="identitas-sekolah" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
              Identitas Sekolah
            </div>
            <h2 className="editorial-title text-3xl sm:text-4xl font-bold text-forest-900 leading-tight">
              Pendidikan Vokasi yang Mengakar pada Realitas, Bertumbuh Menjawab Masa Depan
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              SMKN 1 Pakuan Ratu didirikan di tengah kekayaan potensi agraris Way Kanan. Kami percaya bahwa kemajuan daerah bertumpu pada generasi terampil yang mampu mengolah potensi lokal dengan sentuhan teknologi modern dan pola pikir wirausaha.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Dengan konsep pembelajaran <strong>Teaching Factory (TEFA)</strong>, siswa tidak hanya belajar teori di ruang kelas, tetapi langsung mempraktikkan keahlian mereka dalam lingkungan kerja nyata yang terhubung dengan mitra industri.
            </p>
            <div className="pt-2">
              <Link
                to="/profil/visi-misi"
                className="inline-flex items-center gap-2 text-sm font-bold text-forest-800 hover:text-forest-600 transition-colors"
              >
                <span>Pelajari Visi, Misi & Sejarah Kami</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-forest-100 bg-forest-900 group">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop"
                alt="Kegiatan Belajar Mengajar SMKN 1 Pakuan Ratu"
                className="w-full h-[420px] object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/40 to-transparent p-8 flex flex-col justify-end text-white">
                <div className="glass-badge self-start px-3 py-1 rounded-full text-[11px] font-bold text-forest-900 mb-2">
                  Budaya Sekolah Vokasi
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Integritas, Keahlian Presisi, dan Siap Berkarya
                </h3>
                <p className="text-xs text-cream-200/90 leading-relaxed">
                  Menanamkan kedisiplinan kerja, etos profesional, dan kecintaan terhadap inovasi berkelanjutan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. STATISTIK SEKOLAH */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-forest-100/80 shadow-md">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-forest-100">
            <div className="pt-4 lg:pt-0">
              <p className="editorial-title text-4xl sm:text-5xl font-extrabold text-forest-900">
                750+
              </p>
              <p className="text-sm font-bold text-forest-800 mt-2">Siswa Berprestasi</p>
              <p className="text-xs text-gray-500 mt-0.5">Generasi muda vokasi tangguh</p>
            </div>
            <div className="pt-4 lg:pt-0 lg:pl-8">
              <p className="editorial-title text-4xl sm:text-5xl font-extrabold text-forest-900">
                5
              </p>
              <p className="text-sm font-bold text-forest-800 mt-2">Program Keahlian</p>
              <p className="text-xs text-gray-500 mt-0.5">Sesuai kebutuhan masa depan</p>
            </div>
            <div className="pt-4 lg:pt-0 lg:pl-8">
              <p className="editorial-title text-4xl sm:text-5xl font-extrabold text-forest-900">
                45+
              </p>
              <p className="text-sm font-bold text-forest-800 mt-2">Mitra Industri (DUDI)</p>
              <p className="text-xs text-gray-500 mt-0.5">Kemitraan magang & kerja</p>
            </div>
            <div className="pt-4 lg:pt-0 lg:pl-8">
              <p className="editorial-title text-4xl sm:text-5xl font-extrabold text-emerald-700">
                88%
              </p>
              <p className="text-sm font-bold text-forest-800 mt-2">Serapan Kerja & Usaha</p>
              <p className="text-xs text-gray-500 mt-0.5">Bekerja, Melanjutkan, Wirausaha</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. PROGRAM KEAHLIAN */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider inline-block">
              Keunggulan Vokasi
            </span>
            <h2 className="editorial-title text-3xl sm:text-4xl font-bold text-forest-900 leading-tight">
              Lima Program Keahlian Pilihan Masa Depan
            </h2>
            <p className="text-sm text-gray-600">
              Setiap program keahlian dirancang selaras dengan kurikulum industri, didukung bengkel, laboratorium, serta lahan praktik modern.
            </p>
          </div>
          <Link
            to="/program-keahlian"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest-800 hover:text-emerald-700 transition-colors"
          >
            <span>Lihat Semua Program</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(programs || []).map((prog) => (
            <Link
              key={prog.id}
              to={`/program-keahlian/${prog.slug}`}
              className="group relative rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Header Visual Image */}
              <div className="relative h-48 overflow-hidden bg-forest-900">
                <img
                  src={
                    prog.imageUrl ||
                    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop'
                  }
                  alt={prog.name}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                />
                <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-white/90 backdrop-blur-md shadow-sm">
                  {programIcons[prog.slug] || <BookOpen className="w-5 h-5 text-forest-800" />}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-forest-700 transition-colors">
                    {prog.name}
                  </h3>
                  {prog.tagline && (
                    <p className="text-xs text-emerald-700 font-medium mt-1">
                      {prog.tagline}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {prog.shortDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-forest-800 group-hover:text-emerald-600 transition-colors">
                  <span>Jelajahi Kurikulum & Fasilitas</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. STORYTELLING: FROM ROOTS TO FUTURE */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-forest-900 text-white py-20 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="px-3 py-1 rounded-full bg-forest-800 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            Perjalanan Siswa
          </span>
          <h2 className="editorial-title text-3xl sm:text-4xl font-bold tracking-tight">
            Dari Akar Menuju Masa Depan
          </h2>
          <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed font-light">
            Alur pembelajaran transformatif membimbing siswa dari pengetahuan dasar hingga siap menjadi pionir industri dan wirausahawan mandiri.
          </p>
        </div>

        {/* 5 Steps Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            { step: '01', title: 'Belajar', desc: 'Penguatan pondasi teori, karakter luhur, dan pemahaman kejuruan.' },
            { step: '02', title: 'Praktik', desc: 'Asah keterampilan nyata di bengkel, laboratorium komputer, dan lahan pertanian modern.' },
            { step: '03', title: 'Berkarya', desc: 'Menciptakan prototipe, produk bernilai jual, dan solusi kreatif.' },
            { step: '04', title: 'Berwirausaha', desc: 'Mengelola pemasaran digital, analisa pasar, dan unit Teaching Factory.' },
            { step: '05', title: 'Dunia Kerja', desc: 'Terserap di industri mitra atau merintis usaha mandiri dengan keahlian teruji.' },
          ].map((item, idx) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-forest-800/60 border border-forest-700/60 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-colors"
            >
              <div>
                <span className="editorial-title text-3xl font-bold text-emerald-400">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-white mt-2">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-cream-300/80 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. PRESTASI SISWA */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider inline-block">
              Kebanggaan Sekolah
            </span>
            <h2 className="editorial-title text-3xl sm:text-4xl font-bold text-forest-900">
              Prestasi Terkini Siswa
            </h2>
            <p className="text-sm text-gray-600">
              Capaian membanggakan dalam kompetensi kejuruan, akademik, dan kreativitas daerah.
            </p>
          </div>
          <Link
            to="/prestasi"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest-800 hover:text-amber-700 transition-colors"
          >
            <span>Lihat Seluruh Prestasi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(achievements || []).slice(0, 2).map((ach) => (
            <div
              key={ach.id}
              className="glass-card p-6 sm:p-8 rounded-2xl border border-forest-100 flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-forest-100 flex-shrink-0">
                <img
                  src={
                    ach.photoUrl ||
                    'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=400&auto=format&fit=crop'
                  }
                  alt={ach.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {ach.level} • {ach.year}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {ach.competition}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {ach.title}
                </h3>
                <p className="text-xs font-semibold text-emerald-700">
                  Oleh: {ach.studentName}
                </p>
                {ach.description && (
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {ach.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. BERITA TERBARU & AGENDA TERDEKAT */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Berita Terbaru (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-3 py-1 rounded-lg bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider inline-block mb-2">
                  Publikasi Resmi
                </span>
                <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-forest-900">
                  Kabar & Aktivitas Sekolah
                </h2>
              </div>
              <Link
                to="/berita"
                className="text-xs font-bold text-forest-800 hover:text-emerald-700 transition-colors flex items-center gap-1"
              >
                <span>Semua Berita</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-6">
              {(newsData?.items || []).map((item) => (
                <Link
                  key={item.id}
                  to={`/berita/${item.slug}`}
                  className="group p-5 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5"
                >
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-forest-100 flex-shrink-0">
                    <img
                      src={
                        item.thumbnailUrl ||
                        'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400&auto=format&fit=crop'
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold">
                          {item.category?.name || 'Vokasi'}
                        </span>
                        <span>•</span>
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-forest-700 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      Baca Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Agenda Terdekat (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider inline-block mb-2">
                  Kalender
                </span>
                <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-forest-900">
                  Agenda Sekolah
                </h2>
              </div>
              <Link
                to="/agenda"
                className="text-xs font-bold text-forest-800 hover:text-emerald-700 transition-colors"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-4">
              {(events || []).slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-start gap-4 hover:border-blue-200 transition-colors"
                >
                  <div className="p-3 rounded-xl bg-forest-50 border border-forest-100 text-forest-900 text-center flex-shrink-0 min-w-[54px]">
                    <span className="block text-lg font-bold font-serif leading-none">
                      {new Date(ev.startDate).getDate()}
                    </span>
                    <span className="block text-[10px] font-bold text-forest-600 uppercase mt-1">
                      {new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(new Date(ev.startDate))}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 leading-snug">
                      {ev.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. GALERI FOTO */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider inline-block">
              Dokumentasi
            </span>
            <h2 className="editorial-title text-3xl sm:text-4xl font-bold text-forest-900">
              Galeri Kegiatan Siswa
            </h2>
          </div>
          <Link
            to="/galeri"
            className="text-xs font-bold text-forest-800 hover:text-purple-700 transition-colors flex items-center gap-1"
          >
            <span>Buka Semua Album</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { title: 'Praktik Hidroponik Greenhouse', img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=600&auto=format&fit=crop' },
            { title: 'Studio Komputer DKV & Animasi', img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop' },
            { title: 'Bengkel Servis Sepeda Motor', img: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop' },
            { title: 'Simulasi Bank Mini Akuntansi', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-forest-900 shadow-sm"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                <p className="text-xs font-bold leading-tight">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. CTA PENERIMAAN / INFORMASI */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-forest-800 text-white p-8 sm:p-14 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <span className="px-3 py-1 rounded-full bg-forest-700 text-emerald-300 text-xs font-semibold">
              Penerimaan Siswa Baru
            </span>
            <h2 className="editorial-title text-3xl sm:text-4xl font-bold leading-tight">
              Siap Menjadi Bagian dari Generasi Vokasi Unggul SMKN 1 Pakuan Ratu?
            </h2>
            <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed font-light">
              Daftarkan diri Anda pada program keahlian yang diminati. Fasilitas praktik lengkap, bimbingan instruktur ahli, dan jejaring industri menanti Anda.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
            <Link
              to="/kontak"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-sm shadow-md transition-all text-center"
            >
              Hubungi Panitia PPDB
            </Link>
            <Link
              to="/program-keahlian"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-forest-700/80 hover:bg-forest-700 text-white font-semibold text-sm border border-forest-600 transition-all text-center"
            >
              Pilih Program Keahlian
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
