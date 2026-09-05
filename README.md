# 🏥 Sistem Manajemen Data Pegawai - RSUDAYANI

## 📋 Deskripsi Proyek

Sistem manajemen data pegawai berbasis web untuk **RSUDAYANI (RSUDAYANI)** dengan fitur:
- CRUD data pegawai
- Upload & management dokumen
- Dashboard statistik
- Role-based access control
- Export laporan (PDF/Excel)

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│                    (Browser / Mobile)                            │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       VERCEL (Hosting)                          │
│                    Next.js 14 + Refine                          │
│  ┌─────────────────┐              ┌─────────────────────────┐   │
│  │  ADMIN PANEL    │              │    PUBLIC WEBSITE       │   │
│  │  /admin/*       │              │    /*                   │   │
│  └─────────────────┘              └─────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│      SUPABASE           │     │       CLOUDINARY            │
│  ┌───────────────────┐  │     │  ┌───────────────────────┐  │
│  │  PostgreSQL DB    │  │     │  │  File Storage         │  │
│  │  - Metadata       │  │     │  │  - PDF Documents      │  │
│  │  - Auth           │  │     │  │  - Images             │  │
│  └───────────────────┘  │     │  └───────────────────────┘  │
└─────────────────────────┘     └─────────────────────────────┘
```

---

## 👥 Role & Permissions

| Role        | Akses                              | Batasan                        |
|-------------|------------------------------------|--------------------------------|
| Super Admin | Full access                        | -                              |
| Admin/HRD   | Kelola pegawai & dokumen           | Tidak bisa kelola admin lain   |
| Pegawai     | Profil & dokumen sendiri           | Tidak bisa akses data lain     |
| Umum        | Lihat profil (sesuai izin)         | Tidak bisa akses admin panel   |

---

## 📂 Struktur Database

### Tabel: `pegawai`
| Kolom          | Tipe           | Deskripsi                |
|----------------|----------------|--------------------------|
| id             | UUID (PK)      | ID unik auto-generated   |
| nip            | VARCHAR(20)    | Nomor Induk Pegawai      |
| nama           | VARCHAR(255)   | Nama lengkap             |
| email          | VARCHAR(255)   | Email aktif              |
| telepon        | VARCHAR(20)    | No. HP                   |
| departemen     | VARCHAR(100)   | Unit kerja               |
| posisi         | VARCHAR(100)   | Jabatan                  |
| tanggal_masuk  | DATE           | Tanggal mulai kerja      |
| status         | VARCHAR(50)    | Aktif / Cuti / Pensiun   |
| foto_url       | TEXT           | Link foto (Cloudinary)   |
| created_at     | TIMESTAMP      | Waktu dibuat            |
| updated_at     | TIMESTAMP      | Waktu update            |

### Tabel: `dokumen`
| Kolom            | Tipe           | Deskripsi                |
|------------------|----------------|--------------------------|
| id               | UUID (PK)      | ID unik auto-generated   |
| pegawai_id       | UUID (FK)      | Reference ke pegawai     |
| nama_dokumen     | VARCHAR(255)   | Nama/judul dokumen       |
| jenis            | VARCHAR(50)    | KTP/Kontrak/Ijazah/dll  |
| cloudinary_url   | TEXT           | Link file Cloudinary     |
| cloudinary_id    | TEXT           | Public ID Cloudinary     |
| size_bytes       | INTEGER        | Ukuran file (bytes)      |
| created_at       | TIMESTAMP      | Waktu upload             |
| updated_at       | TIMESTAMP      | Waktu update             |

### Tabel: `users`
| Kolom      | Tipe           | Deskripsi                |
|------------|----------------|--------------------------|
| id         | UUID (PK)      | ID dari Supabase Auth    |
| email      | VARCHAR(255)   | Email (unik)             |
| role       | VARCHAR(20)    | admin/pegawai/umum       |
| pegawai_id | UUID (FK)      | Reference ke pegawai     |
| created_at | TIMESTAMP      | Waktu daftar             |

---

## 📄 Jenis Dokumen Pegawai

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│   KTP    │ │   KK     │ │ IJAZAH   │ │ KONTRAK  │ │SERTIFIKAT│
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  NPWP    │ │BPJS KES  │ │BPJS TK   │ │  SKCK    │ │PAS FOTO  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
... (total ~30 jenis dokumen)
```

---

## 🛠️ Teknologi

| Kategori       | Teknologi                          |
|----------------|------------------------------------|
| Frontend       | Next.js 14+ (App Router)           |
| Framework      | Refine                             |
| Database       | Supabase (PostgreSQL)              |
| Auth           | Supabase Auth                      |
| File Storage   | Cloudinary                         |
| Styling        | Tailwind CSS / Ant Design          |
| Charts         | Recharts / Chart.js                |
| Export         | jsPDF + xlsx                       |
| Hosting        | Vercel                             |

---

## 💰 Estimasi Biaya

| Layanan     | Free Tier        | Status      |
|-------------|------------------|-------------|
| Vercel      | 100 GB bandwidth | ✅ Cukup    |
| Supabase    | 500 MB storage   | ✅ Cukup    |
| Cloudinary  | 25 GB storage    | ✅ Cukup    |
| **Total**   |                  | **GRATIS!** |

---

## ⏱️ Timeline Development

| Hari | Target                              |
|------|-------------------------------------|
| 1    | MVP: Setup + CRUD + Upload          |
| 2    | Auth + Dashboard + Stats            |
| 3    | Export + Public Pages + Finishing   |

**Total: 2-3 hari**

---

## 📊 Fitur Utama

### Admin Panel (`/admin`)
- [ ] Dashboard statistik
- [ ] List semua pegawai
- [ ] Tambah/edit pegawai
- [ ] Kelola dokumen pegawai
- [ ] List semua dokumen
- [ ] Kelola user login
- [ ] Statistik & charts
- [ ] Export laporan
- [ ] Pengaturan sistem

### Public Website (`/`)
- [ ] Homepage
- [ ] Login/Register
- [ ] Profil pegawai
- [ ] Portal pegawai
- [ ] Kontak
- [ ] Pengumuman

---

## 📁 Isi Repository

```
RSUDAYANI/
├── README.md              ← Dokumentasi proyek
├── PROJECT-PLAN.md        ← Langkah kerja
├── SUPABASE-README.md     ← Setup database
├── CLOUDINARY-README.md   ← Setup storage
├── .env.example           ← Template environment variables
└── src/                   ← Source code (Next.js + Refine)
```

---

## 🚀 Cara Menjalankan

```bash
# 1. Clone repository
git clone <repo-url>
cd RSUDAYANI

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan credentials Anda

# 4. Jalankan development server
npm run dev
```

---

**Status: 📋 Perencanaan** (Belum dimulai)

*Created: 2026-09-05*
