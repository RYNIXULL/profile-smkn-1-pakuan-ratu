# Spesifikasi Antarmuka Pemrograman Aplikasi (REST API Documentation)

## Website Profil Resmi & CMS SMKN 1 Pakuan Ratu

Dokumen ini menyediakan referensi lengkap endpoint REST API yang disediakan oleh server backend SMKN 1 Pakuan Ratu.

---

## Standar Format Respon (Response Envelope)

Semua respon API mengembalikan format JSON standar:

### Respon Sukses
```json
{
  "success": true,
  "data": { ... },
  "message": "Operasi berhasil"
}
```

### Respon Error
```json
{
  "success": false,
  "message": "Pesan deskripsi kesalahan",
  "errors": [ ... ]
}
```

---

## 1. Modul Autentikasi (`/api/auth`)

| Metode | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Publik | Masuk akun pengelola CMS, menghasilkan httpOnly cookie & token |
| `POST` | `/api/auth/logout` | Terautentikasi | Keluar dari sesi dan menghapus cookie |
| `GET` | `/api/auth/me` | Terautentikasi | Mendapatkan data profil dan role pengguna saat ini |
| `POST` | `/api/auth/change-password` | Terautentikasi | Mengubah kata sandi akun |

---

## 2. Modul Publik (`/api/public`)

Endpoint publik dapat diakses tanpa token autentikasi. Dilengkapi *rate limiter* otomatis.

