import { prisma } from '../config/database';
import { slugify } from '../utils/slug';
import { logAudit } from './audit.service';

export async function getPublicGalleries() {
  return prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        take: 1,
        include: { media: true },
      },
      _count: { select: { items: true } },
    },
  });
}

export async function getPublicGalleryBySlug(slug: string) {
  return prisma.gallery.findUnique({
    where: { slug },
    include: {
      items: {
        orderBy: { orderIndex: 'asc' },
        include: { media: true },
      },
    },
  });
}

export async function getAdminGalleries() {
  return prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        orderBy: { orderIndex: 'asc' },
        include: { media: true },
      },
      _count: { select: { items: true } },
    },
  });
}

export async function createGallery(data: any, userId: string, ipAddress?: string, userAgent?: string) {
  let baseSlug = slugify(data.title);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.gallery.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const created = await prisma.gallery.create({
    data: {
      ...data,
      slug,
    },
  });

  await logAudit({
    userId,
    action: 'CREATE',
    resource: 'galleries',
    resourceId: created.id,
    details: { title: created.title },
    ipAddress,
    userAgent,
  });

  return created;
}

export async function updateGallery(id: string, data: any, userId: string, ipAddress?: string, userAgent?: string) {
  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) throw new Error('Album galeri tidak ditemukan.');

  let slug = existing.slug;
  if (data.title && data.title !== existing.title) {
    let baseSlug = slugify(data.title);
    slug = baseSlug;
    let counter = 1;
    while (await prisma.gallery.findFirst({ where: { slug, NOT: { id } } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  const updated = await prisma.gallery.update({
    where: { id },
    data: {
      ...data,
      slug,
    },
    include: {
      items: {
        orderBy: { orderIndex: 'asc' },
        include: { media: true },
      },
      _count: { select: { items: true } },
    },
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'galleries',
    resourceId: id,
    details: { title: updated.title },
    ipAddress,
    userAgent,
  });

  return updated;
}

export async function addMediaToGallery(galleryId: string, mediaId: string, caption?: string) {
  const count = await prisma.galleryItem.count({ where: { galleryId } });
  return prisma.galleryItem.create({
    data: {
      galleryId,
      mediaId,
      caption,
      orderIndex: count,
    },
    include: { media: true },
  });
}

export async function removeMediaFromGallery(galleryId: string, itemId: string) {
  return prisma.galleryItem.delete({
    where: { id: itemId, galleryId },
  });
}

export async function deleteGallery(id: string, userId: string, ipAddress?: string, userAgent?: string) {
  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) throw new Error('Album galeri tidak ditemukan.');

  await prisma.gallery.delete({ where: { id } });

  await logAudit({
    userId,
    action: 'DELETE',
    resource: 'galleries',
    resourceId: id,
    details: { title: existing.title },
    ipAddress,
    userAgent,
  });
}
