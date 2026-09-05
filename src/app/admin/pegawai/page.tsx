"use client";
import React, { useState } from "react";
import { Table, Button, Tag, Card, Typography, Avatar, Popconfirm, Input } from "antd";
import { useTable } from "@refinedev/antd";
import { useDelete } from "@refinedev/core";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Text } = Typography;

export default function PegawaiListPage() {
    const { tableProps } = useTable<any>({ resource: "pegawai", syncWithLocation: true });
    const { mutate: deleteMutate } = useDelete();
    const [searchText, setSearchText] = useState("");

    const columns = [
        { title: "Foto", key: "foto", width: 60, render: (_: any, r: any) => <Avatar src={r.foto_url} icon={<UserOutlined />} style={{ backgroundColor: "#1677ff" }} /> },
        { title: "NIP", dataIndex: "nip", key: "nip" },
        { title: "Nama", dataIndex: "nama", key: "nama", render: (n: string) => <Text strong>{n}</Text> },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Departemen", dataIndex: "departemen", key: "departemen", render: (d: string) => <Tag color="blue">{d || "-"}</Tag> },
        { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Aktif" ? "green" : s === "Cuti" ? "orange" : "red"}>{s || "Aktif"}</Tag> },
        { title: "Aksi", key: "actions", width: 150, render: (_: any, r: any) => (
            <Button.Group>
                <Link href={`/admin/pegawai/${r.id}`}><Button size="small" icon={<EyeOutlined />}>Detail</Button></Link>
                <Popconfirm title="Hapus?" onConfirm={() => deleteMutate({ resource: "pegawai", id: r.id })} okText="Ya" cancelText="Batal"><Button size="small" danger icon={<DeleteOutlined />}>Hapus</Button></Popconfirm>
            </Button.Group>
        )},
    ];

    const filteredData = (tableProps.dataSource || []).filter((item: any) =>
        item.nama?.toLowerCase().includes(searchText.toLowerCase()) || item.nip?.includes(searchText) || item.email?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>👥 Data Pegawai</Title>
                <Link href="/admin/pegawai/create"><Button type="primary" icon={<PlusOutlined />}>Tambah Pegawai</Button></Link>
            </div>
            <Card bordered={false}>
                <div style={{ marginBottom: 16 }}><Input placeholder="Cari nama, NIP, email..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ maxWidth: 300 }} /></div>
                <Table {...tableProps} dataSource={filteredData} columns={columns} rowKey="id" />
            </Card>
        </div>
    );
}
