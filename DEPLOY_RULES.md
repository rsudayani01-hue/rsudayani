# 📋 Aturan Deploy ke Vercel

## 🔑 AKUN & BROWSER YANG BENAR

### ✅ WAJIB PAKAI:
- **Browser:** Mozilla Firefox (Chrome beda akun!)
- **Akun Vercel:** Login di browser Firefox
- **URL Dashboard:** https://vercel.com/rsudayani/rsudayani/deployments
- **Team/Account:** `rsudayani`
- **Project Name:** `rsudayani`

---

## ❌ YANG TIDAK BOLEH

### 1. Jangan Pakai `ssr: false` di Server Component
```tsx
// ❌ SALAH - error di Vercel
const AdminLayout = dynamic(
  () => import("@/components/admin/Layout"),
  { ssr: false }  // TIDAK BOLEH langsung di Server Component
);

// ✅ BENAR - wrap di Client Component
// buat file: AdminLayoutWrapper.tsx
"use client";
import dynamic from "next/dynamic";
const AdminLayout = dynamic(
  () => import("@/components/admin/Layout"),
  { ssr: false }
);
export default function AdminLayoutWrapper({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
```

### 2. Jangan Pakai Next.js 15.x
Next.js 15.0.x punya vulnerability - Vercel tolak.

```json
// ❌ SALAH
"next": "15.0.0"

// ✅ BENAR - pakai 14.2.x
"next": "14.2.21"
```

### 3. Jangan Hapus Folder `public/`
Vercel butuh folder ini untuk output.

---

## ✅ YANG WAJIB ADA

### 1. `RefineProvider` dengan QueryClientProvider
```tsx
// src/components/providers.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function RefineProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 2. Wrap di Root Layout
```tsx
// src/app/layout.tsx
import { RefineProvider } from "@/components/providers";

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <RefineProvider>
          {children}
        </RefineProvider>
      </body>
    </html>
  );
}
```

### 3. `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### 4. Folder `public/`
```bash
mkdir -p public
# atau buat file kosong: public/.gitkeep
```

---

## 🚀 LANGKAH DEPLOY (WAJIB IKUT URUTAN)

### **BROWSER: Mozilla Firefox**
⚠️ JANGAN pakai Chrome! Chrome beda akun Vercel!

### **Langkah 1:** Buka Vercel Dashboard
Buka di **Mozilla Firefox**: https://vercel.com/rsudayani/rsudayani/deployments

### **Langkah 2:** Buat Deploy Baru
1. Klik **"Add New..."** → **"Project"**
2. Pilih **"Import Git Repository"**
3. Cari repository: `rsudayani01-hue/rsudayani`
4. Klik **Import**

### **Langkah 3:** Configure Project
Biarkan default (Next.js auto-detect), scroll ke bawah

### **Langkah 4:** Set Environment Variables
Klik **"Environment Variables"** → Tambahkan:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bqbmladzagiqlhvehifx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxYm1sYWR6YWdpcWxodmVoaWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTIwODYsImV4cCI6MjEwNDE2ODA4Nn0.TlKVA9Ac4tqho1Xp2TIIKLbkjyHpJr2mbZ3-IGeXYHQ` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `o8gp3zvb` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `rsudayani_dokumen` |

### **Langkah 5:** Deploy
Klik **"Deploy"** → Tunggu ~3-5 menit

---

## 🔄 Alur Deploy yang Benar

```
1. Coding di local
       ↓
2. git add . && git commit -m "pesan"
       ↓
3. git push origin master
       ↓
4. Buka Mozilla Firefox → https://vercel.com/rsudayani/rsudayani
       ↓
5. Klik "Add New..." → "Project" → Import Git
       ↓
6. Import repository rsudayani01-hue/rsudayani
       ↓
7. Set Environment Variables
       ↓
8. Klik Deploy
       ↓
9. ✅ Berhasil!
```

---

## 🔧 Checklist Sebelum Push

- [ ] Folder `public/` ada
- [ ] `vercel.json` sudah benar
- [ ] `package.json` pakai Next.js `14.2.x`
- [ ] `RefineProvider` wrap children di `layout.tsx`
- [ ] Component yang pakai hooks (useLogout, useGetIdentity) pakai dynamic import dengan `ssr: false` di client component
- [ ] Tidak ada `ssr: false` langsung di Server Component
- [ ] Pakai **Mozilla Firefox** untuk deploy (bukan Chrome!)

---

## 🆘 Kalau Error

### "No QueryClient set"
→ Cek `RefineProvider` sudah wrap children di `layout.tsx`

### "ssr: false not allowed in Server Components"
→ Pindah dynamic import ke client component wrapper

### "Vulnerable version of Next.js"
→ Update ke Next.js 14.2.x: `npm install next@14.2.21`

### "No Output Directory named public"
→ Buat folder `public/`

### "Could not resolve host"
→ Cek koneksi internet

### "Wrong Account"
→ PASTIKAN PAKAI MOZILLA FIREFOX! Chrome beda akun!

---

## 📁 Struktur File yang Benar

```
rsudayani/
├── public/                    ← WAJIB ADA
├── vercel.json               ← WAJIB ADA
├── next.config.js
├── package.json               ← Next.js 14.2.x
├── src/
│   ├── app/
│   │   ├── layout.tsx         ← Wrap RefineProvider
│   │   └── admin/
│   │       ├── layout.tsx     ← Import AdminLayoutWrapper
│   │       └── dashboard/
│   │           └── page.tsx
│   └── components/
│       ├── providers.tsx     ← RefineProvider + QueryClientProvider
│       └── AdminLayoutWrapper.tsx  ← Client component dengan dynamic import
```

---

## 📝 Catatan Penting

- **Browser:** Mozilla Firefox (WAJIB)
- **Account:** rsudayani (Team)
- **Project:** rsudayani
- **GitHub:** rsudayani01-hue/rsudayani
