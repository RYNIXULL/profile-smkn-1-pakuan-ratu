import { prisma } from '../config/database';
import { logAudit } from './audit.service';

export async function getPublicFacilities(category?: string) {
  const where: any = {};
  if (category) where.category = category;

  return prisma.facility.findMany({
    where,
    orderBy: { orderIndex: 'asc' },
  });
}

export async function getAdminFacilities() {
  return prisma.facility.findMany({
    orderBy: { orderIndex: 'asc' },
  });
}

export async function createFacility(data: any, userId: string, ipAddress?: string, userAgent?: string) {
  const created = await prisma.facility.create({ data });

  await logAudit({
    userId,
    action: 'CREATE',
    resource: 'facilities',
    resourceId: created.id,
    details: { name: created.name, category: created.category },
    ipAddress,
    userAgent,
  });

  return created;
}

export async function updateFacility(id: string, data: any, userId: string, ipAddress?: string, userAgent?: string) {
  const updated = await prisma.facility.update({
    where: { id },
    data,
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'facilities',
    resourceId: id,
    details: { name: updated.name },
    ipAddress,
    userAgent,
  });

  return updated;
}

export async function deleteFacility(id: string, userId: string, ipAddress?: string, userAgent?: string) {
  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing) throw new Error('Fasilitas tidak ditemukan.');

  await prisma.facility.delete({ where: { id } });

  await logAudit({
    userId,
    action: 'DELETE',
    resource: 'facilities',
    resourceId: id,
    details: { name: existing.name },
    ipAddress,
    userAgent,
  });
}
