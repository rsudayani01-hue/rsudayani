"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Card, Typography, Tag, Modal, Form, Input, Select, message, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { KATEGORI_NAKES } from "@/lib/roles";

const { Title } = Typography;

interface UnitKerja {
  id: number;
  nama: string;
  kategori_nakes: string;
  kode: string | null;
  is_aktif: boolean;
}

export default function UnitKerjaPage() {
  const { user } = useAuth();
  const [data, setData] = useState<UnitKerja[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const canEdit = user?.role_type === "super_admin";

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from("unit_kerjas")
        .select("*")
        .eq("is_aktif", true)
        .order("kategori_nakes", { ascending: true });

      if (error) throw error;
      setData(result || []);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      if (editingId) {
        await supabase.from("unit_kerjas").update(values).eq("id", editingId);
        message.success("Berhasil diperbarui!");
      } else {
        await supabase.from("unit_kerjas").insert(values);
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

  const handleEdit = (record: UnitKerja) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await supabase.from("unit_kerjas").update({ is_aktif: false }).eq("id", id);
      message.success("Berhasil dihapus!");
      fetchData();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns = [
    { title: "Kode", dataIndex: "kode", key: "kode" },
    { title: "Nama Unit Kerja", dataIndex: "nama", key: "nama" },
    { title: "Kategori", dataIndex: "kategori_nakes", key: "kategori", render: (kat: string) => <Tag color="blue">{kat}</Tag> },
    {
      title: "Aksi",
      key: "actions",
      render: (_: any, record: UnitKerja) => canEdit && (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => Modal.confirm({ title: "Hapus?", content: "Yakin hapus unit kerja ini?", onOk: () => handleDelete(record.id) })} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Unit Kerja</Title>
        {canEdit && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setModalVisible(true); }}>
            Tambah Unit Kerja
          </Button>
        )}
      </div>

      <Card>
        <Table dataSource={data} columns={columns} rowKey="id" loading={loading} pagination={false} />
      </Card>

      <Modal title={editingId ? "Edit Unit Kerja" : "Tambah Unit Kerja"} open={modalVisible} onCancel={() => { setModalVisible(false); setEditingId(null); form.resetFields(); }} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Kode" name="kode"><Input placeholder="DR-001" /></Form.Item>
          <Form.Item label="Nama" name="nama" rules={[{ required: true }]}><Input placeholder="Nama unit kerja" /></Form.Item>
          <Form.Item label="Kategori" name="kategori_nakes" rules={[{ required: true }]}>
            <Select placeholder="Pilih kategori" options={KATEGORI_NAKES.map(k => ({ value: k.value, label: k.label }))} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Simpan</Button>
        </Form>
      </Modal>
    </div>
  );
}
