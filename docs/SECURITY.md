# Kebijakan & Implementasi Keamanan (Security Policy & Architecture)

## Website Profil Resmi & CMS SMKN 1 Pakuan Ratu

Dokumen ini menguraikan seluruh mekanisme pertahanan berlapis (*defense-in-depth*), standar penanganan kredensial, dan perlindungan data yang diimplementasikan pada sistem SMKN 1 Pakuan Ratu.

---

## 1. Aturan Ketat Pencegahan Kebocoran Kredensial (Git Leak Prevention)

Sistem mematuhi aturan keamanan repository secara mutlak:

- **Dilarang Keras Melakukan Commit Berkas Sensitif**: Berkas `.env`, `.env.*`, sertifikat privat (`*.pem`, `*.key`), backup database (`*.sql`), dan berkas log (`*.log`) telah dimasukkan ke dalam `.gitignore` wajib.
- **Penggunaan Template Konfigurasi**: Hanya berkas `.env.example` yang diizinkan berada di repository, dan hanya berisi nama variabel dengan nilai *placeholder* tanpa membocorkan nilai rahasia asli.
- **Tidak Menuliskan Secret di Kode Sumber**: Kunci JWT, kata sandi database, salt sesi, dan API key selalu dimuat dari `process.env`.
- **Penggunaan Data Uji Tiruan (Mock Data)**: Seluruh data pada skrip *seeding* dan *unit testing* menggunakan nama dan informasi buatan, bukan data pribadi peserta didik atau staf sekolah yang sebenarnya.

---

## 2. Autentikasi & Penyimpanan Kata Sandi (Password Hashing)

- **Algoritma Argon2id**: Kata sandi dienkripsi menggunakan fungsi hashing mutakhir **Argon2id** (pemenang Password Hashing Competition) yang tahan terhadap serangan GPU/ASIC dan serangan *side-channel*.
- **Mekanisme Fallback Bcrypt**: Dilengkapi *fallback* verifikasi berbasis Bcrypt untuk fleksibilitas migrasi sistem jika diperlukan.
- **Sesi Berbasis Token JWT & HttpOnly Cookie**:
  - Token sesi disimpan di dalam cookie peramban dengan opsi:
    - `httpOnly: true`: Mencegah akses token oleh skrip jahat di sisi klien (*Anti-XSS Session Theft*).
    - `secure: true` (pada mode produksi): Memastikan cookie hanya dikirim melalui jalur terenkripsi HTTPS.
    - `sameSite: 'lax'`: Memberikan proteksi terhadap serangan *Cross-Site Request Forgery* (CSRF).

---

## 3. Pencegahan Serangan Cross-Site Scripting (XSS Protection)

- **Sanitasi HTML di Sisi Server (`sanitize-html`)**:
  Setiap konten artikel berita atau halaman statis yang memuat tag HTML diperiksa oleh middleware `sanitizeNewsContent` sebelum disimpan ke basis data.
  - Skrip berbahaya seperti `<script>`, `<iframe>`, `javascript:`, dan event handlers (`onload`, `onerror`, `onclick`) secara otomatis dibersihkan dan dibuang.
  - Hanya tag pemformatan yang aman yang diizinkan (seperti `<p>`, `<strong>`, `<em>`, `<h3>`, `<ul>`, `<li>`, `<a>`, `<img>`).

---

## 4. Perlindungan Terhadap Brute-Force & Spam (Rate Limiting)

Sistem menerapkan pembatasan laju permintaan (*rate limiting*) menggunakan `express-rate-limit`:

1. **General API Limiter**: Membatasi seluruh panggilan API umum untuk mencegah *Denial of Service* (DoS).
2. **Strict Login Limiter**: Membatasi percobaan masuk akun maksimal **5 kali per 15 menit per IP address**. Upaya percobaan berulang setelah batas terlampaui akan ditolak dengan kode status HTTP `429 Too Many Requests`.
3. **Contact Form Spam Limiter**: Membatasi pengiriman formulir kontak maksimal **5 pesan per jam per IP** untuk mencegah *inbox flooding*.

---

## 5. Saluran Unggah Media Aman (Secure Media Upload Pipeline)

Unggahan media foto melalui panel CMS diproses melalui tahapan ketat:

1. **Pemeriksaan MIME Type**: Hanya berkas bertipe `image/jpeg`, `image/png`, dan `image/webp` yang diterima oleh middleware multer.
2. **Penyimpanan di Memori**: Berkas diunggah sementara ke memori RAM, bukan langsung ditulis ke *filesystem*, untuk mencegah eksekusi berkas *webshell* berbahaya.
3. **Pemrosesan Ulang dengan Sharp**:
   - Berkas di-render ulang secara ketat oleh pustaka **Sharp**.
   - **Pembersihan Metadata EXIF**: Menghilangkan koordinat GPS lokasi, merek perangkat, dan informasi pribadi juru kamera dari berkas gambar.
   - **Konversi ke WebP**: Mengoptimalkan ukuran dan memastikan struktur biner berkas adalah gambar valid, bukan skrip yang disamarkan.
4. **Penamaan Berkas UUID Acak**: Nama berkas asli diubah menjadi kode acak UUIDv4 kriptografis sehingga mencegah serangan *path traversal* (`../../`).

---

## 6. Perlindungan Injeksi Basis Data (SQL Injection Defense)

Sistem menggunakan **Prisma ORM** yang menerapkan *parameterized queries* dan *prepared statements* secara otomatis pada setiap operasi *query* ke MySQL. Pengguna tidak dapat menyuntikkan perintah SQL mentah ke dalam parameter masukan.

---

## 7. Audit Trail & Akuntabilitas (Audit Logging)

Seluruh aktivitas sensitif tercatat secara otomatis di dalam tabel `audit_logs`:
- Pengguna yang melakukan tindakan
- Jenis tindakan (`LOGIN`, `CREATE`, `UPDATE`, `DELETE`, `PUBLISH`, `UPLOAD`)
- Modul atau entitas yang dimodifikasi
- Waktu kejadian secara presisi
- Alamat IP dan *User-Agent* peramban
- Informasi ini dapat dipantau langsung oleh Super Admin pada menu `/admin/audit-logs`.
