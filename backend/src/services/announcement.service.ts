import { prisma } from '../config/database';
import { slugify } from '../utils/slug';
import { logAudit } from './audit.service';

export async function getPublicAnnouncements() {
  return prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: [{ isUrgent: 'desc' }, { publishedAt: 'desc' }],
  });
}

export async function getAdminAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createAnnouncement(data: any, userId: string, ipAddress?: string, userAgent?: string) {
  let baseSlug = slugify(data.title);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.announcement.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const created = await prisma.announcement.create({
    data: {
      ...data,
      slug,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });

  await logAudit({
    userId,
    action: 'CREATE',
    resource: 'announcements',
    resourceId: created.id,
    details: { title: created.title },
    ipAddress,
    userAgent,
  });

  return created;
}

export async function updateAnnouncement(id: string, data: any, userId: string, ipAddress?: string, userAgent?: string) {
  const updateData: any = { ...data };
  if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

  const updated = await prisma.announcement.update({
    where: { id },
    data: updateData,
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'announcements',
    resourceId: id,
    details: { title: updated.title },
    ipAddress,
    userAgent,
  });

  return updated;
}

export async function deleteAnnouncement(id: string, userId: string, ipAddress?: string, userAgent?: string) {
  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) throw new Error('Pengumuman tidak ditemukan.');

  await prisma.announcement.delete({ where: { id } });

  await logAudit({
    userId,
    action: 'DELETE',
    resource: 'announcements',
    resourceId: id,
    details: { title: existing.title },
    ipAddress,
    userAgent,
  });
}
