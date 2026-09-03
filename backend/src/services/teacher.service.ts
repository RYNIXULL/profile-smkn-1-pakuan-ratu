import { prisma } from '../config/database';
import { logAudit } from './audit.service';

export async function getPublicTeachers(params?: { isStaff?: boolean; programSlug?: string }) {
  const where: any = {};
  if (params?.isStaff !== undefined) where.isStaff = params.isStaff;
  if (params?.programSlug) where.program = { slug: params.programSlug };

  return prisma.teacher.findMany({
    where,
    orderBy: { orderIndex: 'asc' },
    include: {
      program: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function getAdminTeachers() {
  return prisma.teacher.findMany({
    orderBy: { orderIndex: 'asc' },
    include: {
      program: { select: { id: true, name: true } },
    },
  });
}

export async function createTeacher(data: any, userId: string, ipAddress?: string, userAgent?: string) {
  const created = await prisma.teacher.create({ data });

  await logAudit({
    userId,
    action: 'CREATE',
    resource: 'teachers',
    resourceId: created.id,
    details: { name: created.name, position: created.position },
    ipAddress,
    userAgent,
  });

  return created;
}

export async function updateTeacher(id: string, data: any, userId: string, ipAddress?: string, userAgent?: string) {
  const updated = await prisma.teacher.update({
    where: { id },
    data,
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'teachers',
    resourceId: id,
    details: { name: updated.name },
    ipAddress,
    userAgent,
  });

  return updated;
}

export async function deleteTeacher(id: string, userId: string, ipAddress?: string, userAgent?: string) {
  const existing = await prisma.teacher.findUnique({ where: { id } });
  if (!existing) throw new Error('Guru/Tenaga kependidikan tidak ditemukan.');

  await prisma.teacher.delete({ where: { id } });

  await logAudit({
    userId,
    action: 'DELETE',
    resource: 'teachers',
    resourceId: id,
    details: { name: existing.name },
    ipAddress,
    userAgent,
  });
}
