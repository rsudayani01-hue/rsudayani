"use client";
import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Row, Col, Card, Typography, message } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

export default function CreatePegawaiPage() {
    const { formProps, saveButtonProps, onFinish } = useForm();
    
    const handleFinish = async (values: any) => {
        if (values.tanggal_masuk) values.tanggal_masuk = dayjs(values.tanggal_masuk).format("YYYY-MM-DD");
        await onFinish(values);
        message.success("Pegawai berhasil ditambahkan!");
    };

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Title level={4}>Tambah Pegawai Baru</Title>
            <Form {...formProps} onFinish={handleFinish} layout="vertical">
                <Row gutter={24}>
                    <Col xs={24} lg={12}>
                        <Card title="Data Pribadi" bordered={false}>
                            <Form.Item label="NIP" name="nip" rules={[{ required: true, message: "Wajib diisi" }]}><Input placeholder="198501012010011001" /></Form.Item>
                            <Form.Item label="Nama Lengkap" name="nama" rules={[{ required: true, message: "Wajib diisi" }]}><Input placeholder="Dr. Ahmad Wijaya" /></Form.Item>
                            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Wajib diisi" }, { type: "email", message: "Format tidak valid" }]}><Input placeholder="ahmad@rsiundayani.com" /></Form.Item>
                            <Form.Item label="No. Telepon" name="telepon"><Input placeholder="081234567890" /></Form.Item>
                            <Form.Item label="Tanggal Masuk" name="tanggal_masuk"><Input type="date" /></Form.Item>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card title="Data Kepegawaian" bordered={false}>
                            <Form.Item label="Departemen" name="departemen"><Select><Select.Option value="Dokter">Dokter</Select.Option><Select.Option value="Perawatan">Perawatan</Select.Option><Select.Option value="Keuangan">Keuangan</Select.Option><Select.Option value="IT">IT</Select.Option><Select.Option value="HRD">HRD</Select.Option><Select.Option value="Marketing">Marketing</Select.Option><Select.Option value="Administrasi">Administrasi</Select.Option><Select.Option value="Farmasi">Farmasi</Select.Option></Select></Form.Item>
                            <Form.Item label="Posisi/Jabatan" name="posisi"><Input placeholder="Dokter Umum" /></Form.Item>
                            <Form.Item label="Status" name="status" initialValue="Aktif"><Select><Select.Option value="Aktif">Aktif</Select.Option><Select.Option value="Cuti">Cuti</Select.Option><Select.Option value="Pensiun">Pensiun</Select.Option></Select></Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Create>
    );
}
