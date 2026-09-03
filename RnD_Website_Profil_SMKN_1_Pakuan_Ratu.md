# r&d website profil smkn 1 pakuan ratu

## 1. judul penelitian dan pengembangan

**pengembangan website profil dan content management system (cms) smkn 1 pakuan ratu sebagai media informasi, publikasi, dan digitalisasi identitas sekolah**

---

## 2. latar belakang

perkembangan teknologi informasi mendorong institusi pendidikan untuk memiliki media digital yang mampu menyampaikan informasi secara cepat, akurat, menarik, dan mudah diperbarui. website sekolah tidak lagi hanya berfungsi sebagai media untuk menampilkan profil, tetapi juga sebagai pusat informasi mengenai kegiatan sekolah, program keahlian, prestasi, berita, agenda, fasilitas, serta berbagai aktivitas peserta didik.

smkn 1 pakuan ratu memiliki beberapa program keahlian, yaitu **pertanian, peternakan, akuntansi dan bisnis digital, dkv, serta tbsm**. keberagaman program keahlian tersebut menjadi salah satu identitas utama sekolah yang perlu ditampilkan secara menarik kepada masyarakat, calon peserta didik, orang tua, dunia usaha dan dunia industri, maupun pihak terkait lainnya.

permasalahan yang menjadi perhatian dalam pengembangan website adalah kebutuhan untuk memperbarui informasi secara mudah. apabila setiap perubahan berita, kegiatan, foto, pengumuman, maupun informasi sekolah harus dilakukan melalui perubahan kode program, proses pengelolaan website menjadi tidak efisien dan terlalu bergantung pada pengembang.

oleh karena itu, dikembangkan sebuah **website profil sekolah yang terintegrasi dengan content management system (cms)**. melalui cms tersebut, pihak sekolah dapat mengelola berita, agenda, pengumuman, prestasi, galeri, informasi jurusan, fasilitas, dan konten lainnya tanpa harus melakukan perubahan langsung terhadap kode sumber.

selain kemudahan pengelolaan, aspek keamanan juga menjadi bagian penting dalam pengembangan. website sekolah yang terhubung dengan internet harus memiliki perlindungan terhadap berbagai risiko seperti brute-force login, sql injection, cross-site scripting, manipulasi akses, penyalahgunaan upload file, kebocoran credential, serta serangan terhadap server.

berdasarkan kebutuhan tersebut, pengembangan diarahkan untuk menghasilkan website sekolah yang **modern, informatif, mudah dikelola, aman, responsif, dan memiliki identitas visual yang sesuai dengan karakter smkn 1 pakuan ratu.**

---

## 3. identifikasi masalah

1. informasi sekolah perlu disajikan melalui media digital yang lebih modern dan terstruktur.
2. informasi mengenai program keahlian perlu ditampilkan secara lebih menarik dan informatif.
3. pembaruan berita dan informasi tidak ideal apabila harus dilakukan melalui perubahan kode program.
4. pengelolaan foto dan dokumentasi kegiatan membutuhkan media management yang terorganisasi.
5. belum adanya sistem pengelolaan konten yang memungkinkan staf sekolah memperbarui informasi secara mandiri.
6. diperlukan pembagian hak akses antara administrator dan pengelola konten.
7. website publik membutuhkan perlindungan terhadap berbagai ancaman keamanan.
8. website harus dapat diakses dengan baik melalui desktop maupun perangkat mobile.

---

## 4. tujuan r&d

### tujuan umum

mengembangkan website profil digital smkn 1 pakuan ratu yang berfungsi sebagai pusat informasi dan publikasi sekolah sekaligus menyediakan sistem cms yang mudah digunakan oleh pihak sekolah.

### tujuan khusus

1. merancang website profil sekolah dengan ui/ux modern dan responsif.
2. menyediakan informasi lengkap mengenai identitas dan profil sekolah.
3. menampilkan lima program keahlian secara informatif.
4. menyediakan sistem pengelolaan berita dan informasi.
5. menyediakan sistem pengelolaan agenda sekolah.
6. menyediakan sistem pengelolaan prestasi siswa.
7. menyediakan media library untuk mengelola foto dan media dokumentasi.
8. menyediakan sistem pengelolaan galeri.
9. menyediakan sistem pengelolaan informasi guru, fasilitas, dan program keahlian.
10. menerapkan authentication dan authorization pada sistem admin.
11. menerapkan keamanan aplikasi pada sisi frontend, backend, database, dan media upload.
12. menyediakan sistem backup dan audit aktivitas administrator.
13. menghasilkan website yang dapat digunakan dan dikelola oleh pihak sekolah tanpa ketergantungan terhadap programmer.

