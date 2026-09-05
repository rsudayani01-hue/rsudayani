-- =====================================================
-- MIGRATION: Initial Schema HRbase rsudayani
-- Based on: HRbase Laravel App
-- Created: 2026-09-05
-- Author: Claude Code
-- =====================================================

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    
    -- Role-based access control
    role_type VARCHAR(50) DEFAULT 'user' CHECK (role_type IN ('super_admin', 'admin_kategori', 'admin_unit', 'user')),
    
    -- For admin_kategori & admin_unit
    kategori_nakes VARCHAR(50) NULL CHECK (kategori_nakes IN ('Dokter', 'Perawat', 'KTKL', 'Admin', 'Manajemen', 'Direksi')),
    unit_kerja VARCHAR(255) NULL,
    
    -- For user level (link to pegawai)
    pegawai_id BIGINT NULL REFERENCES pegawais(id) ON DELETE SET NULL,
    
    -- Status
    is_aktif BOOLEAN DEFAULT TRUE,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster role queries
CREATE INDEX idx_users_role_type ON users(role_type);
CREATE INDEX idx_users_kategori_nakes ON users(kategori_nakes);
CREATE INDEX idx_users_pegawai_id ON users(pegawai_id);

-- =====================================================
-- 2. PEGAWAI TABLE (Main Employee Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS pegawais (
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic Identity
    nik VARCHAR(50) UNIQUE,
    nip VARCHAR(50) NULL,
    nama VARCHAR(255) NOT NULL,
    
    -- Professional License (STR/SIP)
    str VARCHAR(100) NULL,
    masa_berlaku_str DATE NULL,
    sip VARCHAR(100) NULL,
    masa_berlaku_sip DATE NULL,
    
    -- Employment Category
    kategori_kepegawaian VARCHAR(100) NULL,
    kategori_nakes VARCHAR(50) NULL CHECK (kategori_nakes IN ('Dokter', 'Perawat', 'KTKL', 'Admin', 'Manajemen', 'Direksi')),
    status_kepegawaian VARCHAR(100) NULL CHECK (status_kepegawaian IN ('PNS', 'PPPK', 'PPPK Paruh Waktu BLUD', 'PPPK Paruh Waktu THL', 'BLUD', 'THL', 'Honorer', 'Kontrak')),
    
    -- Personal Info
    tempat_lahir VARCHAR(100) NULL,
    tanggal_lahir DATE NULL,
    jenis_kelamin VARCHAR(20) NULL CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
    agama VARCHAR(50) NULL CHECK (agama IN ('Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Khonghucu')),
    alamat_domisili TEXT NULL,
    
    -- Contact
    no_hp VARCHAR(20) NULL,
    email VARCHAR(255) NULL,
    
    -- Education
    pendidikan_terakhir VARCHAR(50) NULL CHECK (pendidikan_terakhir IN ('SMA', 'D3', 'D4/S1', 'Profesi', 'S2', 'Spesialis', 'Sub Spesialis', 'S3')),
    nama_institusi VARCHAR(255) NULL,
    tahun_lulus VARCHAR(10) NULL,
    
    -- Position & Unit
    jabatan VARCHAR(100) NULL,
    unit_kerja VARCHAR(255) NULL,
    
    -- Work Date
    tanggal_mulai_bekerja DATE NULL,
    
    -- Tax
    npwp VARCHAR(50) NULL,
    
    -- Digital Files (JSON array of file objects)
    -- Structure: [{"nama_berkas": "SK PNS", "file": "url"}]
    berkas_sk JSONB NULL DEFAULT '[]'::jsonb,
    berkas_pendidikan JSONB NULL DEFAULT '[]'::jsonb,
    berkas_pribadi JSONB NULL DEFAULT '[]'::jsonb,
    berkas_lainnya JSONB NULL DEFAULT '[]'::jsonb,
    
    -- Status
    is_aktif BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX idx_pegawais_nik ON pegawais(nik);
CREATE INDEX idx_pegawais_nip ON pegawais(nip);
CREATE INDEX idx_pegawais_nama ON pegawais(nama);
CREATE INDEX idx_pegawais_kategori_nakes ON pegawais(kategori_nakes);
CREATE INDEX idx_pegawais_unit_kerja ON pegawais(unit_kerja);
CREATE INDEX idx_pegawais_is_aktif ON pegawais(is_aktif);
CREATE INDEX idx_pegawais_status_kepegawaian ON pegawais(status_kepegawaian);


-- =====================================================
-- 3. UNIT KERJA TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS unit_kerjas (
    id BIGSERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    kategori_nakes VARCHAR(50) NOT NULL CHECK (kategori_nakes IN ('Dokter', 'Perawat', 'KTKL', 'Admin', 'Manajemen', 'Direksi')),
    kode VARCHAR(20) NULL,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_unit_kerjas_kategori ON unit_kerjas(kategori_nakes);

-- =====================================================
-- 4. RUANGAN TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ruangans (
    id BIGSERIAL PRIMARY KEY,
    unit_kerja_id BIGINT NOT NULL REFERENCES unit_kerjas(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    kode VARCHAR(20) NULL,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ruangans_unit_kerja ON ruangans(unit_kerja_id);

-- =====================================================
-- 5. SUB UNITS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS sub_units (
    id BIGSERIAL PRIMARY KEY,
    unit_kerja_id BIGINT NOT NULL REFERENCES unit_kerjas(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    kode VARCHAR(20) NULL,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sub_units_unit_kerja ON sub_units(unit_kerja_id);

-- =====================================================
-- 6. DIKLATS TABLE (Pelatihan/Diklat)
-- =====================================================
CREATE TABLE IF NOT EXISTS diklats (
    id BIGSERIAL PRIMARY KEY,
    pegawai_id BIGINT NOT NULL REFERENCES pegawais(id) ON DELETE CASCADE,
    
    -- Kategori Pelatihan
    kategori VARCHAR(100) NOT NULL CHECK (kategori IN (
        'Pelatihan Khusus',
        'Pelatihan Akreditasi',
        'IHT',
        'Sertifikasi',
        'Workshop',
        'Seminar',
        'Diklat',
        'Lainnya'
    )),
    
    -- KARS Topics (for Akreditasi category)
    kategori_kars VARCHAR(100) NULL CHECK (kategori_kars IN (
        'PMKP',
        'Etik RS',
        'BHD',
        'K3 dan Kebakaran',
        'MFK',
        'Hand Hygiene',
        'Hak dan Kewajiban Pasien & Keluarga',
        'BHD dan BHL',
        'K3',
        'B3',
        'PIC Data',
        'Sistem Informasi',
        'Pembersihan, desinfeksi, dan sterilisasi',
        'Outbreak',
        'APD',
        'Regulasi dan praktik program PPI',
        'POCT',
        'Skrining, pengkajian dan tatalaksana pasien risiko bunuh diri',
        'EWS',
        'Edukasi nyeri',
        'Sitostatik dispensing',
        'Medication error',
        'Komunikasi efektif',
        'Jejaring PONEK',
        'Stunting & wasting',
        'PPRA'
    )),
    
    -- Training Details
    nama_pelatihan VARCHAR(255) NULL,
    tanggal_pelatihan DATE NULL,
    penyelenggara VARCHAR(255) NULL,
    durasi VARCHAR(50) NULL,
    no_sertifikat VARCHAR(100) NULL,
    
    -- Certificate Files (JSON array)
    -- Structure: ["url1", "url2"]
    file_sertifikat JSONB NULL DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_diklats_pegawai_id ON diklats(pegawai_id);
CREATE INDEX idx_diklats_kategori ON diklats(kategori);
CREATE INDEX idx_diklats_kategori_kars ON diklats(kategori_kars);
CREATE INDEX idx_diklats_tanggal ON diklats(tanggal_pelatihan);


-- =====================================================
-- 7. SHIFT TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS shift_templates (
    id BIGSERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kode VARCHAR(10) NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    warna VARCHAR(20) DEFAULT '#3B82F6',
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 8. JADWAL DINAS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS jadwal_dinas (
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign Keys
    sub_unit_id BIGINT NOT NULL REFERENCES sub_units(id) ON DELETE CASCADE,
    pegawai_id BIGINT NOT NULL REFERENCES pegawais(id) ON DELETE CASCADE,
    shift_template_id BIGINT NOT NULL REFERENCES shift_templates(id) ON DELETE CASCADE,
    
    -- Schedule Details
    tanggal DATE NOT NULL,
    shift VARCHAR(50) NULL,
    keterangan TEXT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint: 1 pegawai, 1 sub_unit, 1 tanggal
    CONSTRAINT jadwal_dinas_unique UNIQUE (sub_unit_id, pegawai_id, tanggal)
);

CREATE INDEX idx_jadwal_dinas_sub_unit ON jadwal_dinas(sub_unit_id);
CREATE INDEX idx_jadwal_dinas_pegawai ON jadwal_dinas(pegawai_id);
CREATE INDEX idx_jadwal_dinas_tanggal ON jadwal_dinas(tanggal);

-- =====================================================
-- 9. ENABLE RLS (Row Level Security)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pegawais ENABLE ROW LEVEL SECURITY;
ALTER TABLE diklats ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_kerjas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ruangans ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE jadwal_dinas ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 10. RLS POLICIES
-- =====================================================

-- USERS: Only super_admin can see/edit all, others see their own
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Super admin can manage all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role_type = 'super_admin'
        )
    );

-- PEGAWAI: Based on role_type
CREATE POLICY "Super admin can view all pegawai" ON pegawais
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role_type = 'super_admin'
        )
    );

CREATE POLICY "Admin kategori can view their kategori" ON pegawais
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role_type = 'admin_kategori'
            AND users.kategori_nakes = pegawais.kategori_nakes
        )
    );

CREATE POLICY "Admin unit can view their unit" ON pegawais
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role_type = 'admin_unit'
            AND users.unit_kerja = pegawais.unit_kerja
        )
    );

CREATE POLICY "User can view own data" ON pegawais
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role_type = 'user'
            AND users.pegawai_id = pegawais.id
        )
    );

