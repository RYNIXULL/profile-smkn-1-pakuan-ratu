import { prisma } from '../config/database';
import { logAudit } from './audit.service';

export async function getPublicHomepageSections() {
  return prisma.homepageSection.findMany({
    where: { isVisible: true },
    orderBy: { orderIndex: 'asc' },
  });
}

export async function getAdminHomepageSections() {
  return prisma.homepageSection.findMany({
    orderBy: { orderIndex: 'asc' },
  });
}

export async function updateHomepageSection(
  sectionKey: string,
  data: {
    title?: string;
    subtitle?: string | null;
    content?: string | null;
    isVisible?: boolean;
    orderIndex?: number;
  },
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const updated = await prisma.homepageSection.upsert({
    where: { sectionKey },
    update: data,
    create: {
      sectionKey,
      title: data.title || '',
      subtitle: data.subtitle,
      content: data.content,
      isVisible: data.isVisible ?? true,
      orderIndex: data.orderIndex ?? 0,
    },
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'homepage',
    resourceId: sectionKey,
    details: { sectionKey, isVisible: updated.isVisible },
    ipAddress,
    userAgent,
  });

  return updated;
}
