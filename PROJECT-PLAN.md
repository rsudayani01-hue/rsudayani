# 📋 PROJECT PLAN
## Sistem Manajemen Data Pegawai RSI Undayani

---

## 📅 Tanggal: 2026-09-05
## 🎯 Status: PERENCANAAN

---

## 📝 LANGKAH KERJA (Step-by-Step)

### ═══════════════════════════════════════════════════════
### PHASE 1: PERSIAPAN & SETUP (Day 0)
### ═══════════════════════════════════════════════════════

#### Step 1.1: Buat Akun & Project
- [ ] Buat akun [Supabase](https://supabase.com) → Buat project baru
- [ ] Buat akun [Cloudinary](https://cloudinary.com) → Get credentials
- [ ] Buat akun [Vercel](https://vercel.com) → Connect repo

#### Step 1.2: Setup Repository
```bash
# 1. Inisialisasi project baru
mkdir RSUDAYANI && cd RSUDAYANI
npm create next-app@latest . --typescript --tailwind --eslint --app

# 2. Install dependencies
npm install @refinedev/core @refinedev/antd @refinedev/supabase
npm install antd @ant-design/icons
npm install @supabase/supabase-js cloudinary
npm install recharts jspdf xlsx
npm install -D tailwindcss postcss autoprefixer
```

#### Step 1.3: Setup Environment Variables
```bash
# Buat file .env.local
cp .env.example .env.local
```

Variables yang dibutuhkan:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

### ═══════════════════════════════════════════════════════
### PHASE 2: DATABASE & STORAGE (Day 0.5)
### ═══════════════════════════════════════════════════════

#### Step 2.1: Setup Supabase Database

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabel: pegawai
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

-- Tabel: dokumen
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

-- Tabel: users (profile dari Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'pegawai',
    pegawai_id UUID REFERENCES pegawai(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE pegawai ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumen ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies untuk admin (baca/tulis semua)
CREATE POLICY "Admin can read all pegawai" ON pegawai
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert pegawai" ON pegawai
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update pegawai" ON pegawai
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete pegawai" ON pegawai
    FOR DELETE USING (auth.role() = 'authenticated');

-- Policies untuk pegawai (baca/edit data sendiri)
CREATE POLICY "Users can read own profile" ON pegawai
    FOR SELECT USING (
        auth.uid() IN (SELECT users.id FROM users WHERE users.pegawai_id = pegawai.id)
    );
```

#### Step 2.2: Setup Cloudinary
```javascript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

---

### ═══════════════════════════════════════════════════════
### PHASE 3: FRONTEND - REFINE SETUP (Day 1)
### ═══════════════════════════════════════════════════════

#### Step 3.1: Setup Refine Provider
```typescript
// src/providers/refine.ts
import { Refine } from '@refinedev/core';
import { RefineAntDesign } from '@refinedev/antd';
import routerProvider from '@refinedev/react-router-v6';
import { BrowserRouter } from 'react-router-dom';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabaseClient: SupabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const App = () => {
    return (
        <BrowserRouter>
            <Refine
                routerProvider={routerProvider}
                dataProvider={dataProvider(supabaseClient)}
                authProvider={authProvider(supabaseClient)}
                resources={[
                    {
                        name: 'pegawai',
                        list: '/admin/pegawai',
                        show: '/admin/pegawai/:id',
                        create: '/admin/pegawai/create',
                        edit: '/admin/pegawai/:id/edit',
                    },
                    {
                        name: 'dokumen',
                        list: '/admin/dokumen',
                        show: '/admin/dokumen/:id',
                    },
                ]}
                options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                }}
            >
                {/* Routes */}
            </Refine>
        </BrowserRouter>
    );
};
```

#### Step 3.2: Create Admin Layout
```typescript
// src/components/layouts/AdminLayout.tsx
import { Layout, Menu } from 'antd';
import { 
    DashboardOutlined, 
    UserOutlined, 
    FileOutlined,
    SettingOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="dark">
                <div className="logo">RSI Undayani</div>
                <Menu theme="dark" mode="inline">
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        <Link to="/admin/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                        <Link to="/admin/pegawai">Pegawai</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<FileOutlined />}>
                        <Link to="/admin/dokumen">Dokumen</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: '0 16px', background: '#fff' }}>
                    Header
                </Header>
                <Content style={{ margin: '16px' }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
```

---

### ═══════════════════════════════════════════════════════
### PHASE 4: CRUD PEGAWAI (Day 1)
### ═══════════════════════════════════════════════════════

#### Step 4.1: Create Pegawai List Page
```typescript
// src/pages/admin/pegawai/list.tsx
import { List, Table, useTable } from '@refinedev/antd';
import { Table, Tag, Space, Button } from 'antd';
import { Link } from 'react-router-dom';

export const PegawaiList = () => {
    const { tableProps } = useTable<IPegawai>();

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="nip" title="NIP" />
                <Table.Column dataIndex="nama" title="Nama" />
                <Table.Column dataIndex="departemen" title="Departemen" />
                <Table.Column dataIndex="posisi" title="Posisi" />
                <Table.Column 
                    dataIndex="status" 
                    title="Status"
                    render={(status) => (
                        <Tag color={status === 'Aktif' ? 'green' : 'orange'}>
                            {status}
                        </Tag>
                    )}
                />
                <Table.Column
                    title="Aksi"
                    render={(_, record) => (
                        <Space>
                            <Link to={`/admin/pegawai/${record.id}`}>
                                Detail
                            </Link>
                            <Link to={`/admin/pegawai/${record.id}/edit`}>
                                Edit
                            </Link>
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
```

#### Step 4.2: Create Pegawai Form (Create/Edit)
```typescript
// src/pages/admin/pegawai/create.tsx
import { Create, useForm } from '@refinedev/antd';
import { Form, Input, Select, DatePicker, Upload } from 'antd';
import { useSelect } from '@refinedev/antd';

export const PegawaiCreate = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item label="NIP" name="nip" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Nama" name="nama" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Telepon" name="telepon">
                    <Input />
                </Form.Item>
                <Form.Item label="Departemen" name="departemen">
                    <Input />
                </Form.Item>
                <Form.Item label="Posisi" name="posisi">
                    <Input />
                </Form.Item>
                <Form.Item label="Status" name="status" initialValue="Aktif">
                    <Select>
                        <Select.Option value="Aktif">Aktif</Select.Option>
                        <Select.Option value="Cuti">Cuti</Select.Option>
                        <Select.Option value="Pensiun">Pensiun</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Create>
    );
};
```

---

### ═══════════════════════════════════════════════════════
### PHASE 5: UPLOAD DOKUMEN (Day 1-2)
### ═══════════════════════════════════════════════════════

#### Step 5.1: Create Upload Component
```typescript
// src/components/CloudinaryUpload.tsx
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

export const CloudinaryUpload = ({ 
    onSuccess, 
    onError 
}: { 
    onSuccess: (url: string, id: string) => void;
    onError: (error: Error) => void;
}) => {
    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'rsudayani_preset'); // Buat preset di Cloudinary
        
        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                formData
            );
            onSuccess(response.data.secure_url, response.data.public_id);
        } catch (error) {
            onError(error as Error);
        }
        
        return false; // Prevent default upload
    };

    return (
        <Upload beforeUpload={handleUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload ke Cloudinary</Button>
        </Upload>
    );
};
```

#### Step 5.2: Create Dokumen Management Page
```typescript
// src/pages/admin/pegawai/[id]/dokumen.tsx
import { useShow, useCustomMutation } from '@refinedev/core';
import { Card, List, Button, Upload, Tag, Space } from 'antd';
import { CloudinaryUpload } from '@/components/CloudinaryUpload';
import { FileOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';

const JENIS_DOKUMEN = [
    'KTP', 'KK', 'IJAZAH', 'KONTRAK', 'SERTIFIKAT', 
    'NPWP', 'BPJS_KES', 'BPJS_TK', 'SKCK', 'PAS_FOTO'
];

export const PegawaiDokumen = () => {
    const { queryResult } = useShow<IPegawai>();
    const { data: pegawai } = queryResult;
    const { mutate } = useCustomMutation();

    const handleUpload = (jenis: string, url: string, cloudinaryId: string) => {
        mutate({
            url: '/dokumen',
            method: 'post',
            values: {
                pegawai_id: pegawai?.data?.id,
                nama_dokumen: `${jenis} - ${pegawai?.data?.nama}`,
                jenis,
                cloudinary_url: url,
                cloudinary_id: cloudinaryId,
            },
        });
    };

    return (
        <div>
            <h2>Dokumen: {pegawai?.data?.nama}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {JENIS_DOKUMEN.map((jenis) => (
                    <Card 
                        key={jenis} 
                        title={jenis.replace('_', ' ')}
                        size="small"
                        actions={[
                            <CloudinaryUpload 
                                key="upload"
                                onSuccess={(url, id) => handleUpload(jenis, url, id)}
                                onError={(err) => console.error(err)}
                            />
                        ]}
                    >
                        <FileOutlined style={{ fontSize: 32 }} />
                        <p>Belum upload</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};
```

---

### ═══════════════════════════════════════════════════════
### PHASE 6: DASHBOARD & STATISTIK (Day 2)
### ═══════════════════════════════════════════════════════

#### Step 6.1: Create Dashboard with Charts
```typescript
// src/pages/admin/dashboard/index.tsx
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';
import { useCustom, useList } from '@refinedev/core';
import { PieChart, LineChart } from './charts'; // Buat komponen chart

export const Dashboard = () => {
    // Fetch statistics from Supabase
    const { data: totalPegawai } = useCustom({
        url: 'pegawai',
        method: 'get',
    });

    const { data: totalDokumen } = useCustom({
        url: 'dokumen',
        method: 'get',
    });

    return (
        <div>
            <h1>Dashboard RSI Undayani</h1>
            
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Pegawai"
                            value={totalPegawai?.length || 0}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Dokumen"
                            value={totalDokumen?.length || 0}
                            prefix={<FileOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Aktif"
                            value={50}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={12}>
                    <Card title="Distribusi per Departemen">
                        <PieChart data={departemenData} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Trend Upload Dokumen">
                        <LineChart data={uploadTrend} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
```

---

### ═══════════════════════════════════════════════════════
### PHASE 7: AUTHENTICATION (Day 2)
### ═══════════════════════════════════════════════════════

#### Step 7.1: Setup Auth Provider
```typescript
// src/providers/authProvider.ts
import { AuthProvider } from '@refinedev/core';
import { SupabaseClient } from '@supabase/supabase-js';

export const authProvider = (supabaseClient: SupabaseClient): AuthProvider => ({
    login: async ({ email, password }) => {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });
        if (error) return { success: false, error: error.message };
        return { success: true, redirectTo: '/admin/dashboard' };
    },
    logout: async () => {
        await supabaseClient.auth.signOut();
        return { success: true, redirectTo: '/login' };
    },
    check: async () => {
        const { data } = await supabaseClient.auth.getUser();
        if (!data.user) return { authenticated: false, redirectTo: '/login' };
        return { authenticated: true };
    },
    getPermissions: async () => {
        const { data } = await supabaseClient.auth.getUser();
        return data.user?.role || null;
    },
    getIdentity: async () => {
        const { data } = await supabaseClient.auth.getUser();
        if (!data.user) return null;
        return { name: data.user.email, avatar: '' };
    },
});
```

---

### ═══════════════════════════════════════════════════════
### PHASE 8: EXPORT & PUBLIKASI (Day 3)
### ═══════════════════════════════════════════════════════

#### Step 8.1: Export PDF/Excel
```typescript
// src/utils/export.ts
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const exportToPDF = (data: any[], filename: string) => {
    const doc = new jsPDF();
    doc.text('Laporan Data Pegawai RSI Undayani', 20, 10);
    
    // Add table
    let y = 20;
    data.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.nama} - ${item.departemen}`, 10, y);
        y += 10;
    });
    
    doc.save(`${filename}.pdf`);
};

export const exportToExcel = (data: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pegawai');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};
```

#### Step 8.2: Deploy ke Vercel
```bash
# 1. Push ke GitHub
git add .
git commit -m "Initial commit: RSI Undayani Employee Management System"
git push origin main

# 2. Import project di Vercel
# vercel.com → New Project → Import from GitHub

# 3. Set environment variables di Vercel Dashboard
# Settings → Environment Variables

# 4. Deploy!
```

---

## ═══════════════════════════════════════════════════════
## CHECKLIST FINISH
## ═══════════════════════════════════════════════════════

- [ ] Supabase project created & configured
- [ ] Cloudinary account setup
- [ ] Database tables created
- [ ] Next.js project initialized
- [ ] Refine framework integrated
- [ ] Auth system working
- [ ] CRUD Pegawai complete
- [ ] Document upload working
- [ ] Dashboard with charts
- [ ] Export PDF/Excel
- [ ] Public website pages
- [ ] Deployed to Vercel
- [ ] Testing & bug fixing

---

## 📞 Kontak Bantuan

Jika ada pertanyaan, hubungi:
- 📧 Email: admin@rsiundayani.com
- 📱 Phone: (0298) XXXXXX

---

**Created:** 2026-09-05  
**Last Updated:** 2026-09-05  
**Status:** 📋 Perencanaan
