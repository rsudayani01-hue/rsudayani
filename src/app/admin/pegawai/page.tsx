"use client";

import React, { useState, useEffect } from "react";
import { 
  Table, 
  Button, 
  Tag, 
  Card, 
  Typography, 
  Avatar, 
  Input, 
  Space,
  Select,
  Badge,
  Dropdown,
  Modal,
  message
} from "antd";
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  UserOutlined,
  MoreOutlined,
  FilterOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { KATEGORI_NAKES, STATUS_KEPEGAWAIAN } from "@/lib/roles";
import type { MenuProps } from "antd";

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
  sip: string | null;
  email: string | null;
  no_hp: string | null;
  is_aktif: boolean;
  created_at: string;
}

export default function PegawaiListPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterKategori, setFilterKategori] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("pegawais")
        .select("*", { count: "exact" })
        .eq("is_aktif", true)
        .order("nama", { ascending: true });

      // Role-based filtering
      if (user?.role_type === "admin_kategori" && user.kategori_nakes) {
        query = query.eq("kategori_nakes", user.kategori_nakes);
      } else if (user?.role_type === "admin_unit" && user.unit_kerja) {
        query = query.eq("unit_kerja", user.unit_kerja);
      } else if (user?.role_type === "user" && user.pegawai_id) {
        query = query.eq("id", user.pegawai_id);
      }

      const from = (pagination.current - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      const { data: result, error, count } = await query;

      if (error) throw error;

      setData(result || []);
      setPagination(prev => ({ ...prev, total: count || 0 }));
    } catch (error: any) {
      message.error(error.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, user]);

  // Delete handler
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from("pegawais")
        .update({ is_aktif: false })
        .eq("id", id);

      if (error) throw error;
      message.success("Data berhasil dihapus!");
      fetchData();
    } catch (error: any) {
      message.error(error.message || "Gagal menghapus data");
    }
  };

  // Filtered data
  const filteredData = data.filter(item => {
    const matchSearch = searchText === "" || 
      item.nama?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.nik?.includes(searchText) ||
      item.nip?.includes(searchText) ||
      item.email?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchKategori = !filterKategori || item.kategori_nakes === filterKategori;
    const matchStatus = !filterStatus || item.status_kepegawaian === filterStatus;

    return matchSearch && matchKategori && matchStatus;
  });

  // Can edit/delete?
  const canEdit = user?.role_type === "super_admin" || user?.role_type === "admin_kategori" || user?.role_type === "admin_unit";
  const canDelete = user?.role_type === "super_admin";

  // Table columns
  const columns = [
    {
      title: "Nama",
      dataIndex: "nama",
      key: "nama",
      render: (nama: string, record: Pegawai) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar style={{ backgroundColor: "#1677ff" }} icon={<UserOutlined />} />
          <div>
            <Text strong>{nama}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>NIK: {record.nik || "-"}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Kategori",
      dataIndex: "kategori_nakes",
      key: "kategori_nakes",
      render: (kategori: string) => (
        <Tag color="blue">{kategori || "-"}</Tag>
      ),
    },
    {
      title: "Unit Kerja",
      dataIndex: "unit_kerja",
      key: "unit_kerja",
      render: (unit: string) => unit || "-",
    },
    {
      title: "Jabatan",
      dataIndex: "jabatan",
      key: "jabatan",
      render: (jabatan: string) => jabatan || "-",
    },
    {
      title: "Status",
      dataIndex: "status_kepegawaian",
      key: "status_kepegawaian",
      render: (status: string) => {
        const color = status === "PNS" ? "green" : status === "PPPK" ? "orange" : "default";
        return <Tag color={color}>{status || "-"}</Tag>;
      },
    },
    {
      title: "No. HP",
      dataIndex: "no_hp",
      key: "no_hp",
      render: (hp: string) => hp || "-",
    },
    {
      title: "Aksi",
      key: "actions",
      width: 120,
      render: (_: any, record: Pegawai) => (
        <Space>
          <Link href={`/admin/pegawai/${record.id}`}>
            <Button size="small" icon={<EyeOutlined />}>
              Detail
            </Button>
          </Link>
          {canEdit && (
            <Link href={`/admin/pegawai/${record.id}?edit=true`}>
              <Button size="small" type="text" icon={<EditOutlined />} />
            </Link>
          )}
          {canDelete && (
            <Button 
              size="small" 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => Modal.confirm({
                title: "Konfirmasi Hapus",
                content: `Yakin hapus data ${record.nama}?`,
                onOk: () => handleDelete(record.id),
              })}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            👥 Data Pegawai
          </Title>
          <Text type="secondary">
            Total: {pagination.total} pegawai aktif
          </Text>
        </div>
        {canEdit && (
          <Link href="/admin/pegawai/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Tambah Pegawai
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Cari nama, NIK, NIP, email..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
          <Select
            placeholder="Filter Kategori"
            value={filterKategori}
            onChange={setFilterKategori}
            allowClear
            style={{ width: 160 }}
            options={KATEGORI_NAKES.map(k => ({ value: k.value, label: k.label }))}
          />
          <Select
            placeholder="Filter Status"
            value={filterStatus}
            onChange={setFilterStatus}
            allowClear
            style={{ width: 180 }}
            options={STATUS_KEPEGAWAIAN.map(s => ({ value: s.value, label: s.label }))}
          />
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }),
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} data`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
