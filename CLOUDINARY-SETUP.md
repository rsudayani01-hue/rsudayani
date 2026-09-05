# ☁️ CLOUDINARY SETUP GUIDE
## Langkah Setup Cloudinary untuk RSI Undayani

---

## 1. 📝 Buat Akun Cloudinary

1. Buka [cloudinary.com](https://cloudinary.com)
2. Klik **"Sign Up Free"**
3. Daftar dengan GitHub atau email
4. Pilih plan: **Free (25 GB storage)**

---

## 2. 🆕 Setup Cloud

1. Setelah login, Anda akan masuk ke **Dashboard**
2. Di bagian atas, akan terlihat:
   ```
   cloud_name:    xxxxxxxx
   api_key:       123456789012345
   api_secret:    xxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Copy credentials ini untuk nanti

---

## 3. 🔧 Konfigurasi Upload Settings

### 3.1 Buat Upload Preset

1. Pergi ke **Settings** (gear icon) → **Upload**
2. Scroll ke **Upload presets**
3. Klik **Add upload preset**
4. Configure:
   - **Signing Mode:** Unsigned (untuk kemudahan upload dari frontend)
   - **Folder:** `rsudayani/dokumen`
   - **Allowed Formats:** PDF, JPG, PNG, JPEG, DOC, DOCX
   - **Max File Size:** 10 MB

5. Copy **Upload Preset Name:** `rsudayani_dokumen`

### 3.2 Setup Folder Structure

Cloudinary akan otomatis membuat folder saat upload pertama. Struktur yang direkomendasikan:

```
rsudayani/
├── dokumen/
│   ├── ktp/
│   ├── ijazah/
│   ├── kontrak/
│   └── ...
└── foto_profil/
```

---

## 4. 🔒 Setup Security (Optional)

1. Pergi ke **Settings** → **Security**
2. Pastikan:
   - ✅ "Restrict asset delivery by domain" (opsional)
   - ✅ "Keep original images" (opsional)
   - ✅ "Eager transformations" untuk auto-generate thumbnail

---

## 5. 📱 Test Upload

Gunakan Cloudinary Upload Widget untuk test:

```html
<script src="//upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>

<button id="upload_widget">Upload Dokumen</button>

<script type="text/javascript">
    var myWidget = cloudinary.createUploadWidget({
        cloudName: 'your_cloud_name',
        uploadPreset: 'rsudayani_dokumen',
        sources: ['local', 'camera', 'google_drive', 'dropbox']
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            console.log('Done! Here is the image info: ', result.info);
        }
    });

    document.getElementById("upload_widget").addEventListener("click", function() {
        myWidget.open();
    });
</script>
```

---

## 6. 📋 Ringkasan Credentials

| Item | Value | Untuk |
|------|-------|-------|
| Cloud Name | `xxxxxxxx` | Frontend + API |
| API Key | `123456789012345` | Backend/API |
| API Secret | `xxxx...` | Backend only |
| Upload Preset | `rsudayani_dokumen` | Frontend upload |

---

## 7. 💰 Usage Tracking

Di Dashboard Cloudinary:

- **Storage Used:** (~1-2 GB untuk awal)
- **Bandwidth:** (tergantung traffic)
- **Transformations:** (otomatis dari upload preset)

Free tier: **25 GB storage, 25 GB bandwidth/month**

---

## 8. 🔗 Integrasi dengan Next.js

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper functions
export const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'rsudayani_dokumen');
    formData.append('folder', 'rsudayani/dokumen');

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        { method: 'POST', body: formData }
    );
    
    return res.json();
};

export const deleteFromCloudinary = async (publicId: string) => {
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', process.env.CLOUDINARY_API_KEY!);
    formData.append('timestamp', Date.now().toString());
    formData.append('signature', 'generate_signature_server_side');

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/destroy`,
        { method: 'POST', body: formData }
    );
    
    return res.json();
};

export const getCloudinaryUrl = (publicId: string, options = {}) => {
    return cloudinary.url(publicId, {
        width: 300,
        height: 300,
        crop: 'fill',
        ...options
    });
};
```

---

## 9. ⚠️ Best Practices

1. **Jangan simpan credentials di frontend** - Gunakan environment variables
2. **Gunakan unsigned preset** untuk upload dari browser
3. **Gunakan signed request** untuk delete dari backend
4. **Optimasi gambar** dengan transformation parameters
5. **Backup** - Cloudinary tidak garantikan data permanen

---

## ❓ Troubleshooting

### Error: "Invalid Signature"
→ Pastikan API secret tidak exposed di frontend

### Error: "File too large"
→ Cek pengaturan upload preset di Cloudinary

### Error: "Upload preset not found"
→ Pastikan upload preset name match persis

---

## 📞 Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload Widget Docs](https://cloudinary.com/documentation/upload_widget)
- [Transformation Docs](https://cloudinary.com/documentation/image_transformation)

---

**Last Updated:** 2026-09-05
