"use client";
import React, { useState } from "react";
import { Table, Tag, Card, Typography, Button, Input } from "antd";
import { useTable } from "@refinedev/antd";
import { SearchOutlined, DownloadOutlined, EyeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function DokumenListPage() {
    const { tableProps } = useTable<any>({ resource: "dokumen", syncWithLocation: true });
    const [searchText, setSearchText] = useState("");

    const columns = [
        { title: "Nama Dokumen", dataIndex: "nama_dokumen", key: "nama_dokumen", render: (n: string) => <Text strong>{n}</Text> },
        { title: "Jenis", dataIndex: "jenis", key: "jenis", render: (j: string) => <Tag color="blue">{j?.replace("_", " ")}</Tag> },
        { title: "Pegawai ID", dataIndex: "pegawai_id", key: "pegawai_id", render: (id: string) => <Text code>{id?.slice(0, 8)}...</Text> },
        { title: "Ukuran", dataIndex: "size_bytes", key: "size_bytes", render: (s: number) => s ? `${Math.round(s/1024)} KB` : "-" },
        { title: "Tanggal Upload", dataIndex: "created_at", key: "created_at", render: (d: string) => d ? new Date(d).toLocaleDateString("id-ID") : "-" },
        { title: "Aksi", key: "actions", render: (_: any, r: any) => r.cloudinary_url && <Button.Group><a href={r.cloudinary_url} target="_blank" rel="noopener noreferrer"><Button size="small" icon={<EyeOutlined />}>Lihat</Button></a><a href={r.cloudinary_url} download><Button size="small" icon={<DownloadOutlined />}>Download</Button></a></Button.Group> },
    ];

    const filteredData = (tableProps.dataSource || []).filter((item: any) => item.nama_dokumen?.toLowerCase().includes(searchText.toLowerCase()) || item.jenis?.toLowerCase().includes(searchText.toLowerCase()));

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}><Title level={3} style={{ margin: 0 }}>📄 Daftar Dokumen</Title></div>
            <Card bordered={false}>
                <div style={{ marginBottom: 16 }}><Input placeholder="Cari nama atau jenis..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ maxWidth: 300 }} /></div>
                <Table {...tableProps} dataSource={filteredData} columns={columns} rowKey="id" />
            </Card>
        </div>
    );
}
