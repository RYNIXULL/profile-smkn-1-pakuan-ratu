LAPORAN PRAKTIKUM
DEMONSTRASI KOMPETENSI

Nama : Rafi Diandra Ardi A
NPM : 24781021
Kelas : Manajemen Informatika 5A

PROGRAM STUDI D3 MANAJEMEN INFORMATIKA
JURUSAN TEKNOLOGI INFORMASI
POLITEKNIK NEGERI LAMPUNG
2026

================================================================================

Kode Unit : J.620100.005.02
Judul Unit: Mengimplementasikan user interface

1. Pada gambar pertama menunjukkan tampilan halaman Beranda utama website SMK Negeri 1 Pakuan Ratu. Di bagian atas terdapat bilah navigasi (navbar) transparan bergaya glassmorphism (menggunakan kombinasi class bg-white/40, backdrop-blur-md, border-white/40, dan shadow-sm) yang memuat identitas logo sekolah serta tautan ke halaman-halaman utama (Beranda, Profil, Ekstrakurikuler, Berita, Galeri, dan Kontak). Di bagian bawahnya terdapat Hero Section dengan latar belakang gambar lingkungan sekolah yang dilengkapi dengan judul sambutan resmi, slogan kejuruan "Berakar pada Potensi, Tumbuh Menuju Masa Depan", dan tombol aksi (Call to Action) "Jelajahi Profil" serta "Program Keahlian".
2. Pada gambar kedua menunjukkan tampilan antarmuka yang menyajikan informasi secara terstruktur menggunakan desain berbasis kartu (card widget). Bagian ini menampilkan statistik data pokok sekolah (48 Tenaga Pendidik, 852 Siswa Aktif, dan 5 Program Keahlian) dengan ikon representatif dari pustaka Lucide React, cuplikan berita kegiatan terbaru, serta tabel informasi profil resmi pada halaman Profil Sekolah yang menyajikan data NPSN, status negeri, alamat, kecamatan, kabupaten, hingga daftar jurusan keahlian secara rapi dan transparan.
3. Pada gambar ketiga menunjukkan tampilan antarmuka ketika diakses melalui perangkat seluler (mobile). Desain antarmuka telah dibuat responsif penuh di mana menu navigasi horizontal disembunyikan dan dialihkan ke dalam ikon Hamburger Menu (ikon Menu dan X). Ketika ikon tersebut diklik, menu navigasi akan muncul (slide down/drawer) dan secara otomatis tertutup kembali setelah salah satu menu dipilih. Selain itu, seluruh umpan balik interaksi pengguna (seperti pengiriman pesan pada halaman kontak) ditampilkan menggunakan Custom Toast Notification dan Modal dialog, menggantikan dialog native alert bawaan browser.

================================================================================

Kode Unit : J.620100.010.01
Judul Unit: Menerapkan perintah eksekusi bahasa pemrograman berbasis teks, grafik, dan multimedia

1. Pada gambar pertama menunjukkan tampilan halaman website saat pengguna berinteraksi dengan elemen multimedia dan konten dinamis. Pada halaman ini saya mengimplementasikan animasi grafis dan interaksi visual di mana kartu berita dan ekstrakurikuler memberikan umpan balik saat kursor diarahkan (hover transition), serta galeri dokumentasi kegiatan sekolah yang dilengkapi fitur Lightbox interaktif, di mana pengguna dapat mengklik foto untuk menampilkan gambar beresolusi tinggi dalam modal tampilan penuh tanpa harus berpindah halaman.
2. Pada gambar kedua menunjukkan baris kode JavaScript/TypeScript pada komponen React yang mengeksekusi logika antarmuka dan penanganan event. Program membaca data array objek berita dan galeri, memproses penyaringan (filter) kategori kegiatan secara real-time, serta mengatur status buka-tutup (state management) modal lightbox multimedia. Seluruh proses dieksekusi secara dinamis di sisi klien (client-side) tanpa melakukan reload halaman penuh, sehingga memberikan pengalaman visual multimedia yang cepat dan responsif.

================================================================================

Kode Unit : J.620100.015.01
Judul Unit: Menyusun fungsi, file atau sumber daya pemrograman yang lain dalam organisasi yang rapi

