import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { apiError } from '../utils/response';

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      apiError(res, 'Akses tidak sah: Pengguna belum terautentikasi.', 'UNAUTHORIZED', null, 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      apiError(
        res,
        `Akses dilarang: Role Anda (${req.user.role}) tidak memiliki izin untuk tindakan ini.`,
        'FORBIDDEN',
        null,
        403
      );
      return;
    }

    next();
  };
}

// Preset guards
export const requireSuperAdmin = authorizeRoles('SUPER_ADMIN');
export const requireAdminOrHumas = authorizeRoles('SUPER_ADMIN', 'ADMIN_HUMAS');
export const requireStaff = authorizeRoles('SUPER_ADMIN', 'ADMIN_HUMAS', 'OPERATOR');
