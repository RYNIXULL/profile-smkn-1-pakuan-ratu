# Platform Digital Resmi SMKN 1 Pakuan Ratu
### Website Profil Sekolah & Content Management System (CMS) Terintegrasi

> **Konsep Desain**: *"Berakar pada potensi, tumbuh menuju masa depan."*  
> Merepresentasikan SMKN 1 Pakuan Ratu sebagai institusi vokasi unggulan yang mentransformasikan potensi agrikultur dan teknologi lokal menuju masa depan digital berkelanjutan.

---

## 🏛️ Ikhtisar Proyek (Project Overview)

Platform ini adalah solusi digital terpadu *production-ready* yang mencakup:
1. **Website Profil Publik**: Portal informasi interaktif, berdesain editorial modern (*Modern Editorial + Natural + Vocational Futurism*) dengan sentuhan **Glassmorphism / Frosted Glass** (`bg-white/40 backdrop-blur-md border-white/40 shadow-sm`), tipografi elegan, dan performa tinggi.
2. **Integrated CMS (Content Management System)**: Panel admin lengkap untuk memudahkan staf sekolah non-programmer mengelola seluruh konten sekolah (berita, agenda, prestasi, foto galeri, 5 jurusan, direktori guru, halaman profil, dan banner beranda) tanpa perlu menyentuh kode program.

---

## 🚀 Fitur Unggulan Sistem

### 1. Modul Publik (Public Experience)
- **Beranda Interaktif**: Banner hero naratif, statistik sekolah dinamis, kartu interaktif 5 program keahlian vokasi, alur *storytelling* (Belajar -> Praktik -> Berkarya -> Berwirausaha -> Dunia Kerja), warta terpopuler, agenda mendatang, dan galeri kegiatan.
- **Halaman Profil Sekolah**: Tab konten Sambutan Kepala Sekolah, Sejarah, Visi & Misi, serta Struktur Organisasi.
- **5 Program Keahlian Unggulan**:
  1. *Agribisnis Tanaman (Pertanian)*: Modern smart farming & hidroponik.
  2. *Agribisnis Ternak (Peternakan)*: Bioteknologi pakan & kewirausahaan ternak.
  3. *Akuntansi & Bisnis Digital*: FinTech, perpajakan, dan e-commerce.
  4. *Desain Komunikasi Visual (DKV)*: Multimedia, branding visual, dan animasi.
  5. *Teknik & Bisnis Sepeda Motor (TBSM)*: Otomotif roda dua & diagnostik EFI.
- **Warta & Artikel Berita**: Filter kategori, pencarian artikel, counter jumlah tayangan (*views*), bagikan ke papan klip dengan notifikasi *toast* estetik.
- **Agenda & Kalender Pendidikan**: Kartu kalender visual dan informasi lokasi kegiatan.
- **Pengumuman Resmi**: Penanda edaran penting (*urgent badge*) dan tautan unduh dokumen dinas.
- **Prestasi & Kejuaraan**: Rekam jejak medali siswa dengan filter tingkat (Kabupaten, Provinsi, Nasional) dan kategori.
- **Dewan Guru & Tenaga Kependidikan**: Direktori pendidik bersertifikasi keahlian.
- **Fasilitas & Sarana**: Laboratorium, bengkel berstandar industri, dan fasilitas penunjang.
- **Galeri Foto & Dokumentasi**: Album kegiatan sekolah dengan tampilan *full-screen lightbox*.
- **Kontak & Pengaduan**: Formulir aspirasi terlindungi dari spam dan *rate limiting*.

### 2. Modul CMS Pengelola (Admin Experience)
- **Dashboard Ringkasan**: Kartu KPI statistik, pintasan aksi cepat, dan widget aktivitas audit log terkini.
- **Alur Kerja Berita (Workflow)**: Draf -> Ditinjau (Review) -> Diterbitkan (Published) -> Diarsipkan (Archived), sanitasi HTML otomatis, dan pengaturan metadata SEO.
- **Pustaka Media Teroptimasi (Media Library)**: Pengunggah multi-foto dengan konversi otomatis ke WebP, pembersihan metadata EXIF, dan pembuat tautan langsung.
- **Manajemen Agenda, Pengumuman, & Prestasi**: Antarmuka modal interaktif tanpa dialog alert JavaScript bawaan browser.
- **Editor Halaman Statis & Beranda**: Kustomisasi teks sambutan, visi-misi, serta banner hero beranda langsung dari antarmuka pengguna.
- **Keamanan & RBAC Berjenjang**:
  - `SUPER_ADMIN`: Akses penuh ke seluruh sistem, manajemen pengguna, audit trail, dan pengaturan umum sekolah.
  - `ADMIN` (Humas): Pengelolaan berita, agenda, pengumuman, prestasi, galeri, dan kontak.
  - `STAFF`: Pembuatan draf warta dan unggah media.
  - **Invarian Proteksi**: Pencegahan penghapusan akun Super Admin terakhir.

