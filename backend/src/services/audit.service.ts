import { prisma } from '../config/database';

export interface LogAuditParams {
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(params: LogAuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId || null,
        details: params.details ? JSON.stringify(params.details) : null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
      },
    });
  } catch (error) {
    console.error('Gagal mencatat audit log:', error);
  }
}
