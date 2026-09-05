"use client";

import React, { useState, useEffect } from "react";
import { Typography, Card, Row, Col, Statistic, Spin, Table, Tag } from "antd";
import { TeamOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPegawai: 0,
    totalDokter: 0,
    totalPerawat: 0,
    totalDiklat: 0,
  });
  const [recentDiklat, setRecentDiklat] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let pegawaiQuery = supabase.from("pegawais").select("*", { count: "exact", head: true }).eq("is_aktif", true);
        
        if (user?.role_type === "admin_kategori" && user.kategori_nakes) {
          pegawaiQuery = pegawaiQuery.eq("kategori_nakes", user.kategori_nakes);
        } else if (user?.role_type === "admin_unit" && user.unit_kerja) {
          pegawaiQuery = pegawaiQuery.eq("unit_kerja", user.unit_kerja);
        } else if (user?.role_type === "user" && user.pegawai_id) {
          pegawaiQuery = pegawaiQuery.eq("id", user.pegawai_id);
        }

        const { count: totalPegawai } = await pegawaiQuery;
        
        const { count: totalDokter } = await supabase
          .from("pegawais")
          .select("*", { count: "exact", head: true })
          .eq("is_aktif", true)
          .eq("kategori_nakes", "Dokter");
        
        const { count: totalPerawat } = await supabase
          .from("pegawais")
          .select("*", { count: "exact", head: true })
          .eq("is_aktif", true)
          .eq("kategori_nakes", "Perawat");

        const { count: totalDiklat } = await supabase
          .from("diklats")
          .select("*", { count: "exact", head: true });

        setStats({
          totalPegawai: totalPegawai || 0,
          totalDokter: totalDokter || 0,
          totalPerawat: totalPerawat || 0,
          totalDiklat: totalDiklat || 0,
        });

        const { data: diklatData } = await supabase
          .from("diklats")
          .select("id, kategori, nama_pelatihan, tanggal_pelatihan, pegawai:pegawai_id (nama)")
          .order("tanggal_pelatihan", { ascending: false })
          .limit(5);

        setRecentDiklat(diklatData || []);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    { title: "Pegawai", dataIndex: ["pegawai", "nama"], key: "nama" },
    { title: "Pelatihan", dataIndex: "nama_pelatihan", key: "pelatihan" },
    { title: "Kategori", dataIndex: "kategori", key: "kategori", render: (kat: string) => <Tag color="blue">{kat}</Tag> },
    { title: "Tanggal", dataIndex: "tanggal_pelatihan", key: "tanggal", render: (t: string) => dayjs(t).format("DD MMM YYYY") },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Dashboard</Title>
        <Text type="secondary">Selamat datang, {user?.name}!</Text>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Total Pegawai Aktif" value={stats.totalPegawai} prefix={<TeamOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Dokter" value={stats.totalDokter} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Perawat" value={stats.totalPerawat} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Total Pelatihan" value={stats.totalDiklat} prefix={<BookOutlined />} /></Card>
        </Col>
      </Row>

      <Card title="Pelatihan Terbaru" extra={<a href="/admin/diklat">Lihat Semua</a>}>
        <Table dataSource={recentDiklat} columns={columns} rowKey="id" pagination={false} size="small" />
      </Card>
    </div>
  );
}
