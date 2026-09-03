import { prisma } from '../config/database';
import { slugify } from '../utils/slug';
import { logAudit } from './audit.service';
import { NewsStatus } from '@prisma/client';

export async function getPublicNews(params: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  search?: string;
  featured?: boolean;
}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 9));
  const skip = (page - 1) * limit;

  const where: any = {
    status: NewsStatus.PUBLISHED,
  };

  if (params.categorySlug) {
    where.category = { slug: params.categorySlug };
  }

  if (params.featured !== undefined) {
    where.isFeatured = params.featured;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { summary: { contains: params.search } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.news.count({ where }),
    prisma.news.findMany({
      where,
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } },
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

export async function getPublicNewsBySlug(slug: string) {
  const item = await prisma.news.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  if (!item || item.status !== NewsStatus.PUBLISHED) {
    return null;
  }

  // Increment view counter
  await prisma.news.update({
    where: { id: item.id },
    data: { viewsCount: { increment: 1 } },
  });

  // Fetch related articles from the same category
  const related = await prisma.news.findMany({
    where: {
      categoryId: item.categoryId,
      status: NewsStatus.PUBLISHED,
      NOT: { id: item.id },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      thumbnailUrl: true,
      publishedAt: true,
    },
  });

  return { item, related };
}

export async function getPublicCategories() {
  return prisma.newsCategory.findMany({
    include: {
      _count: {
        select: { news: { where: { status: NewsStatus.PUBLISHED } } },
      },
    },
  });
}

// Admin Services
export async function getAdminNews(params: {
  page?: number;
  limit?: number;
  status?: NewsStatus;
  search?: string;
  categoryId?: string;
}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 10));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.status) where.status = params.status;
  if (params.categoryId) where.categoryId = params.categoryId;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { summary: { contains: params.search } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.news.count({ where }),
    prisma.news.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true } },
        author: { select: { id: true, name: true } },
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

export async function getNewsById(id: string) {
  return prisma.news.findUnique({
    where: { id },
    include: { category: true, author: { select: { id: true, name: true } } },
  });
}

export async function createNews(
  data: {
    title: string;
    categoryId: string;
    summary: string;
    content: string;
    thumbnailUrl?: string | null;
    status?: NewsStatus;
    isFeatured?: boolean;
    metaTitle?: string | null;
    metaDesc?: string | null;
    publishedAt?: string | null;
  },
  authorId: string,
  ipAddress?: string,
  userAgent?: string
) {
  let baseSlug = slugify(data.title);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.news.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const status = data.status || NewsStatus.DRAFT;
  const publishedAt =
    status === NewsStatus.PUBLISHED
      ? data.publishedAt ? new Date(data.publishedAt) : new Date()
      : null;

  const created = await prisma.news.create({
    data: {
      title: data.title,
      slug,
      categoryId: data.categoryId,
      authorId,
      summary: data.summary,
      content: data.content,
      thumbnailUrl: data.thumbnailUrl,
      status,
      isFeatured: data.isFeatured ?? false,
      metaTitle: data.metaTitle || data.title,
      metaDesc: data.metaDesc || data.summary,
      publishedAt,
    },
    include: { category: true },
  });

  await logAudit({
    userId: authorId,
    action: 'CREATE',
    resource: 'news',
    resourceId: created.id,
    details: { title: created.title, status: created.status },
    ipAddress,
    userAgent,
  });

  return created;
}

export async function updateNews(
  id: string,
  data: any,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) throw new Error('Berita tidak ditemukan.');

  const updateData: any = { ...data };

  if (data.title && data.title !== existing.title) {
    let baseSlug = slugify(data.title);
    let slug = baseSlug;
    let counter = 1;

    while (
      await prisma.news.findFirst({
        where: { slug, NOT: { id } },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    updateData.slug = slug;
  }

  if (data.status === NewsStatus.PUBLISHED && !existing.publishedAt) {
    updateData.publishedAt = new Date();
  }

  const updated = await prisma.news.update({
    where: { id },
    data: updateData,
    include: { category: true },
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'news',
    resourceId: id,
    details: { changes: Object.keys(data), title: updated.title, status: updated.status },
    ipAddress,
    userAgent,
  });

  return updated;
}

export async function deleteNews(
  id: string,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) throw new Error('Berita tidak ditemukan.');

  await prisma.news.delete({ where: { id } });

  await logAudit({
    userId,
    action: 'DELETE',
    resource: 'news',
    resourceId: id,
    details: { title: existing.title },
    ipAddress,
    userAgent,
  });
}
