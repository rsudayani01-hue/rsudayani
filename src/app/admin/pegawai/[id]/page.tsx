"use client";

import React, { useState, useEffect } from "react";
import { Typography, Card, Button, Breadcrumb, Spin, message, Descriptions, Tag, Divider, Space } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import PegawaiForm from "@/components/pegawai/PegawaiForm";

const { Title, Text } = Typography;

interface Pegawai {
  id: number;
  nik: string;
  nip: string | null;
  nama: string;
  kategori_nakes: string | null;
  unit_kerja: string | null;
  status_kepegawaian: string | null;
  jabatan: string | null;
  str: string | null;
  masa_berlaku_str: string | null;
  sip: string | null;
  masa_berlaku_sip: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: string | null;
  agama: string | null;
  alamat_domisili: string | null;
  no_hp: string | null;
  email: string | null;
  pendidikan_terakhir: string | null;
  nama_institusi: string | null;
  tahun_lulus: string | null;
  npwp: string | null;
  tanggal_mulai_bekerja: string | null;
  is_aktif: boolean;
  created_at: string;
}

export default function PegawaiDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [data, setData] = useState<Pegawai | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "true");

  const canEdit = user?.role_type === "super_admin" || user?.role_type === "admin_kategori" || user?.role_type === "admin_unit";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: result, error } = await supabase
          .from("pegawais")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setData(result);
      } catch (error: any) {
        message.error(error.message || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSuccess = () => {
    setIsEditing(false);
    // Refresh data
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Text>Data tidak ditemukan</Text>
      </div>
    );
  }

  // Edit mode
  if (isEditing) {
    return (
      <div>
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            { title: <Link href="/admin/pegawai">Pegawai</Link> },
            { title: data.nama },
            { title: "Edit" },
          ]}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            ✏️ Edit Data Pegawai
          </Title>
        </div>

        <Card>
          <PegawaiForm 
            initialData={data}
            onSuccess={handleSuccess}
            onCancel={() => setIsEditing(false)}
          />
        </Card>
      </div>
    );
  }

  // View mode
  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link href="/admin/pegawai">Pegawai</Link> },
          { title: data.nama },
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
            👤 {data.nama}
          </Title>
          <Text type="secondary">
            NIK: {data.nik} {data.nip && `• NIP: ${data.nip}`}
          </Text>
        </div>
        {canEdit && (
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
          >
            Edit Data
          </Button>
        )}
      </div>

      {/* Info Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <Card size="small">
          <Text type="secondary" style={{ fontSize: 12 }}>Kategori</Text>
          <br />
          <Tag color="blue" style={{ marginTop: 4 }}>{data.kategori_nakes || "-"}</Tag>
        </Card>
        <Card size="small">
          <Text type="secondary" style={{ fontSize: 12 }}>Unit Kerja</Text>
          <br />
          <Text strong>{data.unit_kerja || "-"}</Text>
        </Card>
        <Card size="small">
          <Text type="secondary" style={{ fontSize: 12 }}>Jabatan</Text>
          <br />
          <Text strong>{data.jabatan || "-"}</Text>
        </Card>
        <Card size="small">
          <Text type="secondary" style={{ fontSize: 12 }}>Status</Text>
          <br />
          <Tag color={data.status_kepegawaian === "PNS" ? "green" : "orange"} style={{ marginTop: 4 }}>
            {data.status_kepegawaian || "-"}
          </Tag>
        </Card>
      </div>

      {/* Details */}
      <Card title="📋 Data Pribadi">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="NIK">{data.nik}</Descriptions.Item>
          <Descriptions.Item label="Nama Lengkap">{data.nama}</Descriptions.Item>
          <Descriptions.Item label="Tempat, Tanggal Lahir">
            {data.tempat_lahir || "-"}, {data.tanggal_lahir || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Jenis Kelamin">{data.jenis_kelamin || "-"}</Descriptions.Item>
          <Descriptions.Item label="Agama">{data.agama || "-"}</Descriptions.Item>
          <Descriptions.Item label="No. HP">{data.no_hp || "-"}</Descriptions.Item>
          <Descriptions.Item label="Email">{data.email || "-"}</Descriptions.Item>
          <Descriptions.Item label="NPWP">{data.npwp || "-"}</Descriptions.Item>
          <Descriptions.Item label="Alamat" span={2}>{data.alamat_domisili || "-"}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      <Card title="💼 Data Kepegawaian">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="NIP">{data.nip || "-"}</Descriptions.Item>
          <Descriptions.Item label="Tanggal Mulai Bekerja">{data.tanggal_mulai_bekerja || "-"}</Descriptions.Item>
          <Descriptions.Item label="STR">{data.str || "-"}</Descriptions.Item>
          <Descriptions.Item label="Masa Berlaku STR">{data.masa_berlaku_str || "-"}</Descriptions.Item>
          <Descriptions.Item label="SIP">{data.sip || "-"}</Descriptions.Item>
          <Descriptions.Item label="Masa Berlaku SIP">{data.masa_berlaku_sip || "-"}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      <Card title="🎓 Pendidikan">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Pendidikan Terakhir">{data.pendidikan_terakhir || "-"}</Descriptions.Item>
          <Descriptions.Item label="Tahun Lulus">{data.tahun_lulus || "-"}</Descriptions.Item>
          <Descriptions.Item label="Nama Institusi" span={2}>{data.nama_institusi || "-"}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
