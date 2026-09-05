# ✅ TODO LIST
## Sistem Manajemen Data Pegawai RSI Undayani

---

## 📋 PHASE 1: PERSIAPAN

### Akun & Service
- [ ] Buat akun Supabase
- [ ] Buat project Supabase baru
- [ ] Buat akun Cloudinary
- [ ] Buat akun Vercel (atau connect ke GitHub)

### Repository Setup
- [ ] Inisialisasi Next.js project
- [ ] Install dependencies
- [ ] Setup Tailwind CSS
- [ ] Setup folder structure
- [ ] Buat .env.local dari .env.example

---

## 🔧 PHASE 2: DATABASE (Supabase)

### Tables Creation
- [ ] Enable UUID extension
- [ ] Buat tabel `pegawai`
- [ ] Buat tabel `dokumen`
- [ ] Buat tabel `users`
- [ ] Buat trigger untuk updated_at

### Security
- [ ] Enable Row Level Security
- [ ] Buat policies untuk pegawai
- [ ] Buat policies untuk dokumen
- [ ] Buat policies untuk users

### Auth Setup
- [ ] Konfigurasi Site URL
- [ ] Setup Redirect URLs
- [ ] Enable/Disable Sign Up
- [ ] Test login flow

### Initial Data
- [ ] Insert sample pegawai
- [ ] Verify data dengan SELECT query

---

## ☁️ PHASE 3: CLOUDINARY

### Setup
- [ ] Get Cloud Name
- [ ] Get API Key & Secret
- [ ] Buat Upload Preset
- [ ] Konfigurasi allowed formats
- [ ] Set max file size

### Integration
- [ ] Setup lib/cloudinary.ts
- [ ] Buat upload helper function
- [ ] Buat delete helper function
- [ ] Test upload flow

---

## 🎨 PHASE 4: FRONTEND SETUP

### Refine Integration
- [ ] Setup Refine provider
- [ ] Setup data provider (Supabase)
- [ ] Setup auth provider
- [ ] Setup router provider

### Layouts
- [ ] Buat AdminLayout
- [ ] Buat PublicLayout
- [ ] Setup Ant Design theme
- [ ] Setup navigation menu

### Authentication Pages
- [ ] Buat Login page
- [ ] Buat Register page
- [ ] Buat Forgot Password page
- [ ] Setup protected routes

---

## 👥 PHASE 5: CRUD PEGAWAI

### List Page
- [ ] Tampilkan semua pegawai
- [ ] Pagination
- [ ] Search functionality
- [ ] Filter by departemen
- [ ] Sort by nama/NIP

### Create Page
- [ ] Form dengan validasi
- [ ] Upload foto profil
- [ ] Save ke database
- [ ] Success/error feedback

### Detail Page
- [ ] Tampilkan detail pegawai
- [ ] Tampilkan list dokumen
- [ ] Quick actions (edit/delete)

### Edit Page
- [ ] Pre-filled form
- [ ] Update foto profil
- [ ] Save changes
- [ ] Success/error feedback

---

## 📄 PHASE 6: DOKUMEN MANAGEMENT

### Document Types
- [ ] Definisikan semua jenis dokumen
- [ ] Buat icon/mapping untuk setiap jenis
- [ ] Buat progress tracker

### Upload Feature
- [ ] Drag & drop upload
- [ ] Preview file
- [ ] Upload ke Cloudinary
- [ ] Save metadata ke Supabase
- [ ] Progress indicator

### Document List
- [ ] Tampilkan dokumen per pegawai
- [ ] Preview dokumen
- [ ] Download dokumen
- [ ] Delete dokumen
- [ ] Replace dokumen

---

## 📊 PHASE 7: DASHBOARD

### Statistics Cards
- [ ] Total Pegawai
- [ ] Total Dokumen
- [ ] Storage Used
- [ ] Dokumen Belum Lengkap

### Charts
- [ ] Pie Chart: Distribusi per Departemen
- [ ] Line Chart: Trend Upload per Bulan
- [ ] Bar Chart: Status Pegawai

### Alerts
- [ ] List pegawai dengan dokumen belum lengkap
- [ ] Warning untuk data yang perlu perhatian

---

## 🔐 PHASE 8: ROLE & PERMISSIONS

### Admin Features
- [ ] Super Admin: Full access
- [ ] Admin/HRD: Manage all data
- [ ] Block: Manage admin users

### Pegawai Features
- [ ] View own profile
- [ ] Edit own profile (limited fields)
- [ ] Upload own documents
- [ ] Cannot access other data

### Public Features
- [ ] View public profiles (if allowed)
- [ ] Limited information exposure

---

## 📤 PHASE 9: EXPORT

### PDF Export
- [ ] Export list pegawai ke PDF
- [ ] Export list dokumen ke PDF
- [ ] Template yang rapi

### Excel Export
- [ ] Export ke Excel format
- [ ] Multiple sheets support
- [ ] Styling headers

---

## 🌐 PHASE 10: PUBLIC WEBSITE

### Pages
- [ ] Homepage
- [ ] About/Tentang
- [ ] Kontak
- [ ] Pengumuman

### Portal
- [ ] Portal homepage
- [ ] My Profile
- [ ] My Documents
- [ ] My Uploads

---

## 🚀 PHASE 11: DEPLOYMENT

### Pre-Deploy
- [ ] Test semua fitur di local
- [ ] Fix semua bugs
- [ ] Optimize images
- [ ] Minify CSS/JS

### Vercel Deploy
- [ ] Connect GitHub repo
- [ ] Set environment variables
- [ ] Deploy
- [ ] Verify deployment

### Post-Deploy
- [ ] Test di production
- [ ] Setup custom domain
- [ ] Setup SSL
- [ ] Monitor errors

---

## 📞 PHASE 12: DOCUMENTATION & TRAINING

### Documentation
- [ ] User manual
- [ ] Admin manual
- [ ] API documentation
- [ ] README.md

### Training
- [ ] Buat video tutorial
- [ ] Siapkan slide presentasi
- [ ] Training session untuk admin
- [ ] Training session untuk user

---

## ✅ FINAL CHECKLIST

- [ ] Semua fitur berfungsi
- [ ] UI/UX sudah baik
- [ ] Tidak ada security issues
- [ ] Mobile responsive
- [ ] Performance optimal
- [ ] Backup strategy
- [ ] Monitoring setup
- [ ] Documentation complete
- [ ] Training complete

---

## 🎯 MILESTONES

| Milestone | Target | Status |
|-----------|--------|--------|
| Setup Complete | Day 0 | ⬜ |
| MVP (CRUD + Upload) | Day 1 | ⬜ |
| Dashboard + Stats | Day 2 | ⬜ |
| Export + Public Pages | Day 3 | ⬜ |
| Testing + Bug Fix | Day 3 | ⬜ |
| Deploy to Production | Day 4 | ⬜ |

---

**Progress:** 0%
**Last Updated:** 2026-09-05
**Estimated Time:** 3-4 hari
