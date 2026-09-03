import { Router, Request, Response } from 'express';
import { loginService, logoutService, getMeService, changePasswordService } from '../services/auth.service';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginLimiter } from '../middleware/rateLimiter';
import { LoginSchema, ChangePasswordSchema } from '../validators';
import { apiSuccess, apiError } from '../utils/response';
import { config } from '../config';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', loginLimiter, validate(LoginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await loginService({ email, password, ipAddress, userAgent });

    // Set secure httpOnly session cookie
    res.cookie(config.cookie.name, result.token, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: config.isProduction ? 'strict' : 'lax',
      maxAge: config.cookie.maxAge,
    });

    apiSuccess(res, result, 'Login berhasil. Selamat datang kembali.');
  } catch (error: any) {
    apiError(res, error.message || 'Login gagal.', 'AUTH_FAILED', null, 401);
  }
});

// POST /api/auth/logout
authRouter.post('/logout', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    if (req.user) {
      await logoutService(req.user.userId, undefined, ipAddress, userAgent);
    }

    res.clearCookie(config.cookie.name);
    apiSuccess(res, null, 'Logout berhasil. Sesi telah diakhiri.');
  } catch (error: any) {
    apiError(res, error.message || 'Logout gagal.', 'LOGOUT_FAILED', null, 500);
  }
});

// GET /api/auth/me
authRouter.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      apiError(res, 'Sesi tidak ditemukan.', 'UNAUTHORIZED', null, 401);
      return;
    }
    const user = await getMeService(req.user.userId);
    apiSuccess(res, user, 'Data akun berhasil diambil.');
  } catch (error: any) {
    apiError(res, error.message || 'Gagal memuat profil.', 'PROFILE_FAILED', null, 400);
  }
});

// POST /api/auth/change-password
authRouter.post(
  '/change-password',
  authenticate,
  validate(ChangePasswordSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        apiError(res, 'Sesi tidak ditemukan.', 'UNAUTHORIZED', null, 401);
        return;
      }
      const { currentPassword, newPassword } = req.body;
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      await changePasswordService({
        userId: req.user.userId,
        currentPassword,
        newPassword,
        ipAddress,
        userAgent,
      });

      apiSuccess(res, null, 'Password berhasil diperbarui.');
    } catch (error: any) {
      apiError(res, error.message || 'Gagal mengubah password.', 'CHANGE_PASSWORD_FAILED', null, 400);
    }
  }
);
