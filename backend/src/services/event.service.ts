import { prisma } from '../config/database';
import { slugify } from '../utils/slug';
import { logAudit } from './audit.service';

export async function getPublicEvents(params?: { month?: number; year?: number }) {
  const where: any = {};
  if (params?.year && params?.month) {
    const start = new Date(params.year, params.month - 1, 1);
    const end = new Date(params.year, params.month, 0, 23, 59, 59);
    where.startDate = { gte: start, lte: end };
  }

  return prisma.event.findMany({
    where,
    orderBy: { startDate: 'asc' },
  });
}

export async function getAdminEvents() {
  return prisma.event.findMany({
    orderBy: { startDate: 'desc' },
  });
}

export async function createEvent(data: any, userId: string, ipAddress?: string, userAgent?: string) {
  let baseSlug = slugify(data.title);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const created = await prisma.event.create({
    data: {
      ...data,
      slug,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });

  await logAudit({
    userId,
    action: 'CREATE',
    resource: 'events',
    resourceId: created.id,
    details: { title: created.title },
    ipAddress,
    userAgent,
  });

  return created;
}

export async function updateEvent(id: string, data: any, userId: string, ipAddress?: string, userAgent?: string) {
  const updateData: any = { ...data };
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;

  const updated = await prisma.event.update({
    where: { id },
    data: updateData,
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'events',
    resourceId: id,
    details: { title: updated.title },
    ipAddress,
    userAgent,
  });

  return updated;
}

export async function deleteEvent(id: string, userId: string, ipAddress?: string, userAgent?: string) {
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) throw new Error('Agenda tidak ditemukan.');

  await prisma.event.delete({ where: { id } });

  await logAudit({
    userId,
    action: 'DELETE',
    resource: 'events',
    resourceId: id,
    details: { title: existing.title },
    ipAddress,
    userAgent,
  });
}