1. Pada gambar pertama menunjukkan struktur folder dan file utama pada project website SMK Negeri 1 Pakuan Ratu yang saya susun berdasarkan fungsi dan tanggung jawab masing-masing secara modular. Saya memisahkan sumber daya project ke dalam direktori terstruktur, seperti folder assets untuk media gambar dan logo sekolah, components yang terbagi menjadi sub-folder layout (untuk Navbar dan Footer) serta ui (untuk Modal dan Toast), data untuk menyimpan berkas data statis JavaScript, dan layouts sebagai template pembungkus rute utama.
2. Pada gambar kedua menunjukkan direktori pages/public yang secara khusus mengelompokkan halaman-halaman rute mandiri website, seperti HomePage.tsx, ProfilPage.tsx, ProgramsPage.tsx, NewsPage.tsx, GalleriesPage.tsx, dan ContactPage.tsx. Pemisahan berkas halaman ini dari file root App.tsx dan main.tsx dilakukan agar struktur kode terorganisasi dengan rapi, memudahkan pemeliharaan program, dan mencegah terjadinya penumpukan kode pada satu file utama.

================================================================================

Kode Unit : J.620100.016.01
Judul Unit: Menulis kode dengan prinsip sesuai guidelines dan best practices

1. Pada gambar pertama menunjukkan konfigurasi styling pada file tailwind.config.js dan index.css yang saya tulis dengan memperhatikan kerapian, standar konvensi, dan penerapan best practices. Saya mengonfigurasi palet warna kustom institusi (forest green, emerald, dan slate) serta utility class Glassmorphism agar dapat digunakan secara konsisten di seluruh komponen antarmuka. Pendekatan ini memastikan kode styling bersih, terstandardisasi, dan mudah disesuaikan tanpa perlu menulis aturan CSS inline yang berulang.
2. Pada gambar kedua menunjukkan penulisan komponen React yang terstruktur dan mematuhi kaidah clean code. Saya menyusun kode dengan penamaan komponen berbasis PascalCase (seperti ProfilPage, NewsCard, dan StatCard), memecah antarmuka menjadi komponen-komponen reusable, menyertakan komentar dokumentasi fungsi, serta menerapkan standar modern dengan mengganti seluruh pemanggilan fungsi dialog primitif window.alert() menjadi Custom Toast Notification yang dirancang selaras dengan tema aplikasi.

================================================================================

Kode Unit : J.620100.017.02
Judul Unit: Mengimplementasikan pemrograman terstruktur

1. Pada gambar pertama menunjukkan kode JavaScript/TypeScript yang saya gunakan untuk menjalankan fitur penanda rute navigasi aktif (active link indicator). Program menjalankan serangkaian instruksi secara sekuensial dengan memanfaatkan hook useLocation atau komponen NavLink dari React Router. Program mendeteksi path URL yang sedang diakses, kemudian secara otomatis menambahkan class penanda aktif (warna latar kontras dan teks tegas) pada tombol menu yang bersangkutan.
2. Pada gambar kedua menunjukkan implementasi prinsip pemrograman terstruktur yang mencakup:
   - Runtunan (Sequence): Alur eksekusi aplikasi yang dimulai dari bootstrapping main.tsx, pembacaan konfigurasi rute di App.tsx, hingga proses rendering komponen ke DOM.
   - Pemilihan (Selection): Penerapan struktur kondisional (percabangan IF atau ternary operator) untuk mengatur visibilitas menu navigasi mobile serta pemilihan tab aktif pada halaman Profil Sekolah.
   - Perulangan (Repetition): Pemanfaatan metode iterasi array (.map()) untuk merender daftar warta berita, statistik data sekolah, dan dokumentasi foto galeri secara otomatis.
   - Modularisasi: Pemecahan logika dan antarmuka ke dalam fungsi-fungsi komponen terpisah agar alur logika program terstruktur dengan jelas.

================================================================================

Kode Unit : J.620100.019.02
Judul Unit: Menggunakan library atau komponen pre existing

1. Pada gambar pertama menunjukkan berkas konfigurasi dependensi package.json yang saya gunakan untuk mengintegrasikan library dan komponen pihak ketiga (pre-existing library). Saya memanfaatkan framework React dan React Router DOM untuk perutean Single Page Application (SPA), Tailwind CSS sebagai framework styling antarmuka responsif, serta library Lucide React untuk menyediakan kumpulan ikon vektor antarmuka beresolusi tinggi. Seluruh komponen tersebut sudah tersedia sebelumnya sehingga proses perancangan sistem menjadi efisien.
2. Pada gambar kedua menunjukkan hasil implementasi dari komponen pre-existing tersebut pada antarmuka website SMK Negeri 1 Pakuan Ratu. Ikon-ikon modern dari pustaka Lucide React (seperti ikon GraduationCap pada data guru, Users pada data siswa, BookOpen pada program keahlian, Award pada akreditasi, serta ikon Menu dan X pada navigasi mobile) berhasil diterapkan secara presisi menggantikan karakter emotikon biasa, berpadu dengan kelas utilitas Tailwind CSS untuk menghasilkan antarmuka sekolah yang berkinerja tinggi, responsif, dan bernilai estetika profesional.
