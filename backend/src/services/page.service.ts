import { prisma } from '../config/database';
import { logAudit } from './audit.service';

export async function getPublicPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
  });
}

export async function getAdminPages() {
  return prisma.page.findMany({
    orderBy: { createdAt: 'asc' },
  });
}

export async function updatePage(id: string, data: any, userId: string, ipAddress?: string, userAgent?: string) {
  const updated = await prisma.page.update({
    where: { id },
    data,
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'pages',
    resourceId: id,
    details: { title: updated.title, slug: updated.slug },
    ipAddress,
    userAgent,
  });

  return updated;
}
