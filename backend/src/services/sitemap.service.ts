import { prisma } from '../config/database';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: string;
}

const BASE_URL = process.env.PUBLIC_SITE_URL || 'https://smkn1pakuanratu.sch.id';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

export async function generateSitemapXml(): Promise<string> {
  const urls: SitemapUrl[] = [
    { loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${BASE_URL}/ppdb`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${BASE_URL}/bkk`, changefreq: 'weekly', priority: '0.85' },
    { loc: `${BASE_URL}/unduhan`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${BASE_URL}/berita`, changefreq: 'daily', priority: '0.85' },
    { loc: `${BASE_URL}/agenda`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${BASE_URL}/guru`, changefreq: 'monthly', priority: '0.75' },
    { loc: `${BASE_URL}/fasilitas`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/prestasi`, changefreq: 'monthly', priority: '0.75' },
    { loc: `${BASE_URL}/galeri`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${BASE_URL}/kontak`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${BASE_URL}/program-keahlian`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${BASE_URL}/profil/sambutan-kepala-sekolah`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/profil/sejarah`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/profil/visi-misi`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/profil/struktur-organisasi`, changefreq: 'monthly', priority: '0.7' },
  ];

  try {
    // Dynamic News Articles
    const newsList = await prisma.news.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    });

    for (const item of newsList) {
      urls.push({
        loc: `${BASE_URL}/berita/${item.slug}`,
        lastmod: item.updatedAt ? item.updatedAt.toISOString().split('T')[0] : undefined,
        changefreq: 'weekly',
        priority: '0.8',
      });
    }

    // Dynamic Programs
    const programList = await prisma.program.findMany({
      select: { slug: true, updatedAt: true },
    });

    for (const prog of programList) {
      urls.push({
        loc: `${BASE_URL}/program-keahlian/${prog.slug}`,
        lastmod: prog.updatedAt ? prog.updatedAt.toISOString().split('T')[0] : undefined,
        changefreq: 'monthly',
        priority: '0.85',
      });
    }
  } catch (error) {
    console.error('Error fetching dynamic sitemap items:', error);
  }

  // Format into XML string
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const u of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(u.loc)}</loc>\n`;
    if (u.lastmod) {
      xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
    }
    if (u.changefreq) {
      xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    }
    if (u.priority) {
      xml += `    <priority>${u.priority}</priority>\n`;
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

export function generateRobotsTxt(): string {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /api/admin/',
    '',
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}
