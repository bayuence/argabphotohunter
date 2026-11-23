# FourDigitalStudio — Creative Service Order Portal

Portal web pemesanan dan kustomisasi layanan kreatif visual untuk **FourDigitalStudio**. Sistem ini menyediakan antarmuka interaktif bagi calon klien untuk memilih paket layanan, mengisi spesifikasi teknis kebutuhan kreatif, dan mengirimkan ringkasan pesanan langsung ke admin studio via WhatsApp.

---

## 📌 Ringkasan Proyek

| Informasi | Detail |
| :--- | :--- |
| **Nama Proyek** | FourDigitalStudio Order App |
| **Kategori** | Creative Agency / Production Service Portal |
| **Integrasi Kontak** | WhatsApp Official (+62 831-8582-7551) |
| **Arsitektur** | Single Page Application (SPA) |
| **Target Deploy** | Static Web Hosting (Vercel / Netlify / Cloudflare Pages) |

---

## 🎨 Layanan yang Didukung

Aplikasi ini mengelola 4 lini layanan utama dengan form spesifikasi dinamis:

1. **Graphic Design** (Mulai Rp45.000)
   - Lingkup: Poster, logo, feed media sosial, jersey, spanduk, banner.
   - Form kustom: Pilihan dimensi/ukuran, orientasi, gaya visual, palet warna, elemen grafis, teks/copywriting wajib.
2. **Photography** (Mulai Rp150.000)
   - Lingkup: Dokumentasi acara, foto produk katalog, potret personal, wisuda, komunitas.
   - Form kustom: Tanggal & jadwal sesi, lokasi, estimasi durasi, mood/konsep visual.
3. **Videography** (Mulai Rp200.000)
   - Lingkup: Cinematic reel, after-movie, company profile, iklan produk.
   - Form kustom: Jadwal shooting, lokasi produksi, target durasi video, konsep & storyboard.
4. **UMKM Branding Bundling** (Mulai Rp250.000)
   - Lingkup: Paket terintegrasi logo, feed kit, banner, dan materi promosi UMKM.
   - Form kustom: Identitas merek, bidang industri, varian produk, warna brand, kebutuhan bundling.

---

## 🛠️ Stack Teknologi

- **Frontend**: React 18
- **Styling**: Tailwind CSS 3.4 (Custom Dark Luxury Palette & Glassmorphism)
- **Icons**: Lucide React
- **Build Tool**: Vite 6
- **Typography**: Plus Jakarta Sans & Space Grotesk

---

## 📂 Struktur Proyek

```text
argabphotohunter/
├── public/                 # Aset publik statis
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Header, identitas studio, & logo mark
│   │   ├── ServiceSelector.jsx # Kartu interaktif pemilihan layanan
│   │   ├── OrderForm.jsx       # Form reaktif & generator pesan WhatsApp
│   │   └── Footer.jsx          # Catatan hak cipta & branding footer
│   ├── data/
│   │   └── services.js         # Master data layanan, harga, & ikon
│   ├── App.jsx                 # Komponen root & pengelola state
│   ├── index.css               # Utilitas Tailwind & styling kustom
│   └── main.jsx                # Titik masuk aplikasi
├── index.html              # HTML shell & font definitions
├── tailwind.config.js      # Konfigurasi tema warna & font
├── vite.config.js          # Konfigurasi bundler Vite
└── package.json            # Daftar dependensi & npm scripts
```

---

## ⚙️ Skrip Proyek

```bash
# Menjalankan server pengembangan lokal
npm run dev

# Kompilasi aset produksi (output ke folder /dist)
npm run build

# Menjalankan preview dari hasil kompilasi produksi
npm run preview
```
