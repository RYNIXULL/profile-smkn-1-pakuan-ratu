import { prisma } from '../config/database';
import { logAudit } from './audit.service';

export async function submitContactMessage(
  data: {
    name: string;
    email: string;
    phone?: string | null;
    subject: string;
    message: string;
  },
  ipAddress?: string
) {
  return prisma.contactMessage.create({
    data: {
      ...data,
      ipAddress,
    },
  });
}

export async function getAdminContactMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function markContactMessageRead(id: string, userId: string) {
  return prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function deleteContactMessage(id: string, userId: string, ipAddress?: string, userAgent?: string) {
  await prisma.contactMessage.delete({ where: { id } });

  await logAudit({
    userId,
    action: 'DELETE',
    resource: 'contacts',
    resourceId: id,
    ipAddress,
    userAgent,
  });
}
