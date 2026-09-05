# 🔧 SUPABASE SETUP GUIDE
## Langkah Setup Supabase untuk RSI Undayani

---

## 1. 📝 Buat Akun Supabase

1. Buka [supabase.com](https://supabase.com)
2. Klik **"Start your project"**
3. Daftar dengan GitHub atau email
4. Verifikasi email jika perlu

---

## 2. 🆕 Buat Project Baru

1. Klik **"New Project"**
2. Isi detail project:
   - **Name:** `rsiundayani`
   - **Database Password:** (generate secure password, SIMPAN!)
   - **Region:** Singapore (terdekat dari Indonesia)
3. Klik **"Create new project"**
4. Tunggu 2 menit sampai project ready

---

## 3. 🔑 Dapatkan Credentials

1. Buka project Anda
2. Pergi ke **Settings** → **API**
3. Copy credentials berikut:

```
Project URL:     https://xxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **PENTING:** Simpan `service_role key` dengan AMAN! Jangan dishare!

---

## 4. 🗄️ Buat Database Tables

Buka **SQL Editor** di sidebar, lalu jalankan script berikut:

### 4.1 Enable UUID Extension
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 4.2 Buat Tabel Pegawai
```sql
CREATE TABLE IF NOT EXISTS pegawai (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nip VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telepon VARCHAR(20),
    departemen VARCHAR(100),
    posisi VARCHAR(100),
    tanggal_masuk DATE,
    status VARCHAR(50) DEFAULT 'Aktif',
    foto_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger untuk update timestamp otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pegawai_updated_at BEFORE UPDATE ON pegawai
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4.3 Buat Tabel Dokumen
```sql
CREATE TABLE IF NOT EXISTS dokumen (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pegawai_id UUID REFERENCES pegawai(id) ON DELETE CASCADE,
    nama_dokumen VARCHAR(255) NOT NULL,
    jenis VARCHAR(50) NOT NULL,
    cloudinary_url TEXT,
    cloudinary_id TEXT,
    size_bytes INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER update_dokumen_updated_at BEFORE UPDATE ON dokumen
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4.4 Buat Tabel Users
```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'pegawai',
    pegawai_id UUID REFERENCES pegawai(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. 🔒 Setup Row Level Security (RLS)

### 5.1 Enable RLS
```sql
ALTER TABLE pegawai ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumen ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### 5.2 Buat Policies

```sql
-- Policy untuk pegawai: Admin bisa CRUD, user lain bisa baca
CREATE POLICY "Admin can do anything with pegawai"
    ON pegawai
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated users can view pegawai"
    ON pegawai
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy untuk dokumen
CREATE POLICY "Admin can do anything with dokumen"
    ON dokumen
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view their own documents"
    ON dokumen
    FOR SELECT
    TO authenticated
    USING (pegawai_id IN (
        SELECT users.pegawai_id 
        FROM users 
        WHERE users.id = auth.uid()
    ));

-- Policy untuk users
CREATE POLICY "Users can view their own profile"
    ON users
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Admin can manage all users"
    ON users
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 6. 🧪 Test Database

Masukkan data dummy:

```sql
-- Insert sample pegawai
INSERT INTO pegawai (nip, nama, email, departemen, posisi, status)
VALUES 
    ('198501012010011001', 'Dr. Ahmad Wijaya', 'ahmad@rsiundayani.com', 'Dokter', 'Dokter Umum', 'Aktif'),
    ('198602152012012002', 'Siti Nurhaliza', 'siti@rsiundayani.com', 'Perawatan', 'Perawat', 'Aktif'),
    ('198703202013011003', 'Budi Santoso', 'budi@rsiundayani.com', 'Keuangan', 'Akuntan', 'Aktif');

-- Insert sample user (password: admin123)
-- Note: User dibuat dari Auth, bukan INSERT langsung
```

---

## 7. ⚙️ Setup Auth Settings

1. Pergi ke **Authentication** → **Settings**
2. Configure:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** `http://localhost:3000/*`
   - **Enable Sign Up:** Yes
   - **Enable Email Confirm:** Yes

---

## 8. 📋 Ringkasan

Setelah selesai, Anda akan punya:

| Item | Status | Catatan |
|------|--------|---------|
| Project URL | ✅ | https://xxxx.supabase.co |
| anon key | ✅ | Untuk frontend |
| service_role key | ✅ | Untuk backend/admin |
| Tabel pegawai | ✅ | Siap digunakan |
| Tabel dokumen | ✅ | Siap digunakan |
| Tabel users | ✅ | Siap digunakan |
| RLS Policies | ✅ | Keamanan aktif |

---

## ❓ Troubleshooting

### Error: "Row Level Security"
→ Pastikan RLS policies sudah dibuat dengan benar

### Error: "Permission denied"
→ Cek apakah menggunakan anon key yang benar

### Error: "Invalid JWT"
→ Pastikan token tidak expired, regenerate di Settings → API

---

**Last Updated:** 2026-09-05