---

## 5. konsep pengembangan

### tema: "berakar pada potensi, tumbuh menuju masa depan"

konsep ini menggambarkan identitas smkn 1 pakuan ratu sebagai sekolah vokasi yang mengembangkan potensi peserta didik melalui berbagai bidang keahlian.

secara visual, konsep menggabungkan:

- **alam dan agrikultur** → pertanian dan peternakan.
- **bisnis dan teknologi** → akuntansi dan bisnis digital.
- **kreativitas** → dkv.
- **teknologi dan keterampilan** → tbsm.
- **masa depan** → kesiapan kerja dan kewirausahaan.

gaya visual yang digunakan adalah **modern editorial + natural + vocational futurism**.

---

## 6. ruang lingkup produk

website terdiri dari dua bagian utama.

### a. website publik

pengunjung dapat mengakses:

```text
beranda
profil sekolah
program keahlian
guru & tenaga kependidikan
fasilitas
prestasi
berita
agenda
galeri
pengumuman
kontak
```

### b. admin cms

administrator dapat mengelola:

```text
dashboard
berita
pengumuman
agenda
prestasi
galeri
media library
program keahlian
guru
fasilitas
halaman sekolah
homepage
pengguna
audit log
pengaturan
```

---

## 7. research

tahap research dilakukan untuk memahami kebutuhan pengguna dan karakteristik sekolah.

### 7.1 riset informasi sekolah

data yang perlu dikumpulkan:

- nama dan identitas sekolah.
- sejarah.
- visi dan misi.
- sambutan kepala sekolah.
- struktur organisasi.
- program keahlian.
- data guru.
- fasilitas.
- prestasi.
- kegiatan sekolah.
- agenda.
- dokumentasi.
- alamat dan kontak.
- sosial media.
- informasi penerimaan peserta didik.

data publik dari sumber pemerintah dapat digunakan sebagai referensi awal, tetapi informasi yang akan dipublikasikan sebagai informasi resmi sebaiknya dikonfirmasi kepada pihak sekolah.

### 7.2 riset pengguna

target pengguna dibagi menjadi:

**pengunjung:**
- calon siswa.
- orang tua.
- siswa.
- alumni.
- masyarakat.
- dunia usaha/dunia industri.

**pengelola:**
- admin sekolah.
- humas.
- operator/pengelola konten.

### 7.3 analisis kebutuhan

pengunjung membutuhkan informasi yang cepat ditemukan, mudah dipahami, visual menarik, dan dapat diakses melalui perangkat apa pun.

pengelola sekolah membutuhkan sistem yang mudah digunakan untuk memperbarui konten tanpa harus memahami pemrograman.

---

## 8. development

pengembangan dilakukan secara bertahap.

### tahap 1 — information architecture

```text
homepage
│
├── profil
├── program keahlian
│   ├── pertanian
│   ├── peternakan
│   ├── akuntansi & bisnis digital
│   ├── dkv
│   └── tbsm
│
├── kehidupan sekolah
│   ├── kegiatan
│   ├── prestasi
│   └── galeri
│
├── berita
├── agenda
└── kontak
```

### tahap 2 — ui/ux design

fokus pada:

- responsive design.
- accessibility.
- typography.
- visual hierarchy.
- navigation.
- microinteraction.
- loading state.
- empty state.
- error state.
- mobile experience.

### tahap 3 — frontend

teknologi yang direkomendasikan:

```text
react
vite
typescript
tailwind css
framer motion
```

### tahap 4 — backend

```text
node.js
express
rest api
authentication
authorization
validation
rate limiting
```

### tahap 5 — database

database digunakan untuk menyimpan:

```text
users
roles
news
categories
announcements
events
achievements
programs
teachers
facilities
galleries
media
pages
audit_logs
```

### tahap 6 — media management

foto dan video tidak disimpan langsung sebagai data besar di database.

database menyimpan metadata:

```text
media_id
filename
url
mime_type
size
alt_text
uploaded_by
created_at
```

sedangkan file media disimpan pada media/object storage.

---

## 9. cms

fitur cms menjadi bagian utama dari r&d.

### workflow berita

```text
buat berita
     ↓
draft
     ↓
review
     ↓
publish
     ↓
website publik
```

admin dapat:

- membuat berita.
- mengedit berita.
- menghapus berita.
- menyimpan draft.
- menjadwalkan publikasi.
- menentukan kategori.
- menentukan thumbnail.

---

## 10. media library

media library memungkinkan admin:

