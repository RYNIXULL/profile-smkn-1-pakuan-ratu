import { prisma } from '../config/database';
import { logAudit } from './audit.service';

export async function getPublicSettings() {
  const settings = await prisma.setting.findMany();
  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  return result;
}

export async function getAdminSettings() {
  return prisma.setting.findMany({
    orderBy: { group: 'asc' },
  });
}

export async function updateSettings(
  settings: Array<{ key: string; value: string }>,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'settings',
    details: { keys: settings.map((s) => s.key) },
    ipAddress,
    userAgent,
  });

  return getPublicSettings();
}
