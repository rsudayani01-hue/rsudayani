"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Card, Typography, Tag, Modal, Form, Input, Select, message, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_OPTIONS, KATEGORI_NAKES, getRoleLabel, getRoleColor } from "@/lib/roles";

const { Title } = Typography;

interface User {
  id: number;
  name: string;
  email: string;
  role_type: string;
  kategori_nakes: string | null;
  unit_kerja: string | null;
  is_aktif: boolean;
  created_at: string;
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from("users")
        .select("*")
        .eq("is_aktif", true)
        .order("created_at", { ascending: false });

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
        await supabase.from("users").update(values).eq("id", editingId);
        message.success("Berhasil diperbarui!");
      } else {
        await supabase.from("users").insert(values);
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

  const handleEdit = (record: User) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await supabase.from("users").update({ is_aktif: false }).eq("id", id);
      message.success("Berhasil dihapus!");
      fetchData();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns = [
    { title: "Nama", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role_type", key: "role", render: (role: string) => <Tag color={getRoleColor(role as any)}>{getRoleLabel(role as any)}</Tag> },
    { title: "Kategori", dataIndex: "kategori_nakes", key: "kategori", render: (k: string) => k || "-" },
    {
      title: "Aksi",
      key: "actions",
      render: (_: any, record: User) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          {record.id !== currentUser?.id && (
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => Modal.confirm({ title: "Hapus?", content: "Yakin hapus user ini?", onOk: () => handleDelete(record.id) })} />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Kelola User</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setModalVisible(true); }}>
          Tambah User
        </Button>
      </div>

      <Card>
        <Table dataSource={data} columns={columns} rowKey="id" loading={loading} pagination={false} />
      </Card>

      <Modal title={editingId ? "Edit User" : "Tambah User"} open={modalVisible} onCancel={() => { setModalVisible(false); setEditingId(null); form.resetFields(); }} footer={null} width={500}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Nama" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
          {!editingId && <Form.Item label="Password" name="password" rules={[{ required: true }]}><Input.Password /></Form.Item>}
          <Form.Item label="Role" name="role_type" rules={[{ required: true }]}>
            <Select placeholder="Pilih role" options={ROLE_OPTIONS.map(r => ({ value: r.value, label: r.label }))} />
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.role_type !== curr.role_type}>
            {({ getFieldValue }) => ["admin_kategori", "admin_unit"].includes(getFieldValue("role_type")) && (
              <Form.Item label="Kategori" name="kategori_nakes">
                <Select placeholder="Pilih kategori" options={KATEGORI_NAKES.map(k => ({ value: k.value, label: k.label }))} allowClear />
              </Form.Item>
            )}
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Simpan</Button>
        </Form>
      </Modal>
    </div>
  );
}
