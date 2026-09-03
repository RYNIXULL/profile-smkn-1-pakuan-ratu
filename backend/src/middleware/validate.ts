import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { apiError } from '../utils/response';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        apiError(res, 'Validasi input gagal', 'VALIDATION_ERROR', issues, 422);
        return;
      }
      apiError(res, 'Format permintaan tidak valid', 'INVALID_REQUEST', null, 400);
    }
  };
}
