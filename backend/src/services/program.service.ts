import { prisma } from '../config/database';
import { logAudit } from './audit.service';

export async function getPublicPrograms() {
  return prisma.program.findMany({
    orderBy: { orderIndex: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      shortDesc: true,
      accentColor: true,
      iconName: true,
      imageUrl: true,
      orderIndex: true,
    },
  });
}

export async function getPublicProgramBySlug(slug: string) {
  return prisma.program.findUnique({
    where: { slug },
    include: {
      teachers: {
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          name: true,
          position: true,
          subject: true,
          photoUrl: true,
          bio: true,
        },
      },
    },
  });
}

export async function getAdminPrograms() {
  return prisma.program.findMany({
    orderBy: { orderIndex: 'asc' },
  });
}

export async function updateProgram(
  id: string,
  data: any,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) throw new Error('Program keahlian tidak ditemukan.');

  const updated = await prisma.program.update({
    where: { id },
    data,
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'programs',
    resourceId: id,
    details: { name: updated.name },
    ipAddress,
    userAgent,
  });

  return updated;
}
