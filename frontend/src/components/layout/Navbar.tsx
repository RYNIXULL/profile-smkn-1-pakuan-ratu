import React, { useState, useEffect } from 'react';
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
  BookOpen,
  Award,
  Calendar,
  Image as ImageIcon,
  Building2,
  Users,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profilDropdown, setProfilDropdown] = useState(false);
  const [programDropdown, setProgramDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfilDropdown(false);
    setProgramDropdown(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/60 backdrop-blur-md border-b border-white/40 shadow-sm py-3'
          : 'bg-white/40 backdrop-blur-md border-b border-white/40 shadow-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-forest-800 text-cream-100 flex items-center justify-center font-bold text-lg shadow-md group-hover:bg-forest-900 transition-colors">
              <span className="font-serif">1</span>
            </div>
            <div>
              <span className="block text-base font-extrabold text-forest-900 tracking-tight leading-none group-hover:text-forest-700 transition-colors">
                SMKN 1 PAKUAN RATU
              </span>
              <span className="block text-[11px] font-medium text-forest-600 tracking-wider uppercase mt-1">
                Kabupaten Way Kanan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-forest-900">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors hover:text-forest-600 hover:bg-forest-50/50 ${
                location.pathname === '/' ? 'text-forest-800 font-semibold bg-white/50' : ''
              }`}
            >
              Beranda
            </Link>

            {/* Profil Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProfilDropdown(true)}
              onMouseLeave={() => setProfilDropdown(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:text-forest-600 hover:bg-forest-50/50 ${
                  location.pathname.startsWith('/profil') ? 'text-forest-800 font-semibold bg-white/50' : ''
                }`}
              >
                <span>Profil</span>
                <ChevronDown className="w-4 h-4 text-forest-600" />
              </button>

              {profilDropdown && (
                <div className="absolute top-full left-0 w-60 py-2 mt-1 bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-xl animate-fade-in z-50">
                  <Link
                    to="/profil/sambutan-kepala-sekolah"
                    className="block px-4 py-2 hover:bg-forest-50 text-gray-700 hover:text-forest-800 text-xs font-medium"
                  >
                    Sambutan Kepala Sekolah
                  </Link>
                  <Link
                    to="/profil/sejarah"
                    className="block px-4 py-2 hover:bg-forest-50 text-gray-700 hover:text-forest-800 text-xs font-medium"
                  >
                    Sejarah Sekolah
                  </Link>
                  <Link
                    to="/profil/visi-misi"
                    className="block px-4 py-2 hover:bg-forest-50 text-gray-700 hover:text-forest-800 text-xs font-medium"
                  >
                    Visi & Misi
                  </Link>
                  <Link
                    to="/profil/struktur-organisasi"
                    className="block px-4 py-2 hover:bg-forest-50 text-gray-700 hover:text-forest-800 text-xs font-medium"
                  >
                    Struktur Organisasi
                  </Link>
                </div>
              )}
            </div>

            {/* Program Keahlian Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProgramDropdown(true)}
              onMouseLeave={() => setProgramDropdown(false)}
            >
              <Link
                to="/program-keahlian"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:text-forest-600 hover:bg-forest-50/50 ${
                  location.pathname.startsWith('/program-keahlian') ? 'text-forest-800 font-semibold bg-white/50' : ''
                }`}
              >
                <span>Program Keahlian</span>
                <ChevronDown className="w-4 h-4 text-forest-600" />
              </Link>

              {programDropdown && (
                <div className="absolute top-full left-0 w-72 py-2 mt-1 bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-xl animate-fade-in z-50">
                  <Link
                    to="/program-keahlian/pertanian"
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 text-xs font-medium"
                  >
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    <span>Pertanian (Agribisnis Tanaman)</span>
                  </Link>
                  <Link
                    to="/program-keahlian/peternakan"
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-amber-50 text-gray-700 hover:text-amber-800 text-xs font-medium"
                  >
                    <Beef className="w-4 h-4 text-amber-600" />
                    <span>Peternakan (Agribisnis Ternak)</span>
                  </Link>
                  <Link
                    to="/program-keahlian/akuntansi-bisnis-digital"
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-blue-50 text-gray-700 hover:text-blue-800 text-xs font-medium"
                  >
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>Akuntansi & Bisnis Digital</span>
                  </Link>
                  <Link
                    to="/program-keahlian/dkv"
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-purple-50 text-gray-700 hover:text-purple-800 text-xs font-medium"
                  >
                    <Palette className="w-4 h-4 text-purple-600" />
                    <span>Desain Komunikasi Visual (DKV)</span>
                  </Link>
                  <Link
                    to="/program-keahlian/tbsm"
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-rose-50 text-gray-700 hover:text-rose-800 text-xs font-medium"
                  >
                    <Wrench className="w-4 h-4 text-rose-600" />
                    <span>Teknik Sepeda Motor (TBSM)</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/berita"
              className={`px-3 py-2 rounded-lg transition-colors hover:text-forest-600 hover:bg-forest-50/50 ${
                location.pathname.startsWith('/berita') ? 'text-forest-800 font-semibold bg-white/50' : ''
              }`}
            >
              Berita
            </Link>

            <Link
              to="/agenda"
              className={`px-3 py-2 rounded-lg transition-colors hover:text-forest-600 hover:bg-forest-50/50 ${
                location.pathname.startsWith('/agenda') ? 'text-forest-800 font-semibold bg-white/50' : ''
              }`}
            >
              Agenda
            </Link>

            <Link
              to="/prestasi"
              className={`px-3 py-2 rounded-lg transition-colors hover:text-forest-600 hover:bg-forest-50/50 ${
                location.pathname.startsWith('/prestasi') ? 'text-forest-800 font-semibold bg-white/50' : ''
              }`}
            >
              Prestasi
            </Link>

            <Link
              to="/galeri"
              className={`px-3 py-2 rounded-lg transition-colors hover:text-forest-600 hover:bg-forest-50/50 ${
                location.pathname.startsWith('/galeri') ? 'text-forest-800 font-semibold bg-white/50' : ''
              }`}
            >
              Galeri
            </Link>

            <Link
              to="/guru"
              className={`px-3 py-2 rounded-lg transition-colors hover:text-forest-600 hover:bg-forest-50/50 ${
                location.pathname === '/guru' ? 'text-forest-800 font-semibold bg-white/50' : ''
              }`}
            >
              Guru
            </Link>

            <Link
              to="/fasilitas"
              className={`px-3 py-2 rounded-lg transition-colors hover:text-forest-600 hover:bg-forest-50/50 ${
                location.pathname === '/fasilitas' ? 'text-forest-800 font-semibold bg-white/50' : ''
              }`}
            >
              Fasilitas
            </Link>

            <Link
              to="/kontak"
              className={`px-3 py-2 rounded-lg transition-colors hover:text-forest-600 hover:bg-forest-50/50 ${
                location.pathname === '/kontak' ? 'text-forest-800 font-semibold bg-white/50' : ''
              }`}
            >
              Kontak
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/60 hover:bg-white text-forest-800 transition-colors border border-white/60"
              aria-label="Menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl animate-slide-up">
            <div className="flex flex-col gap-1 text-sm font-medium text-gray-800">
              <Link to="/" className="px-3 py-2 rounded-lg hover:bg-forest-50">
                Beranda
              </Link>
              <div className="border-t border-gray-100 my-1 pt-1">
                <span className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Profil Sekolah
                </span>
                <Link to="/profil/sambutan-kepala-sekolah" className="block px-3 py-1.5 hover:bg-forest-50 text-xs">
                  Sambutan Kepala Sekolah
                </Link>
                <Link to="/profil/sejarah" className="block px-3 py-1.5 hover:bg-forest-50 text-xs">
                  Sejarah Sekolah
                </Link>
                <Link to="/profil/visi-misi" className="block px-3 py-1.5 hover:bg-forest-50 text-xs">
                  Visi & Misi
                </Link>
                <Link to="/profil/struktur-organisasi" className="block px-3 py-1.5 hover:bg-forest-50 text-xs">
                  Struktur Organisasi
                </Link>
              </div>

              <div className="border-t border-gray-100 my-1 pt-1">
                <span className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  5 Program Keahlian
                </span>
                <Link to="/program-keahlian/pertanian" className="flex items-center gap-2 px-3 py-1.5 hover:bg-forest-50 text-xs">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Pertanian
                </Link>
                <Link to="/program-keahlian/peternakan" className="flex items-center gap-2 px-3 py-1.5 hover:bg-forest-50 text-xs">
                  <Beef className="w-3.5 h-3.5 text-amber-600" /> Peternakan
                </Link>
                <Link to="/program-keahlian/akuntansi-bisnis-digital" className="flex items-center gap-2 px-3 py-1.5 hover:bg-forest-50 text-xs">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> Akuntansi & Bisnis Digital
                </Link>
                <Link to="/program-keahlian/dkv" className="flex items-center gap-2 px-3 py-1.5 hover:bg-forest-50 text-xs">
                  <Palette className="w-3.5 h-3.5 text-purple-600" /> DKV
                </Link>
                <Link to="/program-keahlian/tbsm" className="flex items-center gap-2 px-3 py-1.5 hover:bg-forest-50 text-xs">
                  <Wrench className="w-3.5 h-3.5 text-rose-600" /> TBSM Otomotif
                </Link>
              </div>

              <div className="border-t border-gray-100 my-1 pt-1 grid grid-cols-2 gap-1 text-xs">
                <Link to="/berita" className="px-3 py-2 hover:bg-forest-50 rounded-lg">
                  Berita
                </Link>
                <Link to="/agenda" className="px-3 py-2 hover:bg-forest-50 rounded-lg">
                  Agenda
                </Link>
                <Link to="/prestasi" className="px-3 py-2 hover:bg-forest-50 rounded-lg">
                  Prestasi
                </Link>
                <Link to="/galeri" className="px-3 py-2 hover:bg-forest-50 rounded-lg">
                  Galeri
                </Link>
                <Link to="/guru" className="px-3 py-2 hover:bg-forest-50 rounded-lg">
                  Guru & GTK
                </Link>
                <Link to="/fasilitas" className="px-3 py-2 hover:bg-forest-50 rounded-lg">
                  Fasilitas
                </Link>
                <Link to="/kontak" className="px-3 py-2 hover:bg-forest-50 rounded-lg col-span-2">
                  Kontak & Lokasi
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
