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
      imageUrl: '/images/pertanian.jpg',
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
      imageUrl: '/images/peternakan.jpg',
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
      imageUrl: '/images/akuntansi.jpg',
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
      imageUrl: '/images/dkv.jpg',
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
      imageUrl: '/images/tbsm.jpg',
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
      thumbnailUrl: '/images/pertanian.jpg',
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
      thumbnailUrl: '/images/dkv.jpg',
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
      thumbnailUrl: '/images/tbsm.jpg',
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
      imageUrl: '/images/campus.jpg',
    },
    {
      title: 'Workshop Digital Marketing & E-Commerce untuk Siswa Akuntansi',
      slug: 'workshop-digital-marketing-akuntansi',
      description: 'Pelatihan intensif optimasi toko online dan sistem manajemen transaksi terpusat menghadirkan praktisi marketplace nasional.',
      location: 'Laboratorium Komputer Akuntansi Terpadu',
      startDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
      status: 'UPCOMING',
      imageUrl: '/images/akuntansi.jpg',
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
      photoUrl: '/images/dkv.jpg',
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
      photoUrl: '/images/pertanian.jpg',
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
        <div class="mb-6 rounded-2xl overflow-hidden shadow-md">
          <img src="/images/campus.jpg" alt="Gedung Kampus SMKN 1 Pakuan Ratu" class="w-full h-72 sm:h-96 object-cover" />
        </div>
        <p>SMKN 1 Pakuan Ratu didirikan sebagai wujud komitmen luhur pemerintah dan masyarakat dalam menghadirkan pendidikan kejuruan bermutu tinggi yang berpijak pada potensi agraris dan kebutuhan industri daerah di Way Kanan, Lampung.</p>
        <p>Berawal dari semangat mencetak generasi muda yang mandiri, terampil, dan berkarakter, sekolah ini terus bertransformasi dengan melengkapi fasilitas laboratorium berstandar industri pada lima program keahlian unggulan: Agribisnis Tanaman, Agribisnis Ternak, Akuntansi & Bisnis Digital, Desain Komunikasi Visual, dan Teknik & Bisnis Sepeda Motor.</p>
        <p>Kini, SMKN 1 Pakuan Ratu berdiri kokoh sebagai salah satu Pusat Keunggulan Vokasi yang diakui luas atas keberhasilan kemitraan strategisnya dengan dunia usaha dan industri terkemuka.</p>
      `,
      metaTitle: 'Sejarah SMKN 1 Pakuan Ratu - Berakar Kuat, Tumbuh Hebat',
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
        <div class="flex flex-col md:flex-row gap-6 items-start mb-6 p-4 rounded-2xl bg-forest-50/60 border border-forest-100">
          <img src="/images/kepsek.jpg" alt="Drs. H. Mulyono, M.Pd. - Kepala Sekolah" class="w-44 h-56 rounded-xl object-cover shadow-sm flex-shrink-0" />
          <div class="space-y-1">
            <h3 class="text-lg font-bold text-gray-900">Drs. H. Mulyono, M.Pd.</h3>
            <p class="text-xs font-semibold text-emerald-800">Kepala Sekolah SMKN 1 Pakuan Ratu</p>
            <p class="text-xs text-gray-600 italic pt-2">"Pendidikan vokasi adalah jembatan emas yang menghubungkan bakat anak negeri dengan kemajuan peradaban dan kemandirian bangsa."</p>
          </div>
        </div>
        <p><em>Assalamu’alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera untuk Kita Semua.</em></p>
        <p>Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas karunia dan rahmat-Nya. Selamat datang di portal digital resmi SMKN 1 Pakuan Ratu.</p>
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
      title: 'Berakar Kuat, Tumbuh Hebat',
      subtitle: 'Pusat Keunggulan Pendidikan Vokasi Kabupaten Way Kanan membina generasi muda yang terampil, berkarakter mulia, dan siap berkarya nyata di dunia industri modern.',
      content: JSON.stringify({
        primaryCtaText: 'Jelajahi Sekolah',
        primaryCtaLink: '#identitas-sekolah',
        secondaryCtaText: '5 Program Keahlian',
        secondaryCtaLink: '/program-keahlian',
        statsTag: 'Pusat Keunggulan Pendidikan Vokasi Kabupaten Way Kanan',
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

  // 11. Teachers & Staff Seed
  const teachersData = [
    {
      name: 'Drs. H. Mulyono, M.Pd.',
      nip: '19680512 199403 1 004',
      position: 'Kepala Sekolah',
      subject: 'Manajemen Pendidikan Vokasi',
      photoUrl: '/images/kepsek.jpg',
      isStaff: false,
    },
    {
      name: 'Ir. Hendra Kusuma, S.Pt.',
      nip: '19750821 200212 1 002',
      position: 'Kepala Program Keahlian Peternakan',
      subject: 'Agribisnis Ternak Ruminansia & Unggas',
      photoUrl: '/images/peternakan.jpg',
      isStaff: false,
    },
    {
      name: 'Siti Rahmawati, S.P., M.Si.',
      nip: '19820315 200801 2 011',
      position: 'Kepala Program Keahlian Pertanian',
      subject: 'Smart Farming & Agribisnis Tanaman',
      photoUrl: '/images/pertanian.jpg',
      isStaff: false,
    },
    {
      name: 'Budi Prasetyo, S.Sn.',
      nip: '19881109 201402 1 003',
      position: 'Kepala Program Keahlian DKV',
      subject: 'Desain Komunikasi Visual & Multimedia',
      photoUrl: '/images/dkv.jpg',
      isStaff: false,
    },
    {
      name: 'Yudi Hermanto, S.T.',
      nip: '19860402 201101 1 008',
      position: 'Kepala Program Keahlian TBSM',
      subject: 'Teknik Sepeda Motor & Kelistrikan Otomotif',
      photoUrl: '/images/tbsm.jpg',
      isStaff: false,
    },
    {
      name: 'Dewi Lestari, S.E., M.Ak.',
      nip: '19890724 201503 2 005',
      position: 'Kepala Program Keahlian Akuntansi',
      subject: 'Akuntansi Keuangan & Bisnis Digital',
      photoUrl: '/images/akuntansi.jpg',
      isStaff: false,
    },
  ];

  for (const t of teachersData) {
    const existing = await prisma.teacher.findFirst({ where: { name: t.name } });
    if (existing) {
      await prisma.teacher.update({ where: { id: existing.id }, data: t });
    } else {
      await prisma.teacher.create({ data: t });
    }
  }

  // 12. Facilities Seed
  const facilitiesData = [
    {
      name: 'Smart Greenhouse Hortikultura Vokasi',
      category: 'Lab & Bengkel',
      description: 'Greenhouse modern dengan sistem kontrol nutrisi hidroponik otomatis untuk praktik budidaya tanaman hortikultura bernilai tinggi.',
      location: 'Area Lahan Praktik Pertanian',
      imageUrl: '/images/pertanian.jpg',
    },
    {
      name: 'Kandang Praktik Peternakan Terpadu',
      category: 'Lab & Bengkel',
      description: 'Fasilitas pemeliharaan ternak ruminansia dan unggas model closed house serta unit pengolahan pakan ternak mandiri.',
      location: 'Kompleks Teaching Factory Peternakan',
      imageUrl: '/images/peternakan.jpg',
    },
    {
      name: 'Studio Multimedia & Desain DKV',
      category: 'Lab & Bengkel',
      description: 'Studio berpendingin udara yang dilengkapi komputer spek tinggi, drawing tablet, kamera sinematografi, dan lighting studio.',
      location: 'Gedung Vokasi Lantai 2',
      imageUrl: '/images/dkv.jpg',
    },
    {
      name: 'Bengkel Resmi Sepeda Motor (TBSM)',
      category: 'Lab & Bengkel',
      description: 'Bengkel standar APM dengan bike lift hidrolik, diagnostic tools EFI, dan special service tools lengkap.',
      location: 'Gedung Bengkel Otomotif',
      imageUrl: '/images/tbsm.jpg',
    },
    {
      name: 'Laboratorium Komputer Akuntansi & Bank Mini',
      category: 'Ruang Belajar',
      description: 'Laboratorium komputer terkoneksi software akuntansi industri dan unit simulasi transaksi perbankan sekolah.',
      location: 'Gedung Teori Lantai 1',
      imageUrl: '/images/akuntansi.jpg',
    },
    {
      name: 'Gedung Kampus Utama & Lapangan Upacara',
      category: 'Penunjang',
      description: 'Gedung representatif bernuansa hijau dengan halaman upacara luas, tiang bendera, dan taman asri berwawasan lingkungan.',
      location: 'Plaza Utama SMKN 1 Pakuan Ratu',
      imageUrl: '/images/campus.jpg',
    },
  ];

  for (const f of facilitiesData) {
    const existing = await prisma.facility.findFirst({ where: { name: f.name } });
    if (existing) {
      await prisma.facility.update({ where: { id: existing.id }, data: f });
    } else {
      await prisma.facility.create({ data: f });
    }
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
