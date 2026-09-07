import { prisma } from '../config/database';
import { logAudit } from './audit.service';

export const DEFAULT_PPDB_CONFIG = {
  academicYear: '2026/2027',
  title: 'Penerimaan Peserta Didik Baru (PPDB) SMKN 1 Pakuan Ratu',
  subtitle: 'Tahun Ajaran 2026/2027 - Menyiapkan Generasi Vokasi Berdaya Saing Global & Berakhlak Mulia',
  isOpen: true,
  startDate: '2026-06-15',
  endDate: '2026-07-10',
  announcementDate: '2026-07-15',
  reRegistrationDate: '16 - 20 Juli 2026',
  officialPortalUrl: 'https://lampung.siap-ppdb.com',
  contactWhatsapp: '6282280001234',
  contactPersonName: 'Sekretariat Panitia PPDB SMKN 1 Pakuan Ratu',
  totalQuota: 360,
  quotas: [
    {
      major: 'Agribisnis Tanaman (Pertanian)',
      slug: 'pertanian',
      capacity: 72,
      classes: 2,
      description: 'Fokus Smart Farming, kultur jaringan tanaman, hortikultura, dan agribisnis modern.',
      icon: 'Sprout',
    },
    {
      major: 'Agribisnis Ternak (Peternakan)',
      slug: 'peternakan',
      capacity: 72,
      classes: 2,
      description: 'Pemeliharaan ternak ruminansia/unggas closed house, pakan mandiri, dan pengolahan hasil ternak.',
      icon: 'Beef',
    },
    {
      major: 'Desain Komunikasi Visual (DKV)',
      slug: 'dkv',
      capacity: 72,
      classes: 2,
      description: 'Desain grafis, ilustrasi digital, videografi sinematik, animasi 2D/3D, dan branding periklanan.',
      icon: 'Palette',
    },
    {
      major: 'Teknik Bisnis Sepeda Motor (TBSM)',
      slug: 'tbsm',
      capacity: 72,
      classes: 2,
      description: 'Mekanik otomotif standar APM, tune up injeksi EFI, kelistrikan bodi, dan wirausaha bengkel.',
      icon: 'Wrench',
    },
    {
      major: 'Akuntansi & Keuangan Lembaga (AKL)',
      slug: 'akuntansi',
      capacity: 72,
      classes: 2,
      description: 'Akuntansi komputer, perpajakan, perbankan syariah/konvensional, dan administrasi keuangan digital.',
      icon: 'TrendingUp',
    },
  ],
  tracks: [
    {
      name: 'Jalur Zonasi',
      percentage: '50%',
      desc: 'Diperuntukkan bagi calon peserta didik yang berdomisili di dalam wilayah zonasi yang telah ditetapkan oleh Pemerintah Provinsi Lampung.',
    },
    {
      name: 'Jalur Afirmasi',
      percentage: '15%',
      desc: 'Bagi calon peserta didik dari keluarga ekonomi kurang mampu (pemegang KIP, PKH, atau KKS) dan penyandang disabilitas.',
    },
    {
      name: 'Jalur Prestasi',
      percentage: '20%',
      desc: 'Berdasarkan nilai rapor SMP/MTs sederajat semester 1 s.d 5 serta piagam kejuaraan akademik, olahraga, sains, maupun seni.',
    },
    {
      name: 'Jalur Minat Bakat & Tes Khusus Vokasi',
      percentage: '15%',
      desc: 'Seleksi portofolio keahlian dan wawancara minat bakat kejuruan untuk kesiapan belajar vokasi.',
    },
  ],
  requirements: [
    'Surat Keterangan Lulus (SKL) asli atau Ijazah SMP/MTs/Paket B sederajat',
    'Fotokopi Akta Kelahiran (batas usia maksimal 21 tahun pada 1 Juli tahun berjalan)',
    'Fotokopi Kartu Keluarga (KK) yang diterbitkan minimal 1 (satu) tahun sebelum tanggal pendaftaran',
    'Pas foto terbaru ukuran 3x4 berwarna (4 lembar)',
    'Surat Pernyataan Bebas Narkoba dan Tidak Bertindik/Bertato (khusus laki-laki)',
    'Kartu KIP/PKH asli dan fotokopi (khusus pendaftar Jalur Afirmasi)',
    'Sertifikat/Piagam Kejuaraan asli dan fotokopi yang telah dilegalisir (khusus Jalur Prestasi)',
  ],
  steps: [
    {
      step: 1,
      title: 'Pendaftaran Online',
      desc: 'Akses portal resmi PPDB Provinsi Lampung atau isi konsultasi pra-pendaftaran di website SMKN 1 Pakuan Ratu.',
    },
    {
      step: 2,
      title: 'Verifikasi Berkas Fisik',
      desc: 'Bawa seluruh berkas asli dan fotokopi ke Posko Pendaftaran Kampus SMKN 1 Pakuan Ratu untuk divalidasi panitia.',
    },
    {
      step: 3,
      title: 'Tes Minat Bakat & Wawancara',
      desc: 'Mengikuti asesmen minat bakat sesuai jurusan kejuruan yang dipilih serta wawancara kesiapan kerja vokasi.',
    },
    {
      step: 4,
      title: 'Pengumuman & Daftar Ulang',
      desc: 'Melihat pengumuman penetapan hasil seleksi dan melakukan proses daftar ulang sebagai siswa resmi SMKN 1 Pakuan Ratu.',
    },
  ],
  faq: [
    {
      q: 'Berapa biaya pendaftaran PPDB di SMKN 1 Pakuan Ratu?',
      a: 'Pendaftaran PPDB di SMKN 1 Pakuan Ratu 100% GRATIS (tidak dipungut biaya pendaftaran maupun seleksi). Sebagai sekolah negeri, proses mengacu pada regulasi Dinas Pendidikan Provinsi Lampung.',
    },
    {
      q: 'Apakah ada biaya SPP bulanan bagi siswa?',
      a: 'Tidak ada biaya SPP bulanan. Biaya operasional pendidikan didanai oleh program Bantuan Operasional Sekolah (BOS).',
    },
    {
      q: 'Bolehkah memilih lebih dari satu jurusan saat mendaftar?',
      a: 'Ya, calon peserta didik baru dapat menentukan Jurusan Pilihan 1 (Prioritas Utama) dan Jurusan Pilihan 2 (Pilihan Cadangan).',
    },
    {
      q: 'Apakah lulusan dari luar Kabupaten Way Kanan dapat mendaftar?',
      a: 'Dapat mendaftar melalui Jalur Prestasi, Jalur Perpindahan Tugas Orang Tua, maupun kuota zonasi irisan antar-wilayah.',
    },
  ],
};

