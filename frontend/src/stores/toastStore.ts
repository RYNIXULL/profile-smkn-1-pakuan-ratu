export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners: Set<ToastListener> = new Set();

function notify() {
  listeners.forEach((listener) => listener([...toasts]));
}

export const toast = {
  subscribe(listener: ToastListener) {
    listeners.add(listener);
    listener([...toasts]);
    return () => {
      listeners.delete(listener);
    };
  },

  show(message: string, type: ToastType = 'info', title?: string, duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const item: ToastItem = { id, message, type, title, duration };
    toasts = [...toasts, item];
    notify();

    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, duration);
    }
  },

  success(message: string, title = 'Berhasil') {
    this.show(message, 'success', title);
  },

  error(message: string, title = 'Terjadi Kesalahan') {
    this.show(message, 'error', title, 5000);
  },

  info(message: string, title = 'Informasi') {
    this.show(message, 'info', title);
  },

  warning(message: string, title = 'Peringatan') {
    this.show(message, 'warning', title);
  },

  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};
