import { prisma } from '../config/database';
import { logAudit } from './audit.service';

export async function getPublicAchievements(params?: { year?: number; level?: string; category?: string }) {
  const where: any = {};
  if (params?.year) where.year = params.year;
  if (params?.level) where.level = params.level;
  if (params?.category) where.category = params.category;

  return prisma.achievement.findMany({
    where,
    orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function getAdminAchievements() {
  return prisma.achievement.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createAchievement(data: any, userId: string, ipAddress?: string, userAgent?: string) {
  const created = await prisma.achievement.create({ data });

  await logAudit({
    userId,
    action: 'CREATE',
    resource: 'achievements',
    resourceId: created.id,
    details: { title: created.title, studentName: created.studentName },
    ipAddress,
    userAgent,
  });

  return created;
}

export async function updateAchievement(id: string, data: any, userId: string, ipAddress?: string, userAgent?: string) {
  const updated = await prisma.achievement.update({
    where: { id },
    data,
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'achievements',
    resourceId: id,
    details: { title: updated.title },
    ipAddress,
    userAgent,
  });

  return updated;
}

export async function deleteAchievement(id: string, userId: string, ipAddress?: string, userAgent?: string) {
  const existing = await prisma.achievement.findUnique({ where: { id } });
  if (!existing) throw new Error('Prestasi tidak ditemukan.');

  await prisma.achievement.delete({ where: { id } });

  await logAudit({
    userId,
    action: 'DELETE',
    resource: 'achievements',
    resourceId: id,
    details: { title: existing.title },
    ipAddress,
    userAgent,
  });
}
