import { prisma } from '../config/database';
import { logAudit } from './audit.service';

export const DEFAULT_BKK_CONFIG = {
  heroTitle: 'Bursa Kerja Khusus (BKK) & Kemitraan Industri',
  heroSubtitle:
    'Jembatan strategis penyerapan kerja lulusan, kemitraan Praktik Kerja Lapangan (PKL), dan Teaching Factory bersama Dunia Usaha & Dunia Industri (DUDI).',
  stats: {
    totalPartners: 28,
    absorptionRate: '87%',
    activeVacancies: 14,
    trackedAlumni: '1.250+',
  },
  jobs: [
    {
      id: 'job-1',
      title: 'Staff Teknisi Mekanik & Service Advisor',
      company: 'PT Tunas Dwipa Matra (Astra Honda Motor)',
      logoUrl: '/images/tbsm.jpg',
      location: 'Way Kanan & Kotabumi',
      type: 'Penuh Waktu',
      salaryRange: 'UMK s.d Rp 4.500.000',
      targetMajor: 'Teknik Bisnis Sepeda Motor (TBSM)',
      requirements:
        'Lulusan SMK TBSM/Otomotif, usia 18-22 tahun, menguasai sistem injeksi EFI, jujur dan disiplin tinggi.',
      deadline: '30 Mei 2026',
      contactUrl: 'https://wa.me/6282280001234?text=Halo%20BKK%20SMKN1,%20saya%20ingin%20melamar%20posisi%20Teknisi%20AHASS',
      status: 'Aktif',
    },
    {
      id: 'job-2',
      title: 'Junior Graphic Designer & Multimedia Creator',
      company: 'CV Digital Kreasi Nusantara',
      logoUrl: '/images/dkv.jpg',
      location: 'Bandar Lampung / Hybrid',
      type: 'Penuh Waktu',
      salaryRange: 'Kompetitif / UMK',
      targetMajor: 'Desain Komunikasi Visual (DKV)',
      requirements:
        'Lulusan SMK DKV, mahir Adobe Illustrator, Photoshop, Premiere Pro, memiliki portofolio karya kreatif.',
      deadline: '15 Juni 2026',
      contactUrl: 'https://wa.me/6282280001234?text=Halo%20BKK%20SMKN1,%20saya%20ingin%20melamar%20posisi%20Designer%20DKV',
      status: 'Aktif',
    },
    {
      id: 'job-3',
      title: 'Pengawas Lapangan Smart Farming & Tanaman Pangan',
      company: 'PT Great Giant Pineapple (GGP Partner)',
      logoUrl: '/images/pertanian.jpg',
      location: 'Lampung Tengah & Way Kanan',
      type: 'Penuh Waktu',
      salaryRange: 'UMK Lampung + Bonus Target',
      targetMajor: 'Agribisnis Tanaman (Pertanian)',
      requirements:
        'Lulusan SMK Pertanian, memahami budidaya tanaman pangan dan hortikultura, siap bertugas di unit produksi perkebunan.',
      deadline: '20 Juni 2026',
      contactUrl: 'https://wa.me/6282280001234?text=Halo%20BKK%20SMKN1,%20saya%20ingin%20melamar%20posisi%20Staff%20Pertanian',
      status: 'Aktif',
    },
    {
      id: 'job-4',
      title: 'Staff Administrasi Kasir & Akuntansi Mini',
      company: 'Koperasi Konsumen Sejahtera Way Kanan',
      logoUrl: '/images/akuntansi.jpg',
      location: 'Pakuan Ratu, Way Kanan',
      type: 'Penuh Waktu',
      salaryRange: 'UMK Way Kanan',
      targetMajor: 'Akuntansi & Keuangan Lembaga (AKL)',
      requirements:
        'Lulusan SMK Akuntansi, teliti dalam pembukuan arus kas, menguasai Ms. Excel dan software kasir POS.',
      deadline: '25 Juni 2026',
      contactUrl: 'https://wa.me/6282280001234?text=Halo%20BKK%20SMKN1,%20saya%20ingin%20melamar%20posisi%20Staff%20Akuntansi',
      status: 'Aktif',
    },
  ],
  partners: [
    {
      id: 'partner-1',
      name: 'PT Astra Honda Motor (AHASS Jaringan Lampung)',
      sector: 'Otomotif & Manufaktur Kendaraan Bermotor',
      mouScope: 'Prakerin (PKL), Kelas Industri TBSM, Uji Sertifikasi Keahlian, Penyaluran Lulusan',
      logoUrl: '/images/tbsm.jpg',
      websiteUrl: 'https://www.astra-honda.com',
    },
    {
      id: 'partner-2',
      name: 'PT Great Giant Pineapple (GGP)',
      sector: 'Agroindustri & Perkebunan Hortikultura Ekspor',
      mouScope: 'Teaching Factory Pertanian, Magang Siswa & Guru, Perekrutan Tenaga Kerja Vokasi',
      logoUrl: '/images/pertanian.jpg',
      websiteUrl: 'https://greatgiantpineapple.com',
    },
    {
      id: 'partner-3',
      name: 'PT Pemuka Sakti Manis Indah (PSMI)',
      sector: 'Industri Gula Rafinasi & Perkebunan Tebu',
      mouScope: 'Prakerin Lapangan, Workshop Keselamatan Kerja (K3), Penyerapan Tenaga Kerja Lokal',
      logoUrl: '/images/pertanian.jpg',
      websiteUrl: '',
    },
    {
      id: 'partner-4',
      name: 'Bank Lampung Kantor Cabang Way Kanan',
      sector: 'Perbankan & Jasa Keuangan Daerah',
      mouScope: 'Praktik Industri Siswa Akuntansi, Literasi Finansial Digital, Program Magang Terpadu',
      logoUrl: '/images/akuntansi.jpg',
      websiteUrl: 'https://banklampung.co.id',
    },
    {
      id: 'partner-5',
      name: 'Kreasi Visual Multimedia Studio',
      sector: 'Industri Kreatif, Desain Periklanan & Digital Marketing',
      mouScope: 'Prakerin Siswa DKV, Proyek Komersial Siswa, Kurikulum Berbasis Industri Kreatif',
      logoUrl: '/images/dkv.jpg',
      websiteUrl: '',
    },
  ],
};

