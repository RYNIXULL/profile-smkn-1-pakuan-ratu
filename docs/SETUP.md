# Panduan Instalasi & Pengaturan Lingkungan (Setup Guide)

## Website Profil Resmi & CMS SMKN 1 Pakuan Ratu

Dokumen ini menjelaskan langkah-langkah pengaturan lingkungan pengembangan (development) dan produksi (production) untuk sistem SMKN 1 Pakuan Ratu.

---

## 1. Prasyarat Sistem (Prerequisites)

Pastikan sistem operasi Anda telah terpasang perangkat lunak berikut:

- **Node.js**: Versi `>= 20.x` (Direkomendasikan Node.js 22 LTS atau 25+)
- **NPM**: Versi `>= 10.x`
- **MySQL Server**: Versi `>= 8.0`
- **Git**: Versi `>= 2.40`

---

## 2. Struktur Proyek Monorepo

```text
├── backend/                   # Node.js + Express + TypeScript + Prisma ORM
│   ├── src/
│   │   ├── config/            # Database & App Config
│   │   ├── middleware/        # Auth, RBAC, RateLimit, Sanitize, Upload
│   │   ├── routes/            # REST API Routes
│   │   ├── services/          # Business Logic Services
│   │   ├── utils/             # Argon2, JWT, Slug, Response Helpers
│   │   └── validators/        # Zod Schemas
│   └── tsconfig.json
├── database/
│   └── prisma/
│       ├── schema.prisma      # 16 Relational Models
│       └── seed.ts            # Realistic Seeding Script
├── frontend/                  # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/        # Glassmorphic UI Components, Layout, Navbar, Footer
│   │   ├── pages/             # Public & CMS Admin Pages
│   │   ├── stores/            # Toast Store, Auth Store
│   │   └── types/             # Frontend Types & DTOs
│   └── vite.config.ts
├── docs/                      # Dokumentasi Teknis Lengkap
├── .env.example               # Template Konfigurasi Aman
└── package.json               # Root Monorepo Orchestrator
```

---

## 3. Konfigurasi Lingkungan (.env)

Salin berkas `.env.example` menjadi `.env` di direktori utama:

```bash
cp .env.example .env
```

Sesuaikan nilai variabel berikut dengan kredensial server lokal Anda:

```env
# SERVER CONFIGURATION
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# DATABASE (MySQL 8)
# Ganti YOUR_PASSWORD dengan kata sandi MySQL lokal Anda
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/smkn1pakuanratu"

# SECURITY & AUTHENTICATION
# Gunakan string acak minimal 32 karakter
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
SESSION_SECRET=your_session_secret_for_signed_cookies_32_chars

# RATE LIMITING
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

> **PERINGATAN KEAMANAN**: Jangan pernah menambahkan berkas `.env` asli ke sistem kontrol versi Git/GitHub. Pastikan `.gitignore` tetap aktif.

---

## 4. Instalasi Dependensi

Dari root direktori proyek, jalankan:

```bash
npm run setup
```

Perintah di atas akan menginstal dependensi seluruh workspace (root, backend, dan frontend) serta membuat Prisma Client.

---

## 5. Migrasi & Pengisian Data Awal (Database Migration & Seeding)

1. Pastikan servis database MySQL Anda sedang berjalan.
2. Buat database kosong bernama `smkn1pakuanratu`:
   ```sql
   CREATE DATABASE smkn1pakuanratu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Lakukan sinkronisasi skema Prisma:
   ```bash
   npm run prisma:push
   ```
4. Jalankan script seeding untuk mengisi akun awal, 5 jurusan, berita dummy, agenda, fasilitas, dan konfigurasi sekolah:
   ```bash
   npm run prisma:seed
   ```

### Akun Awal Pengelola CMS (Hasil Seeding)

| Role | Email | Password Awal |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@smkn1pakuanratu.sch.id` | `Admin123!` |
| **Humas (Admin)** | `humas@smkn1pakuanratu.sch.id` | `Humas123!` |

*(Segera ganti kata sandi setelah Anda berhasil login pertama kali di panel `/admin/login`)*

---

## 6. Menjalankan Aplikasi Secara Bersamaan (Development Mode)

Cukup jalankan satu perintah dari root folder:

```bash
npm run dev
```

- **Backend API**: Berjalan di `http://localhost:5000/api`
- **Frontend Web & CMS**: Berjalan di `http://localhost:5173`
- **Proxy Vite**: Mengarahkan seluruh panggilan `/api/*` dan `/uploads/*` secara otomatis ke port `5000`.

---

## 7. Menjalankan Pengujian Otomatis (Automated Tests)

Untuk memvalidasi integritas logika hashing, JWT token, validator Zod, dan slug generator:

```bash
npm run test
```
