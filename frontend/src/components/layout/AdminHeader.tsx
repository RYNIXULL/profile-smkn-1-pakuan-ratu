import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../stores/authStore';

interface AdminHeaderProps {
  setMobileOpen: (open: boolean) => void;
  pageTitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ setMobileOpen, pageTitle = 'Dashboard' }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
          aria-label="Buka navigasi admin"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
            {pageTitle}
          </h1>
          <p className="text-[11px] text-gray-500 hidden sm:block">
            Panel Kontrol Resmi SMKN 1 Pakuan Ratu
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Connection status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Server Terhubung</span>
        </div>

        {/* Quick action button */}
        <Link
          to="/admin/news/create"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah Berita</span>
        </Link>
      </div>
    </header>
  );
};