export async function getPublicBkkInfo() {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: 'bkk_config' },
    });
    if (record && record.value) {
      return JSON.parse(record.value);
    }
  } catch {
    // fallback
  }
  return DEFAULT_BKK_CONFIG;
}

export async function updateBkkConfig(
  data: any,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const jsonString = JSON.stringify(data);
  await prisma.setting.upsert({
    where: { key: 'bkk_config' },
    update: { value: jsonString, type: 'json', group: 'bkk' },
    create: {
      key: 'bkk_config',
      value: jsonString,
      type: 'json',
      group: 'bkk',
    },
  });

  await logAudit({
    userId,
    action: 'UPDATE',
    resource: 'settings',
    details: { module: 'bkk_config', totalJobs: data.jobs?.length, totalPartners: data.partners?.length },
    ipAddress,
    userAgent,
  });

  return getPublicBkkInfo();
}

export async function submitTracerStudy(data: {
  fullName: string;
  graduationYear: number;
  programMajor: string;
  currentStatus: 'Bekerja' | 'Wirausaha' | 'Kuliah' | 'Mencari Kerja';
  institutionName?: string;
  jobTitleOrField?: string;
  phone: string;
  email?: string;
  notes?: string;
  ipAddress?: string;
}) {
  const payload = {
    graduationYear: data.graduationYear,
    programMajor: data.programMajor,
    currentStatus: data.currentStatus,
    institutionName: data.institutionName || '-',
    jobTitleOrField: data.jobTitleOrField || '-',
    notes: data.notes || '-',
  };

  const messageText = `Tahun Lulus: ${data.graduationYear} | Jurusan: ${data.programMajor} | Status: ${
    data.currentStatus
  } | Instansi: ${data.institutionName || '-'} | Jabatan/Bidang: ${data.jobTitleOrField || '-'}\n[PAYLOAD_JSON]: ${JSON.stringify(
    payload
  )}`;

  return prisma.contactMessage.create({
    data: {
      name: data.fullName,
      email: data.email || `${data.phone.replace(/[^0-9]/g, '')}@alumni.smkn1`,
      phone: data.phone,
      subject: 'TRACER_STUDY',
      message: messageText,
      ipAddress: data.ipAddress,
    },
  });
}

export async function getAdminTracerSubmissions() {
  const messages = await prisma.contactMessage.findMany({
    where: { subject: 'TRACER_STUDY' },
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
      fullName: m.name,
      email: m.email,
      phone: m.phone,
      createdAt: m.createdAt,
      graduationYear: parsed.graduationYear || '-',
      programMajor: parsed.programMajor || '-',
      currentStatus: parsed.currentStatus || 'Bekerja',
      institutionName: parsed.institutionName || '-',
      jobTitleOrField: parsed.jobTitleOrField || '-',
      notes: parsed.notes || '-',
    };
  });
}
