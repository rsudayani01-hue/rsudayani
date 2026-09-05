"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Card, Typography, Tag, Modal, Form, Select, Input, DatePicker, message, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { KATEGORI_DIKLAT, TOPIK_KARS } from "@/lib/roles";
import dayjs from "dayjs";

const { Title } = Typography;

interface Diklat {
  id: number;
  pegawai_id: number;
  kategori: string;
  kategori_kars: string | null;
  nama_pelatihan: string | null;
  tanggal_pelatihan: string | null;
  penyelenggara: string | null;
  created_at: string;
  pegawai?: { nama: string };
}

export default function DiklatPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Diklat[]>([]);
  const [pegawaiList, setPegawaiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const canEdit = user?.role_type === "super_admin" || user?.role_type === "admin_kategori" || user?.role_type === "admin_unit";

  const fetchPegawai = useCallback(async () => {
    let query = supabase.from("pegawais").select("id, nama").eq("is_aktif", true).order("nama");
    if (user?.role_type === "admin_kategori" && user.kategori_nakes) {
      query = query.eq("kategori_nakes", user.kategori_nakes);
    }
    const { data: result } = await query;
    setPegawaiList(result || []);
  }, [user]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from("diklats")
        .select("*, pegawai:pegawai_id (nama)")
        .order("tanggal_pelatihan", { ascending: false });

      if (error) throw error;
      setData(result || []);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPegawai();
    fetchData();
  }, [fetchPegawai, fetchData]);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        tanggal_pelatihan: values.tanggal_pelatihan?.format("YYYY-MM-DD"),
      };
      
      if (editingId) {
        await supabase.from("diklats").update(payload).eq("id", editingId);
        message.success("Berhasil diperbarui!");
      } else {
        await supabase.from("diklats").insert(payload);
        message.success("Berhasil disimpan!");
      }
      setModalVisible(false);
      setEditingId(null);
      form.resetFields();
      fetchData();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleEdit = (record: Diklat) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      tanggal_pelatihan: record.tanggal_pelatihan ? dayjs(record.tanggal_pelatihan) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await supabase.from("diklats").delete().eq("id", id);
      message.success("Berhasil dihapus!");
      fetchData();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns = [
    { title: "Pegawai", dataIndex: ["pegawai", "nama"], key: "nama", render: (n: string) => n || "-" },
    { title: "Kategori", dataIndex: "kategori", key: "kategori", render: (kat: string) => <Tag color="blue">{kat}</Tag> },
    { title: "Topik KARS", dataIndex: "kategori_kars", key: "kategori_kars", render: (kat: string) => kat ? <Tag color="green">{kat}</Tag> : "-" },
    { title: "Nama Pelatihan", dataIndex: "nama_pelatihan", key: "nama" },
    { title: "Tanggal", dataIndex: "tanggal_pelatihan", key: "tanggal", render: (t: string) => t ? dayjs(t).format("DD MMM YYYY") : "-" },
    { title: "Penyelenggara", dataIndex: "penyelenggara", key: "penyelenggara" },
    {
      title: "Aksi",
      key: "actions",
      render: (_: any, record: Diklat) => canEdit && (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => Modal.confirm({ title: "Hapus?", content: "Yakin hapus?", onOk: () => handleDelete(record.id) })} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Pelatihan / Diklat</Title>
        {canEdit && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setModalVisible(true); }}>
            Tambah Pelatihan
          </Button>
        )}
      </div>

      <Card>
        <Table dataSource={data} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (t) => `Total ${t} data` }} />
      </Card>

      <Modal title={editingId ? "Edit Pelatihan" : "Tambah Pelatihan"} open={modalVisible} onCancel={() => { setModalVisible(false); setEditingId(null); form.resetFields(); }} footer={null} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Pegawai" name="pegawai_id" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="children" placeholder="Pilih pegawai" options={pegawaiList.map(p => ({ value: p.id, label: p.nama }))} />
          </Form.Item>
          <Form.Item label="Kategori" name="kategori" rules={[{ required: true }]}>
            <Select placeholder="Pilih kategori" options={KATEGORI_DIKLAT.map(k => ({ value: k.value, label: k.label }))} />
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.kategori !== curr.kategori}>
            {({ getFieldValue }) => (
              getFieldValue("kategori") === "Pelatihan Akreditasi" && (
                <Form.Item label="Topik KARS" name="kategori_kars">
                  <Select showSearch placeholder="Pilih topik KARS" options={TOPIK_KARS.map(t => ({ value: t.value, label: t.label }))} />
                </Form.Item>
              )
            )}
          </Form.Item>
          <Form.Item label="Nama Pelatihan" name="nama_pelatihan">
            <Input placeholder="Nama pelatihan" />
          </Form.Item>
          <Form.Item label="Tanggal" name="tanggal_pelatihan">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Penyelenggara" name="penyelenggara">
            <Input placeholder="Nama penyelenggara" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Simpan</Button>
        </Form>
      </Modal>
    </div>
  );
}
