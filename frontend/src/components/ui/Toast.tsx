import React, { useEffect, useState } from 'react';
import { toast, ToastItem, ToastType } from '../../stores/toastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
  info: <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />,
};

const borderMap: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-50/80',
  error: 'border-rose-500/30 bg-rose-50/80',
  warning: 'border-amber-500/30 bg-amber-50/80',
  info: 'border-sky-500/30 bg-sky-50/80',
};

export const ToastContainer: React.FC = () => {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setItems);
    return () => unsubscribe();
  }, []);

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${borderMap[item.type]} bg-white/90 text-gray-800`}
          >
            {iconMap[item.type]}
            <div className="flex-1 min-w-0">
              {item.title && (
                <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                  {item.title}
                </h4>
              )}
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                {item.message}
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(item.id)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
