import { prisma } from '../config/database';

export interface SearchResultItem {
  id: string;
  type: 'news' | 'event' | 'announcement' | 'teacher' | 'program' | 'facility';
  typeLabel: string;
  title: string;
  subtitle?: string | null;
  url: string;
  imageUrl?: string | null;
  date?: string | null;
}

export async function searchPublic(query: string): Promise<SearchResultItem[]> {
  const q = query.trim();
  if (!q) {
    return [];
  }

  // Cari paralel di berbagai model data publik
  const [news, events, announcements, teachers, programs, facilities] = await Promise.all([
    prisma.news.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: q } },
          { summary: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        thumbnailUrl: true,
        publishedAt: true,
      },
      take: 6,
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { location: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        startDate: true,
        location: true,
        imageUrl: true,
      },
      take: 5,
      orderBy: { startDate: 'desc' },
    }),
    prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
      },
      take: 5,
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.teacher.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { position: { contains: q } },
          { subject: { contains: q } },
        ],
      },
      select: {
        id: true,
        name: true,
        position: true,
        subject: true,
        photoUrl: true,
      },
      take: 6,
      orderBy: { orderIndex: 'asc' },
    }),
    prisma.program.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { shortDesc: { contains: q } },
          { tagline: { contains: q } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        tagline: true,
        imageUrl: true,
      },
      take: 5,
    }),
    prisma.facility.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { category: { contains: q } },
        ],
      },
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        imageUrl: true,
      },
      take: 5,
    }),
  ]);

  const results: SearchResultItem[] = [];

  for (const n of news) {
    results.push({
      id: n.id,
      type: 'news',
      typeLabel: 'Berita',
      title: n.title,
      subtitle: n.summary ? (n.summary.length > 90 ? `${n.summary.slice(0, 90)}...` : n.summary) : null,
      url: `/berita/${n.slug}`,
      imageUrl: n.thumbnailUrl,
      date: n.publishedAt ? n.publishedAt.toISOString() : null,
    });
  }

  for (const e of events) {
    results.push({
      id: e.id,
      type: 'event',
      typeLabel: 'Agenda',
      title: e.title,
      subtitle: `${e.location} • ${e.description ? (e.description.length > 70 ? `${e.description.slice(0, 70)}...` : e.description) : ''}`,
      url: `/agenda`,
      imageUrl: e.imageUrl,
      date: e.startDate ? e.startDate.toISOString() : null,
    });
  }

  for (const a of announcements) {
    results.push({
      id: a.id,
      type: 'announcement',
      typeLabel: 'Pengumuman',
      title: a.title,
      subtitle: 'Pengumuman Resmi Sekolah',
      url: `/pengumuman`,
      date: a.publishedAt ? a.publishedAt.toISOString() : null,
    });
  }

  for (const t of teachers) {
    results.push({
      id: t.id,
      type: 'teacher',
      typeLabel: 'Guru & Staf',
      title: t.name,
      subtitle: `${t.position}${t.subject ? ` • ${t.subject}` : ''}`,
      url: `/guru`,
      imageUrl: t.photoUrl,
    });
  }

  for (const p of programs) {
    results.push({
      id: p.id,
      type: 'program',
      typeLabel: 'Program Keahlian',
      title: p.name,
      subtitle: p.tagline || 'Program Keahlian Kejuruan',
      url: `/program-keahlian/${p.slug}`,
      imageUrl: p.imageUrl,
    });
  }

  for (const f of facilities) {
    results.push({
      id: f.id,
      type: 'facility',
      typeLabel: 'Fasilitas',
      title: f.name,
      subtitle: `${f.category} • ${f.description ? (f.description.length > 70 ? `${f.description.slice(0, 70)}...` : f.description) : ''}`,
      url: `/fasilitas`,
      imageUrl: f.imageUrl,
    });
  }

  return results;
}
