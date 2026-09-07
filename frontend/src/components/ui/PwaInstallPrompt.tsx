import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in this session
    const isDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (isDismissed) return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setIsVisible(false);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('Pengguna menyetujui instalasi aplikasi PWA');
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="glass-card bg-white/95 backdrop-blur-2xl border border-white/80 p-4 rounded-2xl shadow-2xl flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-forest-800 flex items-center justify-center text-white flex-shrink-0 shadow-md">
          <img
            src="/icons/icon-192x192.png"
            alt="Logo SMKN 1 Pakuan Ratu"
            className="w-10 h-10 rounded-lg object-cover"
          />
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-900 tracking-tight">
              Pasang Aplikasi Sekolah
            </h4>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 p-0.5"
              aria-label="Tutup pemberitahuan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
            Pasang web ini di layar utama HP/laptop Anda untuk akses cepat dan hemat kuota.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-[11px] font-bold shadow-xs transition-all"
            >
              <Download className="w-3 h-3" />
              <span>Pasang Sekarang</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-medium transition-all"
            >
              Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
