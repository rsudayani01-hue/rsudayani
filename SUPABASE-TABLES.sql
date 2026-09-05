-- ============================================
-- RSI UNDAYANI - DATABASE TABLES
-- ============================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabel PEGAWAI
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

-- 3. Tabel DOKUMEN
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

-- 4. Tabel USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'pegawai',
    pegawai_id UUID REFERENCES pegawai(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Trigger untuk updated_at otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pegawai_updated_at 
    BEFORE UPDATE ON pegawai
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dokumen_updated_at 
    BEFORE UPDATE ON dokumen
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Enable Row Level Security
ALTER TABLE pegawai ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumen ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 7. Policies (Allow all authenticated users)
CREATE POLICY "Enable read for all authenticated users" ON pegawai
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for all authenticated users" ON pegawai
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for all authenticated users" ON pegawai
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for all authenticated users" ON pegawai
    FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read for all authenticated users" ON dokumen
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for all authenticated users" ON dokumen
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for all authenticated users" ON dokumen
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for all authenticated users" ON dokumen
    FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read for all authenticated users" ON users
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for all authenticated users" ON users
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for all authenticated users" ON users
    FOR UPDATE TO authenticated USING (true);

-- 8. Insert Data Sample (Opsional - hapus jika tidak perlu)
INSERT INTO pegawai (nip, nama, email, departemen, posisi, status, tanggal_masuk) VALUES 
    ('198501012010011001', 'Dr. Ahmad Wijaya', 'ahmad@rsiundayani.com', 'Dokter', 'Dokter Umum', 'Aktif', '2010-01-15'),
    ('198602152012012002', 'Siti Nurhaliza', 'siti@rsiundayani.com', 'Perawatan', 'Perawat', 'Aktif', '2012-01-20'),
    ('198703202013011003', 'Budi Santoso', 'budi@rsiundayani.com', 'Keuangan', 'Akuntan', 'Aktif', '2013-01-10'),
    ('198804252014011004', 'Diana Putri', 'diana@rsiundayani.com', 'IT', 'Staff IT', 'Aktif', '2014-01-05'),
    ('198905302015011005', 'Eko Prasetyo', 'eko@rsiundayani.com', 'HRD', 'Staff HRD', 'Aktif', '2015-01-15');

SELECT 'Database tables created successfully!' as status;
