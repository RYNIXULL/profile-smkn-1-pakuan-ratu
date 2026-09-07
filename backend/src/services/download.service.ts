import { prisma } from '../config/database';
import { logAudit } from './audit.service';

export interface DownloadItemRecord {
  id: string;
  title: string;
  category: 'Akademik & Kurikulum' | 'Kesiswaan & Tata Tertib' | 'PKL & Magang Industri' | 'Administrasi & Surat';
  description: string;
  fileUrl: string;
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'ZIP';
  downloadCount: number;
  publishedDate: string;
}

export const DEFAULT_DOWNLOADS: DownloadItemRecord[] = [
  {
    id: 'doc-1',
    title: 'Kalender Pendidikan Resmi SMKN 1 Pakuan Ratu TA 2026/2027',
    category: 'Akademik & Kurikulum',
    description: 'Jadwal kegiatan akademik, pekan efektif belajar, jadwal asesmen sumatif, dan hari libur resmi semester ganjil & genap.',
    fileUrl: '/uploads/kalender-pendidikan-2026.pdf',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    downloadCount: 342,
    publishedDate: '1 Juli 2026',
  },
  {
    id: 'doc-2',
    title: 'Buku Pedoman Tata Tertib & Kode Etik Siswa SMKN 1 Pakuan Ratu',
    category: 'Kesiswaan & Tata Tertib',
    description: 'Aturan kedisiplinan, tata cara berpakaian kejuruan, norma kesopanan, dan sistem pembinaan karakter vokasi.',
    fileUrl: '/uploads/tata-tertib-siswa.pdf',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    downloadCount: 512,
    publishedDate: '5 Juli 2026',
  },
  {
    id: 'doc-3',
    title: 'Buku Panduan Praktik Kerja Lapangan (PKL) / Magang Industri',
    category: 'PKL & Magang Industri',
    description: 'Petunjuk teknis pelaksanaan magang industri 6 bulan, hak & kewajiban siswa, tata tertib di DU/DI, dan instrumen penilaian.',
    fileUrl: '/uploads/panduan-pkl-smk.pdf',
    fileSize: '3.1 MB',
    fileType: 'PDF',
    downloadCount: 420,
    publishedDate: '10 Agustus 2026',
  },
  {
    id: 'doc-4',
    title: 'Template Format Jurnal Harian & Lembar Laporan Kegiatan PKL',
    category: 'PKL & Magang Industri',
    description: 'Format dokumen Microsoft Word untuk pengisian kegiatan harian, catatan pembimbing industri, dan lembar verifikasi.',
    fileUrl: '/uploads/jurnal-laporan-pkl.docx',
    fileSize: '650 KB',
    fileType: 'DOCX',
    downloadCount: 680,
    publishedDate: '12 Agustus 2026',
  },
  {
    id: 'doc-5',
    title: 'Formulir Permohonan Legalisir Ijazah & Transkrip Nilai',
    category: 'Administrasi & Surat',
    description: 'Formulir resmi tata usaha bagi alumni yang mengajukan legalisasi ijazah untuk keperluan melamar kerja atau kuliah.',
    fileUrl: '/uploads/form-legalisir-ijazah.pdf',
    fileSize: '420 KB',
    fileType: 'PDF',
    downloadCount: 195,
    publishedDate: '15 Agustus 2026',
  },
  {
    id: 'doc-6',
    title: 'Dokumen Capaian Pembelajaran (CP) & Silabus Kurikulum Merdeka Vokasi',
    category: 'Akademik & Kurikulum',
    description: 'Struktur kurikulum 5 konsentrasi keahlian di SMKN 1 Pakuan Ratu untuk panduan belajar dan akreditasi.',
    fileUrl: '/uploads/capaian-pembelajaran-vokasi.pdf',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    downloadCount: 230,
    publishedDate: '20 Agustus 2026',
  },
];

export async function getPublicDownloads(category?: string, search?: string) {
  let list = DEFAULT_DOWNLOADS;
  try {
    const record = await prisma.setting.findUnique({
      where: { key: 'downloads_data' },
    });
    if (record && record.value) {
      list = JSON.parse(record.value);
    }
  } catch {
    // fallback
  }

  let filtered = list;
  if (category && category !== 'Semua') {
    filtered = filtered.filter((item) => item.category === category);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (item) => item.title.toLowerCase().includes(s) || item.description.toLowerCase().includes(s)
    );
  }
  return filtered;
}

export async function getAdminDownloads() {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: 'downloads_data' },
    });
    if (record && record.value) {
      return JSON.parse(record.value) as DownloadItemRecord[];
    }
  } catch {
    // fallback
  }
  return DEFAULT_DOWNLOADS;
}

export async function saveAdminDownloads(
  items: DownloadItemRecord[],
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const jsonString = JSON.stringify(items);
  await prisma.setting.upsert({
    where: { key: 'downloads_data' },
    update: { value: jsonString, type: 'json', group: 'downloads' },
    create: {
      key: 'downloads_data',
      value: jsonString,
      type: 'json',
      group: 'downloads',
    },
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'settings',
    details: { module: 'downloads_data', totalItems: items.length },
    ipAddress,
    userAgent,
  });

  return items;
}
