import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Sprout,
  Beef,
  TrendingUp,
  Palette,
  Wrench,
  Phone,
  Award,
  Calendar,
  Image as ImageIcon,
  Building2,
  Users,
  Search,
  Newspaper,
  Megaphone,
  Briefcase,
  Download,
  GraduationCap,
  Target,
  History,
  Network,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';

type ActiveDropdown = 'profil' | 'program' | 'warta' | 'layanan' | null;

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>('profil');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close all menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleMouseEnter = (menu: ActiveDropdown) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileSection = (section: string) => {
    setMobileExpandedSection(prev => (prev === section ? null : section));
  };

  // Route active state helpers
  const isProfilActive =
    location.pathname.startsWith('/profil') ||
    location.pathname === '/guru' ||
    location.pathname === '/fasilitas';

  const isProgramActive = location.pathname.startsWith('/program-keahlian');

  const isWartaActive =
    location.pathname.startsWith('/berita') ||
    location.pathname.startsWith('/agenda') ||
    location.pathname.startsWith('/pengumuman') ||
    location.pathname.startsWith('/prestasi') ||
    location.pathname.startsWith('/galeri');

  const isLayananActive =
    location.pathname.startsWith('/bkk') ||
    location.pathname.startsWith('/unduhan') ||
    location.pathname.startsWith('/kontak');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/60 backdrop-blur-md border-b border-white/40 shadow-sm py-2.5'
          : 'bg-white/40 backdrop-blur-md border-b border-white/40 shadow-sm py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Identity with Official Crest */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-1 sm:flex-initial">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-forest-900/10 border border-white/60 p-1 flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <img
                src="/icons/icon.svg"
                alt="Logo SMKN 1 Pakuan Ratu"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] sm:text-[15px] md:text-base font-extrabold text-forest-950 tracking-tight leading-none group-hover:text-forest-700 transition-colors truncate">
                SMKN 1 PAKUAN RATU
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-forest-600 tracking-wider uppercase mt-0.5 truncate hidden sm:block">
                Kabupaten Way Kanan • Lampung
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu (Organized into 5 Core Clusters) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-forest-900">
            {/* 1. Beranda */}
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl transition-all ${
                location.pathname === '/'
                  ? 'text-forest-900 font-semibold bg-white/70 border border-white/60 shadow-2xs'
                  : 'text-forest-800 hover:text-forest-950 hover:bg-white/50'
              }`}
            >
              Beranda
            </Link>

            {/* 2. Profil Sekolah Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('profil')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl transition-all ${
                  isProfilActive || activeDropdown === 'profil'
                    ? 'text-forest-900 font-semibold bg-white/70 border border-white/60 shadow-2xs'
                    : 'text-forest-800 hover:text-forest-950 hover:bg-white/50'
                }`}
              >
                <span>Profil</span>
                <ChevronDown
                  className={`w-4 h-4 text-forest-600 transition-transform duration-200 ${
                    activeDropdown === 'profil' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'profil' && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-fade-in">
                  <div className="p-2.5 bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl">
                    <div className="px-3 py-1.5 mb-1 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-forest-700 tracking-wider uppercase">
                        Profil & Kelembagaan
                      </span>
                      <Compass className="w-3.5 h-3.5 text-forest-500" />
                    </div>
                    <div className="space-y-0.5">
                      <Link
                        to="/profil/sambutan-kepala-sekolah"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Sambutan Kepala Sekolah
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Pesan & arahan pimpinan lembaga
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/profil/visi-misi"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                          <Target className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Visi & Misi
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Arah komitmen & cita-cita pendidikan
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/profil/sejarah"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                          <History className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Sejarah Sekolah
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Perjalanan berdirinya SMKN 1 Pakuan Ratu
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/profil/struktur-organisasi"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                          <Network className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Struktur Organisasi
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Bagan tata kelola dewan pimpinan
                          </div>
                        </div>
                      </Link>

                      <div className="border-t border-gray-100 my-1" />

                      <Link
                        to="/guru"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Guru & Tenaga Pendidik
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Profil & kualifikasi dewan guru GTK
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/fasilitas"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Sarana & Fasilitas
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Gedung, bengkel, laboratorium & lahan
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Program Keahlian Dropdown (Mega Panel) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('program')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl transition-all ${
                  isProgramActive || activeDropdown === 'program'
                    ? 'text-forest-900 font-semibold bg-white/70 border border-white/60 shadow-2xs'
                    : 'text-forest-800 hover:text-forest-950 hover:bg-white/50'
                }`}
              >
                <span>Program Keahlian</span>
                <ChevronDown
                  className={`w-4 h-4 text-forest-600 transition-transform duration-200 ${
                    activeDropdown === 'program' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'program' && (
                <div className="absolute top-full left-0 w-[540px] pt-2 z-50 animate-fade-in">
                  <div className="p-3 bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl">
                    <div className="px-3 py-1.5 mb-2 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-forest-700 tracking-wider uppercase">
                        5 Jurusan Kejuruan Unggulan
                      </span>
                      <Link
                        to="/program-keahlian"
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
                      >
                        <span>Semua Jurusan</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <Link
                        to="/program-keahlian/pertanian"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200/50 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <Sprout className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-800 group-hover:text-emerald-800">
                            Pertanian (Agribisnis Tanaman)
                          </div>
                          <div className="text-[11px] text-gray-500 leading-snug mt-0.5">
                            Kultivasi modern & agroteknologi unggul
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/program-keahlian/peternakan"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200/50 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center flex-shrink-0">
                          <Beef className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-800 group-hover:text-amber-800">
                            Peternakan (Agribisnis Ternak)
                          </div>
                          <div className="text-[11px] text-gray-500 leading-snug mt-0.5">
                            Manajemen ternak & formulasi pakan
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/program-keahlian/akuntansi-bisnis-digital"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-200/50 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-800 group-hover:text-blue-800">
                            Akuntansi & Bisnis Digital
                          </div>
                          <div className="text-[11px] text-gray-500 leading-snug mt-0.5">
                            Finansial, perpajakan & platform digital
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/program-keahlian/dkv"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50/70 border border-transparent hover:border-purple-200/50 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-purple-100/80 text-purple-700 flex items-center justify-center flex-shrink-0">
                          <Palette className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-800 group-hover:text-purple-800">
                            Desain Komunikasi Visual
                          </div>
                          <div className="text-[11px] text-gray-500 leading-snug mt-0.5">
                            Multimedia, grafis, animasi & video
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/program-keahlian/tbsm"
                        className="col-span-2 flex items-start gap-3 p-2.5 rounded-xl hover:bg-rose-50/70 border border-transparent hover:border-rose-200/50 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-rose-100/80 text-rose-700 flex items-center justify-center flex-shrink-0">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-800 group-hover:text-rose-800">
                            Teknik Sepeda Motor (TBSM)
                          </div>
                          <div className="text-[11px] text-gray-500 leading-snug mt-0.5">
                            Teknologi otomotif roda dua, mekanik injeksi, dan standar bengkel resmi
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Kabar & Prestasi Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('warta')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl transition-all ${
                  isWartaActive || activeDropdown === 'warta'
                    ? 'text-forest-900 font-semibold bg-white/70 border border-white/60 shadow-2xs'
                    : 'text-forest-800 hover:text-forest-950 hover:bg-white/50'
                }`}
              >
                <span>Kabar & Prestasi</span>
                <ChevronDown
                  className={`w-4 h-4 text-forest-600 transition-transform duration-200 ${
                    activeDropdown === 'warta' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'warta' && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-fade-in">
                  <div className="p-2.5 bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl">
                    <div className="px-3 py-1.5 mb-1 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-forest-700 tracking-wider uppercase">
                        Publikasi & Dokumentasi
                      </span>
                      <Newspaper className="w-3.5 h-3.5 text-forest-500" />
                    </div>
                    <div className="space-y-0.5">
                      <Link
                        to="/berita"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                          <Newspaper className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Berita & Warta
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Kabar liputan kegiatan terkini sekolah
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/agenda"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Agenda Kegiatan
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Kalender acara & jadwal kegiatan siswa
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/pengumuman"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Pengumuman Resmi
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Surat edaran, jadwal libur & info dinas
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/prestasi"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-700 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-100 transition-colors">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Prestasi Siswa & Guru
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Capaian juara LKS, O2SN & kompetisi
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/galeri"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Galeri Dokumentasi
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Album foto kegiatan & sarana kampus
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Layanan & Mitra Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('layanan')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl transition-all ${
                  isLayananActive || activeDropdown === 'layanan'
                    ? 'text-forest-900 font-semibold bg-white/70 border border-white/60 shadow-2xs'
                    : 'text-forest-800 hover:text-forest-950 hover:bg-white/50'
                }`}
              >
                <span>Layanan & Mitra</span>
                <ChevronDown
                  className={`w-4 h-4 text-forest-600 transition-transform duration-200 ${
                    activeDropdown === 'layanan' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'layanan' && (
                <div className="absolute top-full right-0 w-80 pt-2 z-50 animate-fade-in">
                  <div className="p-2.5 bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl">
                    <div className="px-3 py-1.5 mb-1 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-forest-700 tracking-wider uppercase">
                        Kemitraan & Layanan Publik
                      </span>
                      <Briefcase className="w-3.5 h-3.5 text-forest-500" />
                    </div>
                    <div className="space-y-0.5">
                      <Link
                        to="/bkk"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Bursa Kerja Khusus (BKK)
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Mitra industri DU/DI & penyaluran kerja
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/unduhan"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                          <Download className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Pusat Unduhan Dokumen
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Arsip dokumen, silabus & formulir resmi
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/kontak"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-forest-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-100 transition-colors">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 group-hover:text-forest-900">
                            Kontak & Lokasi Kampus
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Hotline sekolah, alamat & layanan aduan
                          </div>
                        </div>
                      </Link>

                      <div className="border-t border-gray-100 my-1.5 pt-1.5 px-2">
                        <Link
                          to="/ppdb"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-forest-800 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                            <span>Pendaftaran PPDB 2026</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Action Area: Search & PPDB CTA */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Global Search Command Palette Button */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-global-search'))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 hover:bg-white text-forest-900 text-xs font-semibold border border-forest-100/80 shadow-2xs hover:shadow-xs transition-all group"
              title="Pencarian Terpadu (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-forest-700 group-hover:text-forest-900 transition-colors" />
              <span className="text-forest-800 group-hover:text-forest-950 font-medium">Cari</span>
              <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-forest-700 bg-forest-50 border border-forest-200/60 rounded">
                Ctrl K
              </kbd>
            </button>

            {/* PPDB 2026 CTA Pill */}
            <Link
              to="/ppdb"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-forest-800 hover:from-emerald-500 hover:to-forest-700 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all border border-emerald-400/30 group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
              </span>
              <span>PPDB 2026</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Right Action Area & Menu Toggle */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-global-search'))}
              className="p-2 rounded-xl bg-white/60 hover:bg-white text-forest-800 transition-colors border border-white/60 shadow-2xs flex-shrink-0"
              aria-label="Pencarian Cepat"
            >
              <Search className="w-4 h-4 text-forest-700" />
            </button>

            <Link
              to="/ppdb"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex-shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span>PPDB</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/60 hover:bg-white text-forest-900 transition-colors border border-white/60 shadow-2xs flex-shrink-0"
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Structured Accordion */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto">
            {/* Quick Search Button in Mobile Drawer */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent('open-global-search'));
              }}
              className="flex items-center justify-between w-full px-3.5 py-2.5 mb-3 rounded-xl bg-forest-50/80 border border-forest-100 text-forest-800 text-xs font-bold shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-forest-700" />
                <span>Cari Berita, Guru, Fasilitas...</span>
              </div>
              <kbd className="text-[10px] px-1.5 py-0.5 bg-white rounded border border-gray-200 text-gray-500 font-mono">
                Ctrl K
              </kbd>
            </button>

            {/* Direct Home Link */}
            <Link
              to="/"
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-colors mb-1 ${
                location.pathname === '/'
                  ? 'bg-forest-50 text-forest-900 font-bold'
                  : 'text-gray-800 hover:bg-forest-50/60'
              }`}
            >
              <span>Beranda</span>
            </Link>

            {/* Accordion Group 1: Profil */}
            <div className="border-t border-gray-100 py-1">
              <button
                type="button"
                onClick={() => toggleMobileSection('profil')}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold text-forest-800 uppercase tracking-wider"
              >
                <span>Profil Sekolah</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileExpandedSection === 'profil' ? 'rotate-180 text-forest-600' : 'text-gray-400'
                  }`}
                />
              </button>
              {mobileExpandedSection === 'profil' && (
                <div className="pl-3 pr-1 py-1 space-y-1 text-xs">
                  <Link
                    to="/profil/sambutan-kepala-sekolah"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-forest-600" />
                    <span>Sambutan Kepala Sekolah</span>
                  </Link>
                  <Link
                    to="/profil/visi-misi"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <Target className="w-3.5 h-3.5 text-forest-600" />
                    <span>Visi & Misi</span>
                  </Link>
                  <Link
                    to="/profil/sejarah"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <History className="w-3.5 h-3.5 text-forest-600" />
                    <span>Sejarah Sekolah</span>
                  </Link>
                  <Link
                    to="/profil/struktur-organisasi"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <Network className="w-3.5 h-3.5 text-forest-600" />
                    <span>Struktur Organisasi</span>
                  </Link>
                  <Link
                    to="/guru"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>Guru & Tenaga Pendidik</span>
                  </Link>
                  <Link
                    to="/fasilitas"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Sarana & Fasilitas</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Accordion Group 2: Program Keahlian */}
            <div className="border-t border-gray-100 py-1">
              <button
                type="button"
                onClick={() => toggleMobileSection('program')}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold text-forest-800 uppercase tracking-wider"
              >
                <span>5 Program Keahlian</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileExpandedSection === 'program' ? 'rotate-180 text-forest-600' : 'text-gray-400'
                  }`}
                />
              </button>
              {mobileExpandedSection === 'program' && (
                <div className="pl-3 pr-1 py-1 space-y-1 text-xs">
                  <Link
                    to="/program-keahlian/pertanian"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-emerald-50 text-gray-700"
                  >
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pertanian (Agribisnis Tanaman)</span>
                  </Link>
                  <Link
                    to="/program-keahlian/peternakan"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-amber-50 text-gray-700"
                  >
                    <Beef className="w-3.5 h-3.5 text-amber-600" />
                    <span>Peternakan (Agribisnis Ternak)</span>
                  </Link>
                  <Link
                    to="/program-keahlian/akuntansi-bisnis-digital"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-blue-50 text-gray-700"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>Akuntansi & Bisnis Digital</span>
                  </Link>
                  <Link
                    to="/program-keahlian/dkv"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-purple-50 text-gray-700"
                  >
                    <Palette className="w-3.5 h-3.5 text-purple-600" />
                    <span>Desain Komunikasi Visual (DKV)</span>
                  </Link>
                  <Link
                    to="/program-keahlian/tbsm"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-rose-50 text-gray-700"
                  >
                    <Wrench className="w-3.5 h-3.5 text-rose-600" />
                    <span>Teknik Sepeda Motor (TBSM)</span>
                  </Link>
                  <Link
                    to="/program-keahlian"
                    className="flex items-center justify-between p-2 rounded-lg bg-forest-50/60 font-semibold text-forest-800"
                  >
                    <span>Lihat Semua Program Keahlian</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Accordion Group 3: Warta & Prestasi */}
            <div className="border-t border-gray-100 py-1">
              <button
                type="button"
                onClick={() => toggleMobileSection('warta')}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold text-forest-800 uppercase tracking-wider"
              >
                <span>Kabar & Prestasi</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileExpandedSection === 'warta' ? 'rotate-180 text-forest-600' : 'text-gray-400'
                  }`}
                />
              </button>
              {mobileExpandedSection === 'warta' && (
                <div className="pl-3 pr-1 py-1 space-y-1 text-xs">
                  <Link
                    to="/berita"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <Newspaper className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Berita & Warta</span>
                  </Link>
                  <Link
                    to="/agenda"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Agenda Kegiatan</span>
                  </Link>
                  <Link
                    to="/pengumuman"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pengumuman Resmi</span>
                  </Link>
                  <Link
                    to="/prestasi"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <Award className="w-3.5 h-3.5 text-yellow-600" />
                    <span>Prestasi Siswa & Guru</span>
                  </Link>
                  <Link
                    to="/galeri"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                    <span>Galeri Dokumentasi</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Accordion Group 4: Layanan & Mitra */}
            <div className="border-t border-gray-100 py-1">
              <button
                type="button"
                onClick={() => toggleMobileSection('layanan')}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold text-forest-800 uppercase tracking-wider"
              >
                <span>Layanan & Mitra</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileExpandedSection === 'layanan' ? 'rotate-180 text-forest-600' : 'text-gray-400'
                  }`}
                />
              </button>
              {mobileExpandedSection === 'layanan' && (
                <div className="pl-3 pr-1 py-1 space-y-1 text-xs">
                  <Link
                    to="/bkk"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bursa Kerja Khusus (BKK)</span>
                  </Link>
                  <Link
                    to="/unduhan"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-600" />
                    <span>Pusat Unduhan Dokumen</span>
                  </Link>
                  <Link
                    to="/kontak"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-forest-50 text-gray-700"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>Kontak & Lokasi Kampus</span>
                  </Link>
                </div>
              )}
            </div>

            {/* PPDB & Admin Portal CTA at the bottom of drawer */}
            <div className="border-t border-gray-100 pt-3 mt-2 space-y-2">
              <Link
                to="/ppdb"
                className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-forest-800 text-white text-xs font-bold shadow-xs text-center"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span>Pendaftaran PPDB Online 2026/2027</span>
              </Link>
              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-gray-500 hover:text-forest-800 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Portal Staf / Login Admin</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
