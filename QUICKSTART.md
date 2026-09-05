# 🚀 QUICK START GUIDE
## RSI Undayani - Sistem Data Pegawai

---

## ⚡ Prerequisites

Pastikan Anda sudah punya:
1. ✅ Akun [Supabase](https://supabase.com)
2. ✅ Akun [Cloudinary](https://cloudinary.com)
3. ✅ Akun [Vercel](https://vercel.com)
4. ✅ Node.js 18+ terinstall

---

## 📦 Step 1: Clone & Install

```bash
# Clone repository (jika sudah ada)
git clone <repo-url>
cd RSUDAYANI

# Install dependencies
npm install
```

---

## 🔧 Step 2: Setup Environment

```bash
# Copy template
cp .env.example .env.local

# Edit dengan credentials Anda
nano .env.local
# atau
code .env.local
```

**Isi yang harus ada:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=rsudayani_dokumen
```

---

## 🗄️ Step 3: Setup Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Buat project baru
3. Pergi ke **SQL Editor**
4. Jalankan script dari `SUPABASE-SETUP.md`

---

## ☁️ Step 4: Setup Cloudinary

1. Buka [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy **Cloud Name**, **API Key**, **API Secret**
3. Buat Upload Preset:
   - Settings → Upload → Upload presets
   - Add upload preset
   - Signing Mode: **Unsigned**
   - Folder: `rsudayani/dokumen`

---

## ▶️ Step 5: Run Development Server

```bash
# Jalankan dev server
npm run dev

# Buka browser
# http://localhost:3000
```

---

## 🌐 Step 6: Deploy to Vercel

```bash
# Login Vercel
npx vercel login

# Deploy
npx vercel

# Set environment variables di Vercel Dashboard
# Settings → Environment Variables
```

---

## 📁 Struktur Project

```
RSUDAYANI/
├── .env.example          ← Template environment
├── .env.local            ← Environment (local)
├── README.md             ← Dokumentasi utama
├── PROJECT-PLAN.md       ← Rencana lengkap
├── SUPABASE-SETUP.md     ← Guide setup database
├── CLOUDINARY-SETUP.md   ← Guide setup storage
├── TODO.md               ← Checklist development
├── QUICKSTART.md         ← Panduan cepat (this file)
└── src/
    ├── app/              ← Next.js App Router
    ├── components/       ← Reusable components
    ├── lib/              ← Utilities & helpers
    ├── providers/        ← Refine providers
    └── pages/            ← Page components
```

---

## 🎯 Fitur Utama

| Fitur | URL | Keterangan |
|-------|-----|------------|
| Homepage | `/` | Landing page |
| Login | `/login` | Autentikasi |
| Admin Dashboard | `/admin/dashboard` | Statistik |
| List Pegawai | `/admin/pegawai` | CRUD pegawai |
| List Dokumen | `/admin/dokumen` | Kelola dokumen |
| Portal Pegawai | `/portal` | Akses pegawai |
| Profil Saya | `/portal/profil` | Profil sendiri |
| Dokumen Saya | `/portal/dokumen` | Dokumen sendiri |

---

## 🔐 Default Credentials (Development)

```
Admin:
- Email: admin@rsiundayani.com
- Password: admin123

Test User:
- Email: test@rsiundayani.com
- Password: test123
```

---

## ❓ Troubleshooting

### "Cannot connect to Supabase"
→ Cek `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### "Upload failed"
→ Cek Cloudinary credentials dan Upload Preset

### "Build failed"
→ Pastikan semua dependencies terinstall: `npm install`

### "Auth not working"
→ Cek Supabase Auth settings (Site URL, Redirect URLs)

---

## 📞 Need Help?

- 📖 Baca `README.md` untuk dokumentasi lengkap
- 📋 Cek `PROJECT-PLAN.md` untuk langkah detail
- ✅ Lihat `TODO.md` untuk checklist

---

**Happy Coding! 🎉**
