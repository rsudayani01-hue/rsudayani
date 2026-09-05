# 🎯 FASE KERJA: Migrasi HRbase Laravel → Next.js rsudayani

> **Target:** Buat aplikasi HR/Kepegawaian RSUD Adnyani selengkap HRbase Laravel

---

## 📅 FASE 1: Setup Database (Waktu: ~30 menit)

### Tujuan:
- Buat schema database di Supabase sesuai Laravel
- Enable RLS & Security

### Langkah:
```bash
1. Buka Supabase Dashboard → SQL Editor
2. Copy isi file: supabase/migrations/001_initial_schema.sql
3. Paste dan Run
```

### Checklist:
- [ ] Tabel `users` terbuat
- [ ] Tabel `pegawais` (40+ field) terbuat
- [ ] Tabel `unit_kerjas` terbuat (dengan seed data)
- [ ] Tabel `sub_units` terbuat
- [ ] Tabel `ruangans` terbuat
- [ ] Tabel `diklats` terbuat
- [ ] Tabel `shift_templates` terbuat (dengan seed data)
- [ ] Tabel `jadwal_dinas` terbuat
- [ ] RLS Policies aktif
- [ ] Trigger updated_at berfungsi

---

## 📅 FASE 2: Auth System (Waktu: ~1 jam)

### Tujuan:
- Login/Logout system
- Role-based access (Super Admin, Admin Kategori, Admin Unit, User)

### File yang perlu dibuat:
```
src/
├── contexts/
│   └── AuthContext.tsx          ← Auth state management
├── lib/
│   ├── supabase.ts              ← Supabase client (SUDAH ADA)
│   ├── roles.ts                ← Role utilities
│   └── dataProvider.ts         ← Refine data provider (SUDAH ADA)
├── components/
│   ├── ProtectedRoute.tsx       ← Route guard
│   ├── AdminLayout.tsx         ← Layout dengan sidebar
│   └── providers.tsx           ← Refine providers (SUDAH ADA)
└── app/
    └── (auth)/
        ├── login/page.tsx       ← Halaman login
        └── logout/page.tsx
```

### Langkah:
1. Buat `AuthContext.tsx` untuk manage auth state
2. Buat `lib/roles.ts` untuk cek role
3. Update `dataProvider.ts` untuk filter berdasarkan role
4. Buat `ProtectedRoute.tsx`
5. Update layout admin dengan sidebar menu
6. Buat halaman login

---

## 📅 FASE 3: Core CRUD - Pegawai (Waktu: ~2-3 jam)

### Tujuan:
- List Pegawai dengan search & filter
- Form Pegawai dengan Tab (Data Pribadi, Kepegawaian, Berkas)

### File yang perlu dibuat/update:
```
src/app/admin/pegawai/
├── page.tsx                    ← List (UPDATE - lengkap dari Laravel)
├── create/page.tsx             ← Create form
├── [id]/page.tsx              ← Detail + Edit
└── import/page.tsx            ← Import Excel
```

### Fitur:
- [ ] Tabel dengan kolom lengkap (sesuai Laravel)
- [ ] Search by nama, nik, nip
- [ ] Filter by unit_kerja, kategori_nakes, status_kepegawaian
- [ ] Form dengan Tab:
  - Tab 1: Data Pribadi
  - Tab 2: Kepegawaian & Profesi
  - Tab 3: Berkas Digital (Repeater)
- [ ] Upload file ke Supabase Storage
- [ ] Export Excel
- [ ] Import Excel

---

## 📅 FASE 4: CRUD - Unit Kerja & Sub Unit (Waktu: ~1 jam)

### File:
```
src/app/admin/unit-kerja/page.tsx
src/app/admin/sub-unit/page.tsx
```

### Fitur:
- [ ] CRUD Unit Kerja (nama, kategori_nakes)
- [ ] CRUD Sub Unit (terkait Unit Kerja)
- [ ] Filter by kategori

---

