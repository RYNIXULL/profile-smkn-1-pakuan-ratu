# Panduan Penerapan Produksi (Production Deployment Guide)

## Website Profil Resmi & CMS SMKN 1 Pakuan Ratu

Dokumen ini menjelaskan prosedur instalasi dan penyebaran sistem ke lingkungan server produksi (*Virtual Private Server* / Cloud Server) berbasis Linux (Ubuntu 22.04 / 24.04 LTS).

---

## 1. Topologi Penyebaran (Deployment Topology)

```text
[ Internet / Pengunjung & Staf ]
               │
               ▼ (Port 80/443 HTTPS)
   ┌───────────────────────┐
   │    Nginx Web Server   │ ── TLS Termination & Static File Caching
   └───────────────────────┘
          │          │
          │          └──> Melayani Berkas Statis Frontend (/var/www/smkn1/frontend/dist)
          │
          ▼ Reverse Proxy (http://127.0.0.1:5000)
   ┌───────────────────────┐
   │    Node.js Backend    │ ── Dikelola oleh PM2 Process Manager (Cluster Mode)
   └───────────────────────┘
          │
          ▼
   ┌───────────────────────┐
   │    MySQL 8 Database   │ ── Dedicated Local/Managed Database Service
   └───────────────────────┘
```

---

## 2. Persiapan Server VPS

1. Perbarui paket server:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y curl git build-essential nginx mysql-server certbot python3-certbot-nginx
   ```
2. Pasang Node.js 22 LTS:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install -g pm2
   ```

---

## 3. Deployment Kode & Konfigurasi Basis Data

1. Clone repositori ke direktori `/var/www/smkn1`:
   ```bash
   git clone <URL_REPOSITORY_ANDA> /var/www/smkn1
   cd /var/www/smkn1
   ```
2. Buat berkas `.env` produksi di `/var/www/smkn1/.env`:
   ```env
   NODE_ENV=production
   PORT=5000
   APP_URL=https://smkn1pakuanratu.sch.id
   FRONTEND_URL=https://smkn1pakuanratu.sch.id
   DATABASE_URL="mysql://smkn1user:YOUR_STRONG_PASSWORD@localhost:3306/smkn1pakuanratu"
   JWT_SECRET="isi_dengan_string_acak_panjang_minimal_64_karakter"
   SESSION_SECRET="isi_dengan_string_acak_panjang_minimal_64_karakter"
   ```
3. Pasang dependensi dan bangun *production bundle*:
   ```bash
   npm run setup
   npm run prisma:push
   npm run prisma:seed
   npm run build
   ```

---

## 4. Konfigurasi PM2 Process Manager (Backend)

Buat berkas konfigurasi `ecosystem.config.js` di root folder:

```javascript
module.exports = {
  apps: [
    {
      name: 'smkn1-backend',
      cwd: './backend',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

Jalankan layanan:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 5. Konfigurasi Nginx & SSL Certbot

Buat berkas konfigurasi `/etc/nginx/sites-available/smkn1pakuanratu.conf`:

```nginx
server {
    server_name smkn1pakuanratu.sch.id www.smkn1pakuanratu.sch.id;

    # Static Frontend
    location / {
        root /var/www/smkn1/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy to Backend
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads Static Storage Proxy
    location /uploads/ {
        proxy_pass http://127.0.0.1:5000;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    client_max_body_size 10M;
}
```

Aktifkan konfigurasi dan pasang sertifikat SSL gratis dari Let's Encrypt:
```bash
sudo ln -s /etc/nginx/sites-available/smkn1pakuanratu.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d smkn1pakuanratu.sch.id -d www.smkn1pakuanratu.sch.id
```

---

## 6. Prosedur Pencadangan Terjadwal (Automated Backup)

Jadwalkan pencadangan harian basis data dan berkas media menggunakan cron job:

```bash
crontab -e
```

Tambahkan baris berikut (dijalankan setiap pukul 02:00 dini hari):
```text
0 2 * * * mysqldump -u smkn1user -p'YOUR_STRONG_PASSWORD' smkn1pakuanratu | gzip > /backup/db_$(date +\%F).sql.gz
0 3 * * * tar -czf /backup/media_$(date +\%F).tar.gz /var/www/smkn1/backend/uploads/
```
