import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Terlalu banyak permintaan dari IP ini. Silakan coba beberapa saat lagi.',
    },
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: config.rateLimit.loginMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Terlalu banyak percobaan login yang gagal. Akun/IP dibatasi selama 15 menit demi keamanan.',
    },
  },
});

export const contactLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 mins
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'CONTACT_SPAM_PROTECTION',
      message: 'Terlalu banyak pengiriman pesan kontak. Silakan tunggu 30 menit.',
    },
  },
});
