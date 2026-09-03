import { PrismaClient, NewsStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding database SMKN 1 Pakuan Ratu...');

  // 1. Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      displayName: 'Super Administrator',
      description: 'Akses penuh ke seluruh modul, manajemen pengguna, dan audit log.',
    },
  });

  const humasRole = await prisma.role.upsert({
    where: { name: 'ADMIN_HUMAS' },
    update: {},
    create: {
      name: 'ADMIN_HUMAS',
      displayName: 'Admin Humas & Publikasi',
      description: 'Mengelola berita, agenda, galeri, prestasi, dan pengumuman sekolah.',
    },
  });

  const operatorRole = await prisma.role.upsert({
    where: { name: 'OPERATOR' },
    update: {},
    create: {
      name: 'OPERATOR',
      displayName: 'Operator Konten',
      description: 'Operator entry data konten terbatas.',
    },
  });

  // 2. Initial Super Admin User (Dummy development credentials, change in production)
  const defaultPasswordHash = await bcrypt.hash('AdminSMKN1@2026!', 10);

  const superAdminUser = await prisma.user.upsert({
    where: { email: 'admin@smkn1pakuanratu.sch.id' },
    update: {},
    create: {
      name: 'Administrator Utama',
      email: 'admin@smkn1pakuanratu.sch.id',
      passwordHash: defaultPasswordHash,
      roleId: superAdminRole.id,
      isActive: true,
    },
  });

  const humasUser = await prisma.user.upsert({
    where: { email: 'humas@smkn1pakuanratu.sch.id' },
    update: {},
    create: {
      name: 'Tim Humas Vokasi',
      email: 'humas@smkn1pakuanratu.sch.id',
      passwordHash: defaultPasswordHash,
      roleId: humasRole.id,
      isActive: true,
    },
  });

  // 3. 5 Program Keahlian
  const programsData = [
    {
      name: 'Agribisnis Tanaman (Pertanian)',
      slug: 'pertanian',
      tagline: 'Inovasi Pertanian Modern, Menopang Ketahanan Pangan Bangsa',
      shortDesc: 'Mencetak agropreneur tangguh yang menguasai teknologi budidaya tanaman pangan, hortikultura, hidroponik modern, dan manajemen agribisnis berkelanjutan.',
      fullDesc: 'Program Keahlian Agribisnis Tanaman di SMKN 1 Pakuan Ratu membekali siswa dengan kompetensi holistik mulai dari pengelolaan tanah presisi, teknik pembenihan unggul, budidaya tanaman pangan dan hortikultura ramah lingkungan, smart farming, hingga pascapanen dan pemasaran digital produk pertanian.',
      competencies: JSON.stringify([
        'Teknik Budidaya Tanaman Pangan & Hortikultura Modern',
        'Smart Farming & Sistem Otomasi Hidroponik/Greenhouse',
        'Pengelolaan Kesuburan Tanah & Pupuk Organik Mandiri',
        'Teknologi Pembenihan dan Kultur Jaringan Dasar',
        'Pengolahan Pascapanen & Digital Agribusiness Marketing'
      ]),
      careerProspects: JSON.stringify([
        'Wirausahawan Agribisnis (Agropreneur)',
        'Teknisi Perkebunan & Perusahaan Kelapa Sawit/Karet',
        'Supervisor Kebun Hortikultura & Greenhouse Modern',
        'Petugas Lapangan Penyuluh Pertanian (PPL)',
        'Quality Control Produk Pertanian & Distributor Agroindustri'
      ]),
      facilities: JSON.stringify([
        'Lahan Praktik Pertanian Terbuka 2 Hektar',
        'Smart Greenhouse Hortikultura Berbasis Sensor',
        'Laboratorium Uji Tanah & Nutrisi Tanaman',
        'Unit Pengolahan Pupuk Organik & Kompos Vokasi',
        'Gudang Penyimpanan Benih & Alat Mesin Pertanian (Alsintan)'
      ]),
      accentColor: '#10B981',
      iconName: 'Sprout',
      orderIndex: 1,
    },
    {
      name: 'Agribisnis Ternak (Peternakan)',
      slug: 'peternakan',
      tagline: 'Keahlian Peternakan Terpadu Berorientasi Bisnis dan Kesejahteraan Hewan',
      shortDesc: 'Menghasilkan tenaga profesional di bidang pemeliharaan ternak unggas dan ruminansia, formulasi pakan presisi, biosekuriti, serta wirausaha produk peternakan.',
      fullDesc: 'Program Keahlian Agribisnis Ternak mendidik siswa agar kompeten dalam manajemen peternakan komersial modern. Pembelajaran berfokus pada manajemen kandang terpadu, pencegahan penyakit ternak, inseminasi buatan dasar, formulasi pakan bernutrisi tinggi, hingga hilirisasi produk susu, telur, dan daging olahan.',
      competencies: JSON.stringify([
        'Manajemen Pemeliharaan Ternak Ruminansia (Sapi/Kambing)',
        'Manajemen Pemeliharaan Unggas Pedaging & Petelur Modern',
        'Teknik Formulasi & Pembuatan Pakan Ternak Konsentrat',
        'Penerapan Biosekuriti, Vaksinasi & Kesehatan Ternak',
        'Pengolahan Produk Hasil Ternak (Hilirisasi Produk)'
      ]),
      careerProspects: JSON.stringify([
        'Manajer/Supervisor Kandang Komersial (Farm Manager)',
        'Pengusaha Peternakan Mandiri (Livestock Entrepreneur)',
        'Tenaga Teknis Feedmill (Pabrik Pakan Ternak)',
        'Petugas Teknis Peternakan & Inseminator',
        'Mitra Usaha Kemitraan Ayam Broiler/Layer'
      ]),
      facilities: JSON.stringify([
        'Kandang Closed House Model Percobaan Unggas',
        'Kandang Ternak Ruminansia (Sapi & Kambing)',
        'Unit Pengolahan Pakan Ternak (Mixer & Pelletizer)',
        'Laboratorium Kesehatan Hewan Sederhana',
        'Instalasi Biogas dari Limbah Ternak Ramah Lingkungan'
      ]),
      accentColor: '#F59E0B',
      iconName: 'Beef',
      orderIndex: 2,
    },
    {
      name: 'Akuntansi dan Bisnis Digital',
      slug: 'akuntansi-bisnis-digital',
      tagline: 'Literasi Finansial Presisi & Transformasi Niaga Era Digital',
      shortDesc: 'Membentuk analis keuangan muda yang piawai mengoperasikan akuntansi berbasis cloud, perpajakan, audit digital, serta strategi e-commerce modern.',
      fullDesc: 'Program Keahlian Akuntansi dan Bisnis Digital mempersiapkan generasi unggul yang menguasai siklus akuntansi perusahaan jasa, dagang, dan manufaktur. Dilengkapi kurikulum perbankan mikro syariah/konvensional, aplikasi spreadsheet tingkat lanjut, software ERP akuntansi industri, dan tata kelola toko daring.',
      competencies: JSON.stringify([
        'Penyusunan Laporan Keuangan Manual & Komputerisasi Akuntansi',
        'Pengoperasian Software Akuntansi Industri (MYOB, Accurate, Spreadsheet)',
        'Perpajakan Terapan (PPh, PPN, dan e-Faktur)',
        'Administrasi Transaksi Perbankan & Lembaga Keuangan Mikro',
        'Analisis Data Penjualan Digital & Operasional Marketplace'
      ]),
      careerProspects: JSON.stringify([
        'Staf Akuntansi & Keuangan Perusahaan',
        'Customer Service / Teller Perbankan & BMT',
        'Staf Administrasi Perpajakan',
        'Spesialis Operasional E-Commerce & Toko Digital',
        'Pengelola Keuangan UMKM & Koperasi'
      ]),
      facilities: JSON.stringify([
        'Laboratorium Komputer Akuntansi Terkoneksi Jaringan',
        'Unit Simulasi Bank Mini Sekolah (School Mini-Bank)',
        'Software Akuntansi Resmi Standar Industri',
        'Pusat Inkubasi Bisnis Digital Siswa',
        'Perpustakaan Referensi Keuangan & Perpajakan'
      ]),
      accentColor: '#3B82F6',
      iconName: 'TrendingUp',
      orderIndex: 3,
    },
    {
      name: 'Desain Komunikasi Visual (DKV)',
      slug: 'dkv',
      tagline: 'Kreativitas Tanpa Batas, Visual yang Menyampaikan Pesan Berdaya Pikat',
      shortDesc: 'Mengembangkan talenta kreatif dalam desain grafis, ilustrasi digital, videografi, fotografi komersial, animasi 2D/3D, dan branding identitas.',
      fullDesc: 'Program Keahlian DKV SMKN 1 Pakuan Ratu memadukan kepekaan estetika seni dengan teknologi digital terkini. Siswa belajar menciptakan solusi visual komunikasi untuk industri periklanan, multimedia studio, agensi branding, hingga produksi konten kreatif digital berstandar industri komersial.',
      competencies: JSON.stringify([
        'Desain Identitas Visual, Tipografi, & Layout Editorial',
        'Ilustrasi Vektor & Digital Painting',
        'Fotografi Studio, Produk Komersial, & Lighting Outdoor',
        'Videografi, Sinematografi Kreatif, & Video Editing',
        'Animasi Grafis Gerak (Motion Graphic) & Desain UI/UX Dasar'
      ]),
      careerProspects: JSON.stringify([
        'Desainer Grafis / Visual Designer di Agensi Kreatif',
        'Videografer & Video Editor Profesional',
        'Fotografer Komersial & Produk',
        'Content Creator & Social Media Strategist',
        'Freelance Digital Illustrator & UI Designer'
      ]),
      facilities: JSON.stringify([
        'Studio Desain Komputer Grafis High-Spec',
        'Studio Fotografi & Videografi dengan Lighting Lengkap',
        'Drawing Tablet Display & Pen Tools untuk Siswa',
        'Peralatan Kamera Sinema mirrorless dan Audio Perekam Lapangan',
        'Galeri Display Karya Desain Kreatif Siswa'
      ]),
      accentColor: '#8B5CF6',
      iconName: 'Palette',
      orderIndex: 4,
    },
    {
      name: 'Teknik dan Bisnis Sepeda Motor (TBSM)',
      slug: 'tbsm',
      tagline: 'Keahlian Otomotif Presisi dan Tata Kelola Bengkel Modern',
      shortDesc: 'Menyiapkan mekanik handal berstandar Agen Pemegang Merek (APM), ahli diagnosis sistem injeksi PGM-FI, kelistrikan kendaraan, dan wirausaha bengkel.',
      fullDesc: 'Program Keahlian TBSM mendidik peserta didik untuk memiliki keterampilan teknis tinggi dalam pemeliharaan berkala, perbaikan mesin, chasis, sistem transmisi otomatis matic, sistem injeksi elektronik EFI, serta manajemen bisnis operasional bengkel sepeda motor modern.',
      competencies: JSON.stringify([
        'Perawatan Berkala Sepeda Motor Standar Industri',
        'Overhaul & Tune Up Mesin 4-Tak dan Matic Kontinu',
        'Diagnosis Trouble Kode Injeksi dengan Scanner Diagnostic Tool',
        'Perbaikan Sistem Kelistrikan Kendaraan & Sistem Pengisian',
        'Manajemen Bengkel Otomotif & Pelayanan Konsumen (Service Advisor)'
      ]),
      careerProspects: JSON.stringify([
        'Mekanik Handal di Bengkel Resmi Sepeda Motor',
        'Service Advisor (Penerima Servis) & Front Desk Bengkel',
        'Teknisi Perawatan Armada Perusahaan',
        'Wirausahawan Pemilik Bengkel Sepeda Motor Mandiri',
        'Petugas Gudang Suku Cadang (Sparepart Officer)'
      ]),
      facilities: JSON.stringify([
        'Bengkel Praktik TBSM Standar Industri APM',
        'Bike Lift Hidrolik & Diagnostic Tools EFI Scanner',
        'Special Service Tools (SST) Lengkap Tiap Station',
        'Ruang Pembongkaran Mesin (Engine Overhaul Station)',
        'Gudang Sparepart & Showroom Servis Simulasi'
      ]),
      accentColor: '#EF4444',
      iconName: 'Wrench',
      orderIndex: 5,
    },
  ];

  for (const prog of programsData) {
    await prisma.program.upsert({
      where: { slug: prog.slug },
      update: prog,
      create: prog,
    });
  }

  // 4. News Categories
  const categories = [
    { name: 'Prestasi & Prestisius', slug: 'prestasi', description: 'Capaian medali, kejuaraan, dan apresiasi siswa maupun guru SMKN 1 Pakuan Ratu.' },
    { name: 'Kegiatan Sekolah', slug: 'kegiatan-sekolah', description: 'Agenda akademik, ekstrakurikuler, dan kegiatan seru siswa.' },
    { name: 'Vokasi & Industri', slug: 'vokasi-industri', description: 'Kemitraan DUDI, magang kerja (PKL), dan kunjungan industri.' },
    { name: 'Kewirausahaan Siswa', slug: 'kewirausahaan', description: 'Produk karya nyata siswa dan gerakan Teaching Factory.' },
    { name: 'Pengumuman Resmi', slug: 'pengumuman-resmi', description: 'Edaran resmi, penerimaan siswa baru, dan informasi penting kedinasan.' },
  ];

  const catMap = new Map<string, string>();
  for (const cat of categories) {
    const createdCat = await prisma.newsCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    catMap.set(cat.slug, createdCat.id);
  }

  // 5. Initial News Articles
  const newsItems = [
    {
      title: 'Panen Raya Hortikultura Modern Siswa Pertanian SMKN 1 Pakuan Ratu Tarik Minat Industri Daerah',
      slug: 'panen-raya-hortikultura-modern-smkn-1-pakuan-ratu',
      categoryId: catMap.get('kewirausahaan')!,
      authorId: superAdminUser.id,
      summary: 'Siswa Program Keahlian Agribisnis Tanaman berhasil memanen lebih dari 1,5 ton melon golden hidroponik berkualitas premium melalui unit smart greenhouse sekolah.',
      content: `
        <p>SMKN 1 Pakuan Ratu kembali membuktikan keunggulan pembelajaran berbasis Teaching Factory (TEFA). Pada hari Kamis, siswa Program Keahlian Agribisnis Tanaman menggelar panen raya komoditas melon golden hidroponik di area greenhouse sekolah.</p>
        <h2>Keberhasilan Teknologi Pertanian Presisi</h2>
        <p>Kegiatan ini merupakan puncak dari siklus pembelajaran praktik selama 75 hari, di mana para peserta didik mengoperasikan sistem irigasi tetes otomatis dan pemupukan presisi berbasis sensor nutrisi.</p>
        <blockquote>"Kami mendidik siswa tidak hanya mencangkul tanah, tetapi memahami manajemen nutrisi tanaman dan teknologi smart farming modern sehingga mereka siap menjadi agropreneur mandiri," ujar Kepala Program Keahlian Pertanian.</blockquote>
        <p>Seluruh hasil panen telah dipesan oleh jejaring supermarket lokal dan pasar komersial di wilayah Way Kanan dan sekitarnya, dengan omzet penjualan yang dialokasikan kembali untuk pengembangan modal usaha wirausaha siswa.</p>
      `,
      thumbnailUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=800&auto=format&fit=crop',
      status: NewsStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Siswa DKV SMKN 1 Pakuan Ratu Borong Juara Lomba Desain Identitas Visual Tingkat Provinsi',
      slug: 'siswa-dkv-raih-juara-lomba-desain-provinsi',
      categoryId: catMap.get('prestasi')!,
      authorId: humasUser.id,
      summary: 'Tim Desain Komunikasi Visual menyabet Juara 1 dan Juara Favorit dalam ajang Festival Kreatif Vokasi Provinsi Lampung 2026.',
      content: `
        <p>Kabar membanggakan datang dari delegasi Program Keahlian Desain Komunikasi Visual (DKV) SMKN 1 Pakuan Ratu. Dalam kompetisi desain grafis dan branding tingkat provinsi yang diselenggarakan pekan lalu, siswa berhasil meraih penghargaan tertinggi.</p>
        <p>Karya yang diusung mengangkat perpaduan kearifan motif lokal Way Kanan dengan estetika desain kontemporer modern yang diaplikasikan pada kemasan produk UMKM kopi dan lada.</p>
        <p>Dewan juri mengapresiasi ketepatan riset audiens, pemilihan tipografi, dan konsistensi visual identity yang dinilai sangat matang dan siap pakai oleh pelaku industri.</p>
      `,
      thumbnailUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
      status: NewsStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Bengkel TBSM SMKN 1 Pakuan Ratu Luncurkan Layanan Servis Gratis Berkala untuk Warga Sekitar',
      slug: 'bengkel-tbsm-luncurkan-servis-gratis-berkala',
      categoryId: catMap.get('kegiatan-sekolah')!,
      authorId: humasUser.id,
      summary: 'Sebagai wujud bakti sosial dan asah kompetensi nyata, siswa TBSM memberikan perawatan gratis sepeda motor kepada lebih dari 100 pengendara.',
      content: `
        <p>Siswa Program Keahlian Teknik dan Bisnis Sepeda Motor (TBSM) menggelar bakti sosial servis motor gratis bagi masyarakat di lingkungan kecamatan Pakuan Ratu.</p>
        <p>Kegiatan ini didampingi langsung oleh mekanik instruktur bersertifikasi industri. Pemeriksaan mencakup tune up sistem injeksi, pengecekan busi, sistem rem, tegangan rantai, dan lampu penerangan.</p>
      `,
      thumbnailUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=800&auto=format&fit=crop',
      status: NewsStatus.PUBLISHED,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const n of newsItems) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: n,
      create: n,
    });
  }

  // 6. Announcements
  const announcements = [
    {
      title: 'Informasi Pra-Pendaftaran Peserta Didik Baru (PPDB) Vokasi Tahun Ajaran 2026/2027',
      slug: 'ppdb-vokasi-2026-2027',
      content: 'SMKN 1 Pakuan Ratu membuka kesempatan bagi lulusan SMP/MTs sederajat untuk bergabung di 5 Program Keahlian unggulan. Akses brosur dan informasi syarat pendaftaran melalui kanal resmi kami.',
      isUrgent: true,
      isActive: true,
      publishedAt: new Date(),
    },
    {
      title: 'Jadwal Pelaksanaan Uji Sertifikasi Kompetensi (USK) Siswa Tingkat Akhir',
      slug: 'jadwal-uji-sertifikasi-kompetensi-2026',
      content: 'Uji sertifikasi bersama Badan Nasional Sertifikasi Profesi (BNSP) dan Lembaga Sertifikasi Profesi (LSP) P1 akan dimulai pada minggu ketiga bulan ini.',
      isUrgent: false,
      isActive: true,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const a of announcements) {
    await prisma.announcement.upsert({
      where: { slug: a.slug },
      update: a,
      create: a,
    });
  }

  // 7. Events (Agenda)
  const events = [
    {
      title: 'Expo Vokasi & Bursa Kerja Khusus (BKK) Bersama Industri Mitra',
      slug: 'expo-vokasi-dan-bkk-2026',
      description: 'Pameran produk karya 5 program keahlian sekaligus rekrutmen kerja langsung oleh 15 perusahaan mitra terkemuka di bidang agribisnis, teknologi, dan manufaktur.',
      location: 'Aula Utama & Lapangan Terbuka SMKN 1 Pakuan Ratu',
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      status: 'UPCOMING',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Workshop Digital Marketing & E-Commerce untuk Siswa Akuntansi',
      slug: 'workshop-digital-marketing-akuntansi',
      description: 'Pelatihan intensif optimasi toko online dan sistem manajemen transaksi terpusat menghadirkan praktisi marketplace nasional.',
      location: 'Laboratorium Komputer Akuntansi Terpadu',
      startDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
      status: 'UPCOMING',
      imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
    },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: e,
      create: e,
    });
  }

  // 8. Achievements
  const achievements = [
    {
      title: 'Medali Emas LKS Tingkat Provinsi Bidang Desain Grafis',
      studentName: 'Ahmad Fauzi & Tim DKV',
      competition: 'Lomba Kompetensi Siswa (LKS) SMK Provinsi Lampung',
      level: 'Provinsi',
      category: 'Vokasi',
      year: 2026,
      description: 'Menampilkan desain sistem identitas visual komersial terbaik dengan penilaian fungsionalitas dan estetika tinggi.',
      photoUrl: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=800&auto=format&fit=crop',
      isFeatured: true,
    },
    {
      title: 'Juara 1 Inovasi Smart Farming Agribisnis Pemuda',
      studentName: 'Rina Marlina',
      competition: 'Pekan Inovasi Teknologi Tepat Guna Tingkat Daerah',
      level: 'Kabupaten',
      category: 'Akademik',
      year: 2025,
      description: 'Mengembangkan sistem pengairan hidroponik otomatis berbasis mikroprosesor surya murah untuk lahan kering.',
      photoUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=800&auto=format&fit=crop',
      isFeatured: true,
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.create({
      data: ach,
    });
  }

  // 9. Static Pages
  const pages = [
    {
      title: 'Sejarah Singkat SMKN 1 Pakuan Ratu',
      slug: 'sejarah',
      content: `
        <p>SMKN 1 Pakuan Ratu didirikan sebagai wujud komitmen menghadirkan pendidikan vokasi unggulan yang berpijak pada potensi agraris dan kebutuhan industri di Way Kanan, Lampung.</p>
        <p>Berawal dari semangat mencetak generasi muda yang mandiri, terampil, dan berkarakter, sekolah ini terus berkembang dengan melengkapi fasilitas praktik berstandar industri pada lima program keahlian: Pertanian, Peternakan, Akuntansi & Bisnis Digital, Desain Komunikasi Visual, dan Teknik & Bisnis Sepeda Motor.</p>
        <p>Kini, SMKN 1 Pakuan Ratu menjadi salah satu pusat keunggulan pendidikan kejuruan yang diakui atas kolaborasi eratnya dengan dunia usaha dan dunia industri (DUDI).</p>
      `,
      metaTitle: 'Sejarah SMKN 1 Pakuan Ratu - Berakar pada Potensi, Tumbuh ke Masa Depan',
      metaDesc: 'Sejarah perjalanan berdirinya SMK Negeri 1 Pakuan Ratu dalam mengembangkan pendidikan vokasi berkualitas di Way Kanan.',
    },
    {
      title: 'Visi dan Misi Sekolah',
      slug: 'visi-misi',
      content: `
        <h2>Visi Sekolah</h2>
        <p><strong>"Menjadi Sekolah Menengah Kejuruan yang Unggul, Berkarakter Luhur, Menguasai Teknologi, Berwawasan Lingkungan, dan Berdaya Saing Global Berlandaskan Potensi Daerah."</strong></p>
        <h2>Misi Sekolah</h2>
        <ol>
          <li>Menyelenggarakan proses pembelajaran vokasi berbasis kompetensi dan Teaching Factory berstandar industri.</li>
          <li>Membina karakter peserta didik yang beriman, bertaqwa, disiplin, berjiwa wirausaha, dan berintegritas tinggi.</li>
          <li>Mengembangkan potensi lokal di bidang pertanian, peternakan, ekonomi kreatif, dan teknik secara inovatif dan berkelanjutan.</li>
          <li>Memperluas kemitraan strategis dengan Dunia Usaha, Dunia Industri, dan Perguruan Tinggi.</li>
          <li>Menghasilkan lulusan yang siap kerja (Bekerja), siap melanjutkan pendidikan (Melanjutkan), maupun siap mendirikan usaha mandiri (Wirausaha) - BMW.</li>
        </ol>
      `,
      metaTitle: 'Visi dan Misi SMKN 1 Pakuan Ratu',
      metaDesc: 'Visi dan Misi resmi SMKN 1 Pakuan Ratu dalam memajukan kompetensi dan karakter peserta didik vokasi.',
    },
    {
      title: 'Sambutan Kepala Sekolah',
      slug: 'sambutan-kepala-sekolah',
      content: `
        <p><em>Assalamu’alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera untuk Kita Semua.</em></p>
        <p>Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas karunia dan rahmat-Nya. Selamat datang di laman resmi portal digital SMKN 1 Pakuan Ratu.</p>
        <p>Dunia pendidikan saat ini bergerak sangat dinamis seiring percepatan transformasi teknologi dan kebutuhan industri global. Di SMKN 1 Pakuan Ratu, kami memegang teguh filosofi <strong>"Berakar pada Potensi, Tumbuh Menuju Masa Depan"</strong>. Kami meyakini bahwa setiap anak memiliki bakat unik yang jika diasah melalui kejuruan yang tepat akan melahirkan karya luar biasa.</p>
        <p>Kami mengajak seluruh orang tua, calon siswa, alumni, dan mitra industri untuk bersama-sama bergandeng tangan memajukan pendidikan vokasi demi masa depan generasi penerus bangsa yang bermartabat.</p>
        <p><em>Wassalamu’alaikum Warahmatullahi Wabarakatuh.</em></p>
      `,
      metaTitle: 'Sambutan Kepala SMKN 1 Pakuan Ratu',
      metaDesc: 'Sambutan hangat Kepala Sekolah SMKN 1 Pakuan Ratu kepada seluruh sivitas akademika, mitra, dan masyarakat umum.',
    },
    {
      title: 'Struktur Organisasi Sekolah',
      slug: 'struktur-organisasi',
      content: `
        <p>Struktur tata kelola organisasi di SMKN 1 Pakuan Ratu dirancang untuk menjamin efektivitas manajemen mutu pendidikan kejuruan, akuntabilitas layanan administrasi, dan koordinasi terpadu antarprogram keahlian.</p>
        <ul>
          <li><strong>Kepala Sekolah</strong>: Penanggung jawab umum arah strategis dan mutu pendidikan.</li>
          <li><strong>Wakil Kepala Sekolah Bidang Kurikulum</strong>: Pengelolaan kurikulum merdeka dan sistem pembelajaran.</li>
          <li><strong>Wakil Kepala Sekolah Bidang Kesiswaan</strong>: Pembinaan karakter, kedisiplinan, dan ekstrakurikuler.</li>
          <li><strong>Wakil Kepala Sekolah Bidang Humas & Hubin</strong>: Kemitraan DUDI, praktik kerja lapangan (PKL), dan bursa kerja khusus.</li>
          <li><strong>Wakil Kepala Sekolah Bidang Sarana Prasarana</strong>: Pemeliharaan bengkel, laboratorium, dan lahan praktik.</li>
          <li><strong>Kepala Program Keahlian</strong>: Pengampu teknis kurikulum dan mutu 5 jurusan kejuruan.</li>
        </ul>
      `,
      metaTitle: 'Struktur Organisasi SMKN 1 Pakuan Ratu',
      metaDesc: 'Bagan dan deskripsi struktur organisasi kepemimpinan dan manajerial di SMKN 1 Pakuan Ratu.',
    },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // 10. Homepage Sections Default Configuration
  const homepageSections = [
    {
      sectionKey: 'hero',
      title: 'Tumbuh dari Akar. Melangkah ke Masa Depan.',
      subtitle: 'SMKN 1 Pakuan Ratu membentuk generasi vokasi unggul yang siap kerja, berkarakter mulia, menguasai teknologi, dan mandiri berwirausaha.',
      content: JSON.stringify({
        primaryCtaText: 'Jelajahi Sekolah',
        primaryCtaLink: '#profil-identitas',
        secondaryCtaText: 'Program Keahlian',
        secondaryCtaLink: '/program-keahlian',
        statsTag: 'Sekolah Pusat Keunggulan Vokasi Daerah',
      }),
      isVisible: true,
      orderIndex: 1,
    },
    {
      sectionKey: 'statistics',
      title: 'Angka & Dedikasi Kami',
      subtitle: 'Pencapaian nyata dalam mendidik dan mengantarkan putra-putri daerah menggapai cita-cita.',
      content: JSON.stringify([
        { label: 'Siswa Aktif', value: '750+', description: 'Generasi muda berdaya saing' },
        { label: 'Program Keahlian', value: '5', description: 'Jurusan vokasi unggulan' },
        { label: 'Mitra Industri Aktif', value: '45+', description: 'DUDI nasional & lokal' },
        { label: 'Tingkat Serapan Kerja', value: '88%', description: 'Bekerja, Kuliah, Wirausaha' },
      ]),
      isVisible: true,
      orderIndex: 2,
    },
  ];

  for (const hs of homepageSections) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: hs.sectionKey },
      update: hs,
      create: hs,
    });
  }

  // 11. General Settings
  const settings = [
    { key: 'school_name', value: 'SMK Negeri 1 Pakuan Ratu', type: 'string', group: 'general' },
    { key: 'school_tagline', value: 'Berakar pada Potensi, Tumbuh Menuju Masa Depan', type: 'string', group: 'general' },
    { key: 'school_address', value: 'Jl. Raya Pakuan Ratu, Kec. Pakuan Ratu, Kab. Way Kanan, Lampung 34762', type: 'string', group: 'contact' },
    { key: 'school_phone', value: '(0723) 567890', type: 'string', group: 'contact' },
    { key: 'school_email', value: 'info@smkn1pakuanratu.sch.id', type: 'string', group: 'contact' },
    { key: 'school_hours', value: 'Senin - Jumat: 07.15 - 15.45 WIB', type: 'string', group: 'contact' },
    { key: 'social_instagram', value: 'https://instagram.com/smkn1pakuanratu', type: 'string', group: 'social' },
    { key: 'social_youtube', value: 'https://youtube.com/@smkn1pakuanratu', type: 'string', group: 'social' },
    { key: 'social_facebook', value: 'https://facebook.com/smkn1pakuanratu', type: 'string', group: 'social' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: s,
      create: s,
    });
  }

  console.log('✅ Seeding database berhasil diselesaikan.');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
