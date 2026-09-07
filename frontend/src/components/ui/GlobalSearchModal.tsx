import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  Search,
  X,
  Newspaper,
  Calendar,
  Bell,
  Users,
  BookOpen,
  Building2,
  CornerDownLeft,
  ArrowRight,
  SearchX,
  Loader2,
  Compass,
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  type: 'news' | 'event' | 'announcement' | 'teacher' | 'program' | 'facility';
  typeLabel: string;
  title: string;
  subtitle?: string | null;
  url: string;
  imageUrl?: string | null;
  date?: string | null;
}

const QUICK_DIRECTORIES = [
  { label: 'Informasi PPDB 2026', url: '/ppdb', category: 'PPDB', icon: BookOpen },
  { label: 'Berita Terkini', url: '/berita', category: 'Informasi', icon: Newspaper },
  { label: 'Agenda & Kegiatan', url: '/agenda', category: 'Akademik', icon: Calendar },
  { label: 'Direktori Guru & Tenaga Pendidik', url: '/guru', category: 'SDM', icon: Users },
  { label: 'Program Keahlian Vokasi', url: '/program-keahlian', category: 'Jurusan', icon: Compass },
  { label: 'Sarana & Fasilitas Kampus', url: '/fasilitas', category: 'Fasilitas', icon: Building2 },
  { label: 'BKK & Mitra Industri', url: '/bkk', category: 'Karier', icon: ArrowRight },
  { label: 'Pusat Unduhan Dokumen', url: '/unduhan', category: 'Dokumen', icon: Bell },
];

export const GlobalSearchModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Global Keydown Listener (Ctrl+K, Cmd+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-global-search', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-global-search', handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced Search API fetch
  const executeSearch = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.get<SearchResultItem[]>(`/public/search?q=${encodeURIComponent(keyword.trim())}`);
      setResults(res || []);
      setSelectedIndex(0);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        executeSearch(query);
      } else {
        setResults([]);
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, executeSearch]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    navigate(url);
  };

  // Keyboard navigation inside list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (!query.trim() && QUICK_DIRECTORIES.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % QUICK_DIRECTORIES.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (!query.trim() && QUICK_DIRECTORIES.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + QUICK_DIRECTORIES.length) % QUICK_DIRECTORIES.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex].url);
      } else if (!query.trim() && QUICK_DIRECTORIES[selectedIndex]) {
        handleSelect(QUICK_DIRECTORIES[selectedIndex].url);
      }
    }
  };

  const getTypeIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'news':
        return Newspaper;
      case 'event':
        return Calendar;
      case 'announcement':
        return Bell;
      case 'teacher':
        return Users;
      case 'program':
        return BookOpen;
      case 'facility':
        return Building2;
      default:
        return Search;
    }
  };

  const getTypeBadgeStyle = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'news':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'event':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'announcement':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'teacher':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'program':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'facility':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-forest-950/40 backdrop-blur-md transition-opacity animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all transform animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-gray-100/80">
          <Search className="w-5 h-5 text-forest-700 flex-shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Cari berita, agenda, guru, jurusan, pengumuman..."
            className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden font-medium"
          />
          {isLoading && (
            <Loader2 className="w-4 h-4 text-forest-600 animate-spin flex-shrink-0 mr-2" />
          )}
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors mr-2"
              aria-label="Hapus kata kunci"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-gray-500 bg-gray-100 border border-gray-200 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Search Content Body */}
        <div ref={resultsContainerRef} className="overflow-y-auto p-3 space-y-1 divide-y divide-gray-50 flex-grow">
          {/* 1. Results state */}
          {query.trim() !== '' && results.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Hasil Pencarian</span>
                <span>{results.length} ditemukan</span>
              </div>
              {results.map((item, index) => {
                const Icon = getTypeIcon(item.type);
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.url)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`px-3 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 group ${
                      isSelected
                        ? 'bg-forest-50/80 border border-forest-100 text-forest-950'
                        : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl flex-shrink-0 border ${getTypeBadgeStyle(
                          item.type
                        )}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate group-hover:text-forest-800">
                            {item.title}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border flex-shrink-0 ${getTypeBadgeStyle(
                              item.type
                            )}`}
                          >
                            {item.typeLabel}
                          </span>
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <CornerDownLeft
                      className={`w-4 h-4 text-forest-600 flex-shrink-0 transition-opacity ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. Empty state when searching but no results */}
          {query.trim() !== '' && results.length === 0 && !isLoading && (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <SearchX className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">
                Tidak ditemukan hasil untuk "{query}"
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                Coba gunakan kata kunci lain seperti nama jurusan (DKV, Pertanian), nama guru, jadwal, atau PPDB.
              </p>
            </div>
          )}

          {/* 3. Default state when query is empty: Quick directories */}
          {query.trim() === '' && (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Akses Cepat & Halaman Utama
              </div>
              {QUICK_DIRECTORIES.map((dir, index) => {
                const Icon = dir.icon;
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={dir.url}
                    onClick={() => handleSelect(dir.url)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`px-3 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 group ${
                      isSelected
                        ? 'bg-forest-50/80 border border-forest-100 text-forest-950'
                        : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-forest-50 text-forest-700 border border-forest-100/60 group-hover:bg-forest-100">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold group-hover:text-forest-800">
                          {dir.label}
                        </p>
                        <p className="text-[11px] text-gray-400">{dir.category}</p>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 text-forest-600 flex-shrink-0 transition-all ${
                        isSelected
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="px-4 py-2.5 bg-gray-50/90 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↓</kbd>
              <span>Navigasi</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↵</kbd>
              <span>Pilih</span>
            </span>
          </div>
          <span className="text-gray-400">SMKN 1 Pakuan Ratu</span>
        </div>
      </div>
    </div>
  );
};