- upload foto.
- upload beberapa foto sekaligus.
- melihat preview.
- membuat album.
- mencari media.
- menghapus media.
- menggunakan kembali foto pada artikel lain.

sehingga admin tidak perlu mengunggah foto yang sama berulang kali.

---

## 11. keamanan

keamanan dirancang menggunakan pendekatan **defense in depth**.

```text
cloudflare
    ↓
waf / ddos protection
    ↓
web server
    ↓
backend
    ↓
authentication
    ↓
authorization
    ↓
database
```

mekanisme yang diterapkan:

- https/tls.
- password hashing menggunakan argon2id atau bcrypt.
- http-only secure cookie/session.
- rate limiting.
- csrf protection.
- input validation.
- parameterized query.
- xss protection.
- security headers.
- upload validation.
- pembatasan ukuran file.
- role-based access control.
- database tidak diekspos langsung ke internet.
- secret menggunakan environment variable.
- audit log.
- backup database.

---

## 12. role management

sistem tidak memberikan seluruh akses kepada semua pengguna.

### super admin

memiliki akses ke seluruh sistem.

### admin/humas

mengelola:

- berita.
- pengumuman.
- agenda.
- galeri.
- prestasi.
- media.

### operator

mengelola data yang diberikan kewenangan oleh administrator.

dengan demikian, apabila akun salah satu pengelola mengalami masalah, aksesnya tetap terbatas.

---

## 13. pengujian

### functional testing

memastikan fungsi berikut berjalan:

```text
login ✓
logout ✓
create berita ✓
edit berita ✓
delete berita ✓
publish berita ✓
upload gambar ✓
buat agenda ✓
buat prestasi ✓
buat album ✓
```

### responsive testing

website diuji pada:

- desktop.
- laptop.
- tablet.
- smartphone.

### security testing

pengujian terhadap:

- sql injection.
- xss.
- csrf.
- brute-force.
- broken access control.
- upload file berbahaya.
- session security.
- exposed secret.
- api abuse.

### usability testing

melibatkan calon pengguna cms untuk melihat apakah staf sekolah dapat membuat dan menerbitkan berita tanpa bantuan programmer.

targetnya adalah **ya**.

---

## 14. hasil yang diharapkan

hasil akhir r&d adalah sebuah platform digital sekolah yang:

**untuk masyarakat:**  
cepat menemukan informasi sekolah.

**untuk calon siswa:**  
memahami program keahlian dan kehidupan sekolah.

**untuk sekolah:**  
memiliki identitas digital yang profesional.

**untuk humas/operator:**  
dapat memperbarui berita, foto, agenda, prestasi, dan informasi secara mandiri.

**untuk administrator:**  
memiliki sistem pengelolaan yang aman dengan kontrol akses dan audit aktivitas.

---

## 15. indikator keberhasilan

| indikator | target |
|---|---|
| website dapat diakses | 100% fungsi utama |
| responsive | desktop, tablet, mobile |
| cms | dapat digunakan staf non-programmer |
| berita | create, edit, publish, delete |
| media | upload dan management |
| agenda | create/edit/delete |
| prestasi | create/edit/delete |
| galeri | album dan media |
| authentication | aman dan tervalidasi |
| authorization | berdasarkan role |
| keamanan | tidak ditemukan kerentanan kritis |
| performa | waktu muat optimal |
| usability | pengguna dapat mengelola konten tanpa bantuan developer |

---

## 16. roadmap pengembangan

```text
fase 01
research & requirement
        ↓
fase 02
information architecture
        ↓
fase 03
ui/ux design
        ↓
fase 04
frontend development
        ↓
fase 05
backend + database
        ↓
fase 06
cms development
        ↓
fase 07
security implementation
        ↓
fase 08
testing
        ↓
fase 09
deployment
        ↓
fase 10
maintenance & evaluation
```

---

## 17. kesimpulan

r&d ini berfokus pada pengembangan website profil digital smkn 1 pakuan ratu yang tidak hanya menjadi media informasi sekolah, tetapi juga menjadi platform cms yang memungkinkan pihak sekolah mengelola seluruh informasi dan dokumentasi secara mandiri, mudah, terstruktur, dan aman.

website publik berperan sebagai wajah digital sekolah, sedangkan cms berfungsi sebagai sistem pengelolaan konten yang memungkinkan website terus diperbarui tanpa ketergantungan terhadap programmer. dengan pendekatan tersebut, website diharapkan dapat menjadi media informasi, publikasi, dokumentasi, dan representasi identitas digital smkn 1 pakuan ratu dalam jangka panjang.