export async function getPublicPpdbInfo() {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: 'ppdb_config' },
    });
    if (record && record.value) {
      return JSON.parse(record.value);
    }
  } catch {
    // fallback to default
  }
  return DEFAULT_PPDB_CONFIG;
}

export async function updatePpdbInfo(
  data: any,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const jsonString = JSON.stringify(data);
  await prisma.setting.upsert({
    where: { key: 'ppdb_config' },
    update: { value: jsonString, type: 'json', group: 'ppdb' },
    create: {
      key: 'ppdb_config',
      value: jsonString,
      type: 'json',
      group: 'ppdb',
    },
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'settings',
    details: { module: 'ppdb_config', academicYear: data.academicYear },
    ipAddress,
    userAgent,
  });

  return getPublicPpdbInfo();
}

export async function submitPpdbConsultation(data: {
  name: string;
  juniorSchool: string;
  phone: string;
  email?: string;
  programChoice1: string;
  programChoice2?: string;
  questions?: string;
  ipAddress?: string;
}) {
  const payload = {
    juniorSchool: data.juniorSchool,
    programChoice1: data.programChoice1,
    programChoice2: data.programChoice2 || '-',
    questions: data.questions || '-',
  };

  const messageText = `Asal SMP/MTs: ${data.juniorSchool} | Pilihan 1: ${data.programChoice1} | Pilihan 2: ${
    data.programChoice2 || '-'
  }\nPertanyaan/Catatan: ${data.questions || 'Ingin konsultasi pendaftaran PPDB.'}\n[PAYLOAD_JSON]: ${JSON.stringify(
    payload
  )}`;

  return prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email || `${data.phone.replace(/[^0-9]/g, '')}@ppdb.candidate`,
      phone: data.phone,
      subject: 'PPDB_CONSULTATION',
      message: messageText,
      ipAddress: data.ipAddress,
    },
  });
}

export async function getAdminPpdbApplicants() {
  const messages = await prisma.contactMessage.findMany({
    where: { subject: 'PPDB_CONSULTATION' },
    orderBy: { createdAt: 'desc' },
  });

  return messages.map((m) => {
    let parsed: any = {};
    if (m.message.includes('[PAYLOAD_JSON]: ')) {
      try {
        const jsonPart = m.message.split('[PAYLOAD_JSON]: ')[1];
        parsed = JSON.parse(jsonPart);
      } catch {
        // fallback
      }
    }
    return {
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      isRead: m.isRead,
      createdAt: m.createdAt,
      juniorSchool: parsed.juniorSchool || '-',
      programChoice1: parsed.programChoice1 || '-',
      programChoice2: parsed.programChoice2 || '-',
      questions: parsed.questions || m.message,
    };
  });
}
