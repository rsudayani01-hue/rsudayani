# 📋 Aturan Deploy ke Vercel

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

## 🔄 Alur Deploy yang Benar

```
1. Coding di local
       ↓
2. git add . && git commit -m "pesan"
       ↓
3. git push origin master
       ↓
4. Vercel auto-detect perubahan
       ↓
5. Vercel jalan: npm install
       ↓
6. Vercel jalan: npm run build
       ↓
7. Vercel deploy output/.next
       ↓
8. ✅ Berhasil!
```

---

## 🔧 Checklist Sebelum Push

- [ ] Folder `public/` ada
- [ ] `vercel.json` sudah benar
- [ ] `package.json` pakai Next.js `14.2.x`
- [ ] `RefineProvider` wrap children di `layout.tsx`
- [ ] Component yang pakai hooks (useLogout, useGetIdentity) pakai dynamic import dengan `ssr: false` di client component
- [ ] Tidak ada `ssr: false` langsung di Server Component

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
→ Cek koneksi internet, atau pakai token GitHub di remote URL

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
