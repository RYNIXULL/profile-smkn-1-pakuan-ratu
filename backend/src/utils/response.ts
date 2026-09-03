import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export function apiSuccess<T>(
  res: Response,
  data: T,
  message = 'Operasi berhasil',
  statusCode = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
}

export function apiError(
  res: Response,
  message: string,
  code = 'BAD_REQUEST',
  details?: any,
  statusCode = 400
): Response {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
  return res.status(statusCode).json(response);
}
