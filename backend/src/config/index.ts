import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file at root or backend
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Fail-fast security validation: Prevent booting in production with default/insecure keys
if (isProduction) {
  const jwtSecret = process.env.JWT_SECRET;
  const cookieSecret = process.env.COOKIE_SECRET;

  if (!jwtSecret || jwtSecret.includes('dev-insecure') || jwtSecret.length < 32) {
    throw new Error(
      '[CRITICAL SECURITY ERROR] In production, JWT_SECRET must be set to a strong random key (min 32 chars) via environment variables.'
    );
  }

  if (!cookieSecret || cookieSecret.includes('dev-insecure') || cookieSecret.length < 32) {
    throw new Error(
      '[CRITICAL SECURITY ERROR] In production, COOKIE_SECRET must be set to a strong random key (min 32 chars) via environment variables.'
    );
  }
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  isProduction,
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/smkn1pakuanratu',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-insecure-jwt-secret-replace-in-production-only-key',
    expiresIn: process.env.TOKEN_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  
  cookie: {
    secret: process.env.COOKIE_SECRET || 'dev-insecure-cookie-secret-replace-key',
    name: 'smkn1_session',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  
  upload: {
    maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE || '5242880', 10), // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    uploadDir: path.resolve(__dirname, '../../uploads'),
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '200', 10),
    loginMax: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '5', 10),
  },
};
