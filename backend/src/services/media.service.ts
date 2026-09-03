import { prisma } from '../config/database';
import { logAudit } from './audit.service';
import fs from 'fs';

export async function getAdminMedia(params?: {
  page?: number;
  limit?: number;
  search?: string;
  mimeType?: string;
}) {
  const page = Math.max(1, params?.page || 1);
  const limit = Math.min(50, Math.max(1, params?.limit || 20));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params?.mimeType) where.mimeType = params.mimeType;
  if (params?.search) {
    where.OR = [
      { originalName: { contains: params.search } },
      { altText: { contains: params.search } },
      { caption: { contains: params.search } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.media.count({ where }),
    prisma.media.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        uploader: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function saveMediaRecord(
  data: {
    filename: string;
    originalName: string;
    path: string;
    url: string;
    mimeType: string;
    sizeBytes: number;
    width?: number;
    height?: number;
    altText?: string;
    caption?: string;
  },
  uploaderId?: string,
  ipAddress?: string,
  userAgent?: string
) {
  const created = await prisma.media.create({
    data: {
      ...data,
      uploaderId: uploaderId || null,
    },
  });

  await logAudit({
    userId: uploaderId,
    action: 'UPLOAD',
    resource: 'media',
    resourceId: created.id,
    details: { filename: created.filename, size: created.sizeBytes },
    ipAddress,
    userAgent,
  });

  return created;
}

export async function deleteMediaRecord(id: string, userId: string, ipAddress?: string, userAgent?: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error('Media tidak ditemukan.');

  // Remove physical file safely if exists
  if (fs.existsSync(media.path)) {
    try {
      await fs.promises.unlink(media.path);
    } catch (err) {
      console.warn('Gagal menghapus file fisik:', err);
    }
  }

  await prisma.media.delete({ where: { id } });

  await logAudit({
    userId,
    action: 'DELETE',
    resource: 'media',
    resourceId: id,
    details: { filename: media.filename },
    ipAddress,
    userAgent,
  });
}
