import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Youtube,
  Facebook,
  ArrowRight,
  Shield,
  Sprout,
  Beef,
  TrendingUp,
  Palette,
  Wrench,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-900 text-cream-200 pt-16 pb-12 border-t border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-forest-800/80">
          {/* Col 1: Identity & Motto */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cream-100 text-forest-900 flex items-center justify-center font-bold text-lg font-serif">
                1
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight leading-none">
                  SMKN 1 PAKUAN RATU
                </h3>
                <p className="text-[11px] text-emerald-400 font-medium tracking-wider uppercase mt-1">
                  Vokasi Unggul Daerah
                </p>
              </div>
            </div>
            <p className="text-xs text-cream-300/80 leading-relaxed">
              "Berakar pada Potensi, Tumbuh Menuju Masa Depan." Mengembangkan kompetensi nyata, karakter disiplin, kreativitas digital, dan kesiapan kerja lulusan di Kabupaten Way Kanan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-forest-800 hover:bg-forest-700 flex items-center justify-center text-cream-200 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-forest-800 hover:bg-forest-700 flex items-center justify-center text-cream-200 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-forest-800 hover:bg-forest-700 flex items-center justify-center text-cream-200 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Program Keahlian */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-serif">
              5 Program Keahlian
            </h4>
            <ul className="space-y-2.5 text-xs text-cream-300/80">
              <li>
                <Link to="/program-keahlian/pertanian" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Agribisnis Tanaman (Pertanian)</span>
                </Link>
              </li>
              <li>
                <Link to="/program-keahlian/peternakan" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Beef className="w-3.5 h-3.5 text-amber-400" />
                  <span>Agribisnis Ternak (Peternakan)</span>
                </Link>
              </li>
              <li>
                <Link to="/program-keahlian/akuntansi-bisnis-digital" className="flex items-center gap-2 hover:text-white transition-colors">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  <span>Akuntansi & Bisnis Digital</span>
                </Link>
              </li>
              <li>
                <Link to="/program-keahlian/dkv" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  <span>Desain Komunikasi Visual (DKV)</span>
                </Link>
              </li>
              <li>
                <Link to="/program-keahlian/tbsm" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Wrench className="w-3.5 h-3.5 text-rose-400" />
                  <span>Teknik Sepeda Motor (TBSM)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-serif">
              Akses Cepat
            </h4>
            <ul className="space-y-2 text-xs text-cream-300/80">
              <li>
                <Link to="/profil/sambutan-kepala-sekolah" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-forest-500" /> Sambutan Kepala Sekolah
                </Link>
              </li>
              <li>
                <Link to="/profil/visi-misi" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-forest-500" /> Visi dan Misi
                </Link>
              </li>
              <li>
                <Link to="/berita" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-forest-500" /> Berita Terkini
                </Link>
              </li>
              <li>
                <Link to="/agenda" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-forest-500" /> Agenda Sekolah
                </Link>
              </li>
              <li>
                <Link to="/prestasi" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-forest-500" /> Prestasi Siswa
                </Link>
              </li>
              <li>
                <Link to="/ppdb" className="hover:text-emerald-400 font-bold text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> PPDB Online 2026/2027
                </Link>
              </li>
              <li>
                <Link to="/bkk" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-forest-500" /> BKK & Mitra Industri
                </Link>
              </li>
              <li>
                <Link to="/unduhan" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-forest-500" /> Pusat Unduhan Dokumen
                </Link>
              </li>
              <li>
                <Link to="/galeri" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-forest-500" /> Galeri Foto & Dokumentasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-3 text-xs text-cream-300/80">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-serif">
              Kontak Sekolah
            </h4>
            <p className="flex items-start gap-2.5 leading-relaxed">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Jl. Raya Pakuan Ratu, Kec. Pakuan Ratu, Kab. Way Kanan, Lampung 34762</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>(0723) 567890</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>info@smkn1pakuanratu.sch.id</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Senin - Jumat: 07.15 - 15.45 WIB</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400/60">
          <p>
            © {new Date().getFullYear()} SMK Negeri 1 Pakuan Ratu. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cream-300/70">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Portal Resmi Terverifikasi
            </span>
            <Link to="/admin/login" className="hover:text-cream-200 transition-colors">
              Login Pengelola
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