## 📅 FASE 5: CRUD - Diklat/Pelatihan (Waktu: ~1.5 jam)

### File:
```
src/app/admin/diklat/
├── page.tsx                    ← List
├── create/page.tsx             ← Create
└── [id]/page.tsx              ← Edit
```

### Fitur:
- [ ] List diklat dengan relasi ke pegawai
- [ ] Filter by kategori, kategori_kars
- [ ] Filter by rentang tahun
- [ ] Form dengan Select pegawai (searchable)
- [ ] Upload sertifikat

---

## 📅 FASE 6: Dashboard & Widgets (Waktu: ~1 jam)

### File:
```
src/app/admin/dashboard/page.tsx
src/components/widgets/
├── PegawaiStatsOverview.tsx
└── KarsStatsWidget.tsx
```

### Fitur:
- [ ] Stats Card: Total Pegawai Aktif
- [ ] Stats Card: Per Kategori Nakes
- [ ] KARS Widget: 8 Topik KARS dengan progress %

---

## 📅 FASE 7: Jadwal Dinas & Shift (Waktu: ~2 jam)

### File:
```
src/app/admin/shift-template/page.tsx
src/app/admin/jadwal-dinas/
├── page.tsx
├── create/page.tsx
└── jadwal/page.tsx
```

### Fitur:
- [ ] CRUD Shift Templates
- [ ] CRUD Jadwal Dinas
- [ ] View jadwal per tanggal/bulan
- [ ] Histori jadwal

---

## 📅 FASE 8: User Management (Waktu: ~1 jam)

### File:
```
src/app/admin/users/
├── page.tsx
├── create/page.tsx
└── [id]/page.tsx
```

### Fitur:
- [ ] CRUD User dengan role_type
- [ ] Link ke Pegawai (untuk user level)
- [ ] Filter by role_type

---

## 📅 FASE 9: Finishing & Polish (Waktu: ~1 jam)

### Checklist:
- [ ] Error handling lengkap
- [ ] Loading states
- [ ] Empty states
- [ ] Responsive design
- [ ] Test semua fitur
- [ ] Dokumentasi penggunaan

---

## 🗂️ Struktur Folder Target

```
rsudayani/
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    ← JALANKAN PERTAMA KALI
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── pegawai/
│   │   │   ├── unit-kerja/
│   │   │   ├── sub-unit/
│   │   │   ├── diklat/
│   │   │   ├── shift-template/
│   │   │   ├── jadwal-dinas/
│   │   │   └── users/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AdminLayout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── widgets/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── dataProvider.ts
│   │   ├── roles.ts
│   │   └── storage.ts
│   └── providers.tsx
├── FASE_KERJA.md
└── package.json
```

---

## 🚀 Urutan Pengerjaan (Start dari mana?)

### Rekomendasi:
1. **FASE 1** → Setup Database di Supabase (WAJIB pertama)
2. **FASE 2** → Auth System (biar bisa login)
3. **FASE 3** → Pegawai CRUD (fitur utama)
4. **FASE 4** → Unit Kerja
5. **FASE 5** → Diklat
6. **FASE 6** → Dashboard
7. **FASE 7** → Jadwal Dinas
8. **FASE 8** → User Management
9. **FASE 9** → Finishing

---

## ⚠️ Catatan Penting

1. **Database migration harus jalan duluan** sebelum coding UI
2. **Auth system** harus selesai sebelum CRUD pegawai
3. **Unit Kerja** harus ada datanya sebelum buat pegawai (karena foreign key)
4. **Supabase Storage bucket** perlu dibuat manual untuk upload file:
   - Bucket: `arsip-pegawai` (public)
   - Bucket: `arsip-diklat` (public)

---

## 📞 Kalau Stuck?

1. Cek file `supabase/migrations/001_initial_schema.sql` untuk schema lengkap
2. Cek folder `HRbase` Laravel untuk reference logic
3. Dokumentasi Refine.dev: https://refine.dev/docs/
4. Dokumentasi Ant Design: https://ant.design/components/overview/
