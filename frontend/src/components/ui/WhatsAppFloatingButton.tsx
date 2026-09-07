import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  GraduationCap,
  Users,
  Briefcase,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface QuickOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  prefilledText: string;
}

const OFFICIAL_PHONE = '6282280001234';

const QUICK_OPTIONS: QuickOption[] = [
  {
    id: 'ppdb',
    title: 'Panitia PPDB 2026',
    subtitle: 'Syarat berkas, jalur seleksi, jadwal',
    icon: GraduationCap,
    prefilledText: 'Halo Panitia PPDB SMKN 1 Pakuan Ratu, saya ingin berkonsultasi mengenai informasi dan persyaratan pendaftaran siswa baru.',
  },
  {
    id: 'humas',
    title: 'Humas & Informasi Umum',
    subtitle: 'Layanan administrasi & informasi sekolah',
    icon: Users,
    prefilledText: 'Halo Humas SMKN 1 Pakuan Ratu, saya ingin menanyakan informasi mengenai layanan dan kegiatan sekolah.',
  },
  {
    id: 'bkk',
    title: 'Kemitraan DUDI & BKK',
    subtitle: 'Kerja sama magang & info lowongan kerja',
    icon: Briefcase,
    prefilledText: 'Halo Tim BKK SMKN 1 Pakuan Ratu, kami ingin berkonsultasi terkait peluang kerja sama industri dan penyaluran kerja lulusan.',
  },
];

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOpenWhatsApp = (text: string) => {
    const url = `https://wa.me/${OFFICIAL_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = customMessage.trim() || 'Halo Admin SMKN 1 Pakuan Ratu, saya ingin bertanya mengenai informasi sekolah.';
    handleOpenWhatsApp(text);
    setCustomMessage('');
    setIsOpen(false);
  };

  return (
    <div ref={popupRef} className="fixed bottom-6 right-6 z-40 font-sans">
      {/* Pop-up Drawer */}
      {isOpen && (
        <div className="w-80 sm:w-96 mb-3 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-2xl overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-forest-800 to-forest-900 text-white p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">WhatsApp Resmi Sekolah</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-emerald-200 font-medium">Online | Humas & PPDB</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Tutup dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-cream-200/90 mt-2.5 font-light leading-relaxed">
              Silakan pilih topik bantuan untuk terhubung langsung dengan staf representatif kami via WhatsApp.
            </p>
          </div>

          {/* Body: Quick Options */}
          <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">
              Topik Paling Sering Ditanyakan:
            </p>
            {QUICK_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleOpenWhatsApp(opt.prefilledText)}
                  className="w-full text-left p-3 rounded-xl bg-forest-50/50 hover:bg-forest-50 border border-forest-100/60 hover:border-forest-200 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-xs text-forest-700 group-hover:text-forest-900 group-hover:bg-emerald-50 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-forest-900">
                        {opt.title}
                      </h4>
                      <p className="text-[11px] text-gray-500">{opt.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-forest-700 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}

            {/* Custom Query Input */}
            <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-gray-100">
              <label htmlFor="custom-wa-msg" className="block text-[11px] font-bold text-gray-500 mb-1.5 px-1">
                Atau Tuliskan Pesan Khusus:
              </label>
              <div className="relative">
                <input
                  id="custom-wa-msg"
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Ketik pertanyaan Anda..."
                  className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-hidden focus:border-forest-600 focus:bg-white transition-all text-gray-800"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-forest-700 hover:bg-forest-800 text-white transition-colors"
                  aria-label="Kirim Pesan"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Footer badge */}
          <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Kanal Resmi SMKN 1 Pakuan Ratu
            </span>
            <span>+62 822-8000-1234</span>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-forest-800 text-white shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border border-emerald-400/30"
        aria-label="Hubungi WhatsApp Sekolah"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
        </div>
        <span className="text-xs font-bold tracking-wide hidden sm:inline">
          {isOpen ? 'Tutup Chat' : 'Chat WhatsApp'}
        </span>
      </button>
    </div>
  );
};
