"use client";

import React from "react";
import { Typography, Card, Button, Breadcrumb } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PegawaiForm from "@/components/pegawai/PegawaiForm";

const { Title } = Typography;

export default function CreatePegawaiPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/pegawai");
  };

  const handleCancel = () => {
    router.push("/admin/pegawai");
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link href="/admin/pegawai">Pegawai</Link> },
          { title: "Tambah Baru" },
        ]}
      />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.push("/admin/pegawai")}
            style={{ marginBottom: 8 }}
          >
            Kembali
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            ➕ Tambah Pegawai Baru
          </Title>
        </div>
      </div>

      {/* Form */}
      <Card>
        <PegawaiForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  );
}