-- For INSERT/UPDATE/DELETE - same logic but require is_aktif = true
CREATE POLICY "Active pegawai visible" ON pegawais
    FOR SELECT USING (is_aktif = TRUE OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role_type = 'super_admin'
        )
    );

-- DIKLATS: Same role-based logic
CREATE POLICY "Diklats accessible based on role" ON diklats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid()
            AND (
                u.role_type = 'super_admin'
                OR (u.role_type = 'admin_kategori' AND EXISTS (
                    SELECT 1 FROM pegawais p 
                    WHERE p.id = diklats.pegawai_id AND p.kategori_nakes = u.kategori_nakes
                ))
                OR (u.role_type = 'admin_unit' AND EXISTS (
                    SELECT 1 FROM pegawais p 
                    WHERE p.id = diklats.pegawai_id AND p.unit_kerja = u.unit_kerja
                ))
                OR (u.role_type = 'user' AND diklats.pegawai_id = u.pegawai_id)
            )
        )
    );

-- =====================================================
-- 11. SEED DATA - Initial Categories
-- =====================================================

INSERT INTO unit_kerjas (nama, kategori_nakes, kode) VALUES
-- Dokter
('IGD', 'Dokter', 'DR-001'),
('Rawat Inap', 'Dokter', 'DR-002'),
('Rawat Jalan', 'Dokter', 'DR-003'),
-- Perawat
('ICU', 'Perawat', 'PR-001'),
('OK', 'Perawat', 'PR-002'),
('IGD Perawat', 'Perawat', 'PR-003'),
('Rawat Inap Perawat', 'Perawat', 'PR-004'),
('Rawat Jalan Perawat', 'Perawat', 'PR-005'),
-- KTKL
('Farmasi', 'KTKL', 'KT-001'),
('Laboratorium', 'KTKL', 'KT-002'),
('Radiologi', 'KTKL', 'KT-003'),
-- Admin
('loket', 'Admin', 'AD-001'),
(' kasir', 'Admin', 'AD-002'),
-- Manajemen
('Direksi', 'Manajemen', 'MN-001'),
('Komisaris', 'Manajemen', 'MN-002');

-- Shift Templates
INSERT INTO shift_templates (nama, kode, jam_mulai, jam_selesai, warna) VALUES
('Pagi', 'P', '07:00', '14:00', '#22C55E'),
('Siang', 'S', '14:00', '21:00', '#F59E0B'),
('Malam', 'M', '21:00', '07:00', '#3B82F6'),
('Libur', 'L', NULL, NULL, '#9CA3AF');

-- =====================================================
-- 12. CREATE UPDATED_AT TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pegawais_updated_at BEFORE UPDATE ON pegawais
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_unit_kerjas_updated_at BEFORE UPDATE ON unit_kerjas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ruangans_updated_at BEFORE UPDATE ON ruangans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sub_units_updated_at BEFORE UPDATE ON sub_units
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diklats_updated_at BEFORE UPDATE ON diklats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shift_templates_updated_at BEFORE UPDATE ON shift_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jadwal_dinas_updated_at BEFORE UPDATE ON jadwal_dinas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- MIGRATION COMPLETE
-- Run this in Supabase SQL Editor:
-- 1. Copy entire content of this file
-- 2. Paste in Supabase SQL Editor
-- 3. Click Run
-- =====================================================
