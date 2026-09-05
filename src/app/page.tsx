"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function HomePage() {
    const router = useRouter();
    useEffect(() => { router.push("/admin/dashboard"); }, [router]);
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: 48 }}>🏥</h1>
                <h1 style={{ fontSize: 32, fontWeight: 700 }}>RSUDAYANI</h1>
                <p style={{ fontSize: 18, opacity: 0.9 }}>Sistem Manajemen Data Pegawai</p>
                <p style={{ fontSize: 14, opacity: 0.7, marginTop: 24 }}>Memuat...</p>
            </div>
        </div>
    );
}
