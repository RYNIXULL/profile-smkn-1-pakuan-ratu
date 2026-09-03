import { Request, Response, NextFunction } from 'express';
import { apiError } from '../utils/response';
import { config } from '../config';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  console.error('[Error Handler]', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  const details = config.isProduction ? undefined : err.stack;

  apiError(res, message, code, details, statusCode);
}
