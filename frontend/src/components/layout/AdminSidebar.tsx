import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Award,
  BookOpen,
  Users,
  Building2,
  Image as ImageIcon,
  HardDrive,
  FileText,
  SlidersHorizontal,
  Mail,
  UserCog,
  ScrollText,
  Settings,
  LogOut,
  ExternalLink,
  Bell,
  GraduationCap,
  Briefcase,
  DownloadCloud,
} from 'lucide-react';
import { useAuth } from '../../stores/authStore';

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/news', label: 'Berita & Artikel', icon: Newspaper },
    { to: '/admin/announcements', label: 'Pengumuman', icon: Bell },
    { to: '/admin/events', label: 'Agenda Kegiatan', icon: Calendar },
    { to: '/admin/achievements', label: 'Prestasi Siswa', icon: Award },
    { to: '/admin/programs', label: 'Program Keahlian', icon: BookOpen },
    { to: '/admin/teachers', label: 'Guru & GTK', icon: Users },
    { to: '/admin/facilities', label: 'Fasilitas Sekolah', icon: Building2 },
    { to: '/admin/galleries', label: 'Galeri & Album', icon: ImageIcon },
    { to: '/admin/media', label: 'Media Library', icon: HardDrive },
    { to: '/admin/pages', label: 'Halaman Statis', icon: FileText },
    { to: '/admin/homepage', label: 'Pengaturan Beranda', icon: SlidersHorizontal },
    { to: '/admin/ppdb', label: 'PPDB Online', icon: GraduationCap },
    { to: '/admin/bkk', label: 'BKK & Kemitraan', icon: Briefcase },
    { to: '/admin/downloads', label: 'Pusat Unduhan', icon: DownloadCloud },
    { to: '/admin/contacts', label: 'Pesan Masuk', icon: Mail },
  ];

  const adminOnlyItems = [
    { to: '/admin/users', label: 'Manajemen Pengguna', icon: UserCog },
    { to: '/admin/audit-logs', label: 'Audit Log Sistem', icon: ScrollText },
    { to: '/admin/settings', label: 'Pengaturan Sekolah', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-forest-900 text-cream-200 z-50 flex flex-col transition-transform duration-300 border-r border-forest-800 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo & Branding */}
        <div className="p-5 border-b border-forest-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cream-100 text-forest-900 flex items-center justify-center font-bold text-base font-serif shadow-sm">
              1
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight leading-tight">
                CMS SMKN 1
              </h2>
              <p className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase">
                Panel Manajemen Konten
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Content Group */}
          <div>
            <span className="px-3 text-[10px] font-bold text-forest-400 uppercase tracking-wider block mb-1.5">
              Kelola Konten Sekolah
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-700/80 text-white shadow-sm font-semibold'
                        : 'text-cream-300 hover:text-white hover:bg-forest-800/60'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Super Admin Group */}
          {isSuperAdmin && (
            <div className="border-t border-forest-800/80 pt-4">
              <span className="px-3 text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                Konfigurasi & Keamanan
              </span>
              <nav className="space-y-1">
                {adminOnlyItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-amber-600/80 text-white shadow-sm font-semibold'
                          : 'text-cream-300 hover:text-white hover:bg-forest-800/60'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Footer: Public Site Link & User Profile */}
        <div className="p-3 border-t border-forest-800/80 bg-forest-950/40 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs text-cream-300 hover:text-white hover:bg-forest-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lihat Website Publik</span>
            </span>
          </a>

          <div className="flex items-center justify-between p-2 rounded-xl bg-forest-800/40 border border-forest-700/40">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-emerald-400 truncate">
                {user?.roleDisplayName || user?.role || 'Staff'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-cream-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
              title="Logout dari CMS"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