---

## 🛠️ Tumpukan Teknologi (Technology Stack)

| Lapisan | Teknologi |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite 6 |
| **Desain & Gaya** | Tailwind CSS 3, Glassmorphism utilities, Lucide React Icons |
| **Manajemen State** | TanStack React Query 5 (Server State), Zustand (Client State) |
| **Backend Framework** | Node.js (v20+ / v25+), Express 4, TypeScript |
| **ORM & Database** | Prisma ORM 6, MySQL 8 Server |
| **Keamanan & Auth** | Argon2id, JWT, HttpOnly Cookies, sanitize-html, express-rate-limit, Helmet |
| **Pemrosesan Gambar** | Sharp (WebP conversion, EXIF stripping, Dimension extraction) |
| **Pengujian Otomatis** | Vitest (Automated Unit Tests) |

---

## 📦 Memulai Proyek (Quick Start)

### 1. Klon Repositori & Persiapan
```bash
git clone <URL_REPO>
cd "profile smkn 1 pakuan ratu"
```

### 2. Salin Konfigurasi Lingkungan
```bash
cp .env.example .env
```
*(Sesuaikan kata sandi database MySQL lokal Anda pada variabel `DATABASE_URL`)*

### 3. Instalasi Otomatis & Seeding
```bash
npm run setup
npm run prisma:push
npm run prisma:seed
```

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
- Website Publik: `http://localhost:5173`
- Panel Login CMS: `http://localhost:5173/admin/login`
- Backend API: `http://localhost:5000/api`

### Kredensial Awal CMS (Seeded):
- **Super Admin**: `superadmin@smkn1pakuanratu.sch.id` | Kata Sandi: `Admin123!`
- **Humas**: `humas@smkn1pakuanratu.sch.id` | Kata Sandi: `Humas123!`

---

## 🧪 Validasi Kualitas & Pengujian Otomatis

Jalankan seluruh pengujian unit backend:
```bash
npm run test
```
*Hasil: 4 test suite, 10 skenario pengujian hashing kata sandi, token JWT, slug generator, dan validasi skema Zod lulus 100%.*

Jalankan validasi kompilasi bundle frontend:
```bash
npm --prefix frontend run build
```
*Hasil: Kompilasi TypeScript sukses tanpa peringatan tipe data dan berkas distribusi siap di-*deploy*.*

---

## 📚 Dokumentasi Teknis Lengkap

Untuk panduan mendalam, silakan baca berkas dokumentasi pada direktori `docs/`:
- [Panduan Instalasi & Pengaturan (SETUP.md)](file:///d:/proyek/profile%20smkn%201%20pakuan%20ratu/docs/SETUP.md)
- [Arsitektur Sistem & RBAC (ARCHITECTURE.md)](file:///d:/proyek/profile%20smkn%201%20pakuan%20ratu/docs/ARCHITECTURE.md)
- [Kebijakan Keamanan & Defense-in-Depth (SECURITY.md)](file:///d:/proyek/profile%20smkn%201%20pakuan%20ratu/docs/SECURITY.md)
- [Spesifikasi REST API (API.md)](file:///d:/proyek/profile%20smkn%201%20pakuan%20ratu/docs/API.md)
- [Skema Basis Data & ERD (DATABASE.md)](file:///d:/proyek/profile%20smkn%201%20pakuan%20ratu/docs/DATABASE.md)
- [Panduan Penyebaran Server Produksi (DEPLOYMENT.md)](file:///d:/proyek/profile%20smkn%201%20pakuan%20ratu/docs/DEPLOYMENT.md)

---

## ⚖️ Lisensi & Kepemilikan
Hak Cipta © 2026 **SMKN 1 Pakuan Ratu, Kabupaten Way Kanan, Provinsi Lampung**.  
Seluruh hak cipta dilindungi undang-undang.