| Metode | Endpoint | Parameter Query | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/public/homepage` | - | Mengambil seksi beranda aktif (Hero, Statistik) |
| `GET` | `/api/public/settings` | - | Mengambil data kontak dan media sosial sekolah |
| `GET` | `/api/public/pages/:slug` | - | Mengambil konten halaman statis (Sejarah, Visi Misi, dll.) |
| `GET` | `/api/public/programs` | - | Mengambil daftar 5 program keahlian |
| `GET` | `/api/public/programs/:slug` | - | Mengambil detail program keahlian lengkap |
| `GET` | `/api/public/news` | `page`, `limit`, `category`, `search`, `featured` | Mengambil daftar berita berstatus PUBLISHED |
| `GET` | `/api/public/news/:slug` | - | Mengambil artikel berita lengkap dan menambah jumlah tayangan (*views*) |
| `GET` | `/api/public/news-categories` | - | Mengambil daftar kategori artikel |
| `GET` | `/api/public/events` | `upcoming` | Mengambil kalender kegiatan sekolah |
| `GET` | `/api/public/announcements` | - | Mengambil pengumuman resmi yang aktif |
| `GET` | `/api/public/achievements` | `level`, `category`, `year` | Mengambil daftar kejuaraan siswa |
| `GET` | `/api/public/teachers` | `staff` (boolean) | Mengambil direktori guru dan staf |
| `GET` | `/api/public/facilities` | `category` | Mengambil sarana dan fasilitas sekolah |
| `GET` | `/api/public/galleries` | - | Mengambil daftar album foto galeri |
| `GET` | `/api/public/galleries/:slug` | - | Mengambil foto-foto di dalam suatu album |
| `POST` | `/api/public/contact` | - | Mengirim pesan kontak pengunjung (Spam & Rate Protected) |

---

## 3. Modul Admin CMS (`/api/admin`)

Memerlukan login aktif. Dibatasi sesuai izin peran (RBAC).

### Dashboard & Ringkasan
- `GET /api/admin/dashboard/stats`: Menghitung total berita, agenda mendatang, prestasi, total media, dan log terbaru.

### Manajemen Berita (`/api/admin/news`)
- `GET /api/admin/news`: Daftar semua berita dengan filter status (`DRAFT`, `REVIEW`, `PUBLISHED`, `ARCHIVED`).
- `POST /api/admin/news`: Menulis berita baru.
- `GET /api/admin/news/:id`: Mengambil detail berita untuk diedit.
- `PATCH /api/admin/news/:id`: Memperbarui berita, status alur kerja, dan metadata SEO.
- `DELETE /api/admin/news/:id`: Menghapus berita.

### Media Library (`/api/admin/media`)
- `GET /api/admin/media`: Mengambil daftar berkas media terunggah.
- `POST /api/admin/media/upload`: Mengunggah satu atau beberapa foto (otomatis dikonversi ke WebP dan EXIF dibersihkan).
- `DELETE /api/admin/media/:id`: Menghapus berkas media fisik dan record basis data.

### Agenda & Kegiatan (`/api/admin/events`)
- `GET /api/admin/events`: Daftar semua agenda.
- `POST /api/admin/events`: Menambah agenda baru.
- `PATCH /api/admin/events/:id`: Mengubah jadwal atau status agenda.
- `DELETE /api/admin/events/:id`: Menghapus agenda.

### Pengumuman (`/api/admin/announcements`)
- `GET /api/admin/announcements`: Daftar pengumuman.
- `POST /api/admin/announcements`: Menerbitkan edaran pengumuman.
- `PATCH /api/admin/announcements/:id`: Memperbarui isi pengumuman.
- `DELETE /api/admin/announcements/:id`: Menghapus pengumuman.

### Prestasi Siswa (`/api/admin/achievements`)
- `GET /api/admin/achievements`: Daftar semua prestasi.
- `POST /api/admin/achievements`: Mencatat prestasi kejuaraan baru.
- `PATCH /api/admin/achievements/:id`: Mengubah data kejuaraan.
- `DELETE /api/admin/achievements/:id`: Menghapus catatan prestasi.

### Program Keahlian (`/api/admin/programs`)
- `GET /api/admin/programs`: Daftar seluruh jurusan.
- `PATCH /api/admin/programs/:id`: Memperbarui kurikulum, prospek kerja, dan media jurusan.

### Dewan Guru & Staf (`/api/admin/teachers`)
- `GET /api/admin/teachers`: Daftar guru & staf.
- `POST /api/admin/teachers`: Menambahkan tenaga pendidik baru.
- `PATCH /api/admin/teachers/:id`: Memperbarui data guru.
- `DELETE /api/admin/teachers/:id`: Menghapus data guru.

### Fasilitas Sekolah (`/api/admin/facilities`)
- `GET /api/admin/facilities`: Daftar sarana.
- `POST /api/admin/facilities`: Menambah fasilitas baru.
- `PATCH /api/admin/facilities/:id`: Mengubah detail fasilitas.
- `DELETE /api/admin/facilities/:id`: Menghapus fasilitas.

### Galeri & Album (`/api/admin/galleries`)
- `GET /api/admin/galleries`: Daftar album.
- `POST /api/admin/galleries`: Membuat album baru.
- `DELETE /api/admin/galleries/:id`: Menghapus album.

### Halaman Profil Statis & Homepage (`/api/admin/pages`, `/api/admin/homepage`)
- `GET /api/admin/pages`: Daftar 4 halaman statis sekolah.
- `PATCH /api/admin/pages/:id`: Mengedit teks sambutan, sejarah, visi misi, atau struktur.
- `GET /api/admin/homepage`: Mendapatkan seksi beranda.
- `PUT /api/admin/homepage/:key`: Memperbarui banner hero dan tombol CTA beranda.

### Kotak Masuk Pesan Pengunjung (`/api/admin/contacts`)
- `GET /api/admin/contacts`: Membaca seluruh pesan masuk.
- `PATCH /api/admin/contacts/:id/read`: Menandai pesan telah dibaca.
- `DELETE /api/admin/contacts/:id`: Menghapus pesan pengunjung.

### Pengguna, Audit Log, & Pengaturan (Khusus Super Admin)
- `GET /api/admin/users`: Daftar akun pengguna CMS.
- `POST /api/admin/users`: Mendaftarkan pengguna baru dengan role tertentu.
- `PATCH /api/admin/users/:id`: Mengubah role atau status akun.
- `DELETE /api/admin/users/:id`: Menghapus akun (dengan proteksi Super Admin terakhir).
- `GET /api/admin/roles`: Daftar pilihan role dan izin hak akses.
- `GET /api/admin/audit-logs`: Riwayat audit trail sistem.
- `GET /api/admin/settings`: Mengambil seluruh konfigurasi umum sekolah.
- `PUT /api/admin/settings`: Menyimpan pembaruan konfigurasi kontak dan media sosial sekolah.
