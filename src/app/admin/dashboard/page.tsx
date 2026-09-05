"use client";
import React from "react";
import { Row, Col, Card, Statistic, Table, Tag, Typography, Button } from "antd";
import { UserOutlined, FileOutlined, TeamOutlined, WarningOutlined, PlusOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import Link from "next/link";

const { Title, Text } = Typography;

export default function DashboardPage() {
    const { data: pegawaiData } = useList<any>({ resource: "pegawai", pagination: { pageSize: 100 } });
    const totalPegawai = pegawaiData?.total || 0;
    const dataPegawai = pegawaiData?.data || [];
    const aktifCount = dataPegawai.filter((p: any) => p.status === "Aktif").length;
    const sampleData = dataPegawai.length > 0 ? dataPegawai.slice(0, 5).map((p: any) => ({ id: p.id, nama: p.nama, departemen: p.departemen || "-", status: p.status || "Aktif" })) : [
        { id: "1", nama: "Dr. Ahmad Wijaya", departemen: "Dokter", status: "Aktif" },
        { id: "2", nama: "Siti Nurhaliza", departemen: "Perawatan", status: "Aktif" },
        { id: "3", nama: "Budi Santoso", departemen: "Keuangan", status: "Aktif" },
    ];

    const columns = [
        { title: "Nama", dataIndex: "nama", key: "nama" },
        { title: "Departemen", dataIndex: "departemen", key: "departemen" },
        { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Aktif" ? "green" : "orange"}>{s}</Tag> },
    ];

    return (
        <div>
            <Title level={3} style={{ marginBottom: 24 }}>📊 Dashboard RSI Undayani</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}><Card><Statistic title="Total Pegawai" value={totalPegawai} prefix={<UserOutlined style={{ color: "#1677ff" }} />} suffix={<Text type="secondary">orang</Text>} /></Card></Col>
                <Col xs={24} sm={12} lg={6}><Card><Statistic title="Total Dokumen" value={0} prefix={<FileOutlined style={{ color: "#52c41a" }} />} suffix={<Text type="secondary">file</Text>} /></Card></Col>
                <Col xs={24} sm={12} lg={6}><Card><Statistic title="Pegawai Aktif" value={aktifCount} prefix={<TeamOutlined style={{ color: "#13c2c2" }} />} valueStyle={{ color: "#52c41a" }} /></Card></Col>
                <Col xs={24} sm={12} lg={6}><Card><Statistic title="Sedang Cuti" value={0} prefix={<WarningOutlined style={{ color: "#faad14" }} />} valueStyle={{ color: "#faad14" }} /></Card></Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}><Card title="📋 Pegawai Terbaru" bordered={false} extra={<Link href="/admin/pegawai">Lihat Semua</Link>}><Table columns={columns} dataSource={sampleData} rowKey="id" pagination={false} size="small" /></Card></Col>
                <Col xs={24} lg={8}><Card title="⚡ Aksi Cepat" bordered={false}><Row gutter={8}><Col span={24} style={{ marginBottom: 8 }}><Link href="/admin/pegawai/create"><Button block icon={<PlusOutlined />}>Tambah Pegawai</Button></Link></Col><Col span={24} style={{ marginBottom: 8 }}><Link href="/admin/pegawai"><Button block>List Pegawai</Button></Link></Col><Col span={24}><Link href="/admin/dokumen"><Button block>Dokumen</Button></Link></Col></Row></Card></Col>
            </Row>
        </div>
    );
}
