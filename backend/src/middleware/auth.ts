import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { apiError } from '../utils/response';
import { config } from '../config';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  let token: string | undefined;

  // 1. Check HTTP-only cookie first
  if (req.cookies && req.cookies[config.cookie.name]) {
    token = req.cookies[config.cookie.name];
  }

  // 2. Fallback to Authorization Header
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    apiError(res, 'Akses ditolak: Sesi tidak ditemukan. Silakan login terlebih dahulu.', 'UNAUTHORIZED', null, 401);
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    apiError(res, 'Sesi telah kedaluwarsa atau token tidak valid. Silakan login kembali.', 'UNAUTHORIZED', null, 401);
    return;
  }

  req.user = payload;
  next();
}
