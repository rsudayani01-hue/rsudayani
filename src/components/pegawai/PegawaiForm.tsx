"use client";

import React, { useState } from "react";
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Tabs, 
  Card, 
  Button, 
  Upload, 
  Space,
  Divider,
  message,
  Row,
  Col
} from "antd";
import { UploadOutlined, PlusOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { 
  KATEGORI_NAKES, 
  STATUS_KEPEGAWAIAN, 
  PENDIDIKAN_TERAKHIR, 
  AGAMA, 
  JENIS_KELAMIN,
  JABATAN_PERAWAT
} from "@/lib/roles";
import type { UploadFile } from "antd/es/upload/interface";

const { TextArea } = Input;
const { Dragger } = Upload;

interface BerkasItem {
  nama_berkas: string;
  file: string;
}

interface PegawaiFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PegawaiForm({ initialData, onSuccess, onCancel }: PegawaiFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [berkasSk, setBerkasSk] = useState<BerkasItem[]>(initialData?.berkas_sk || []);
  const [berkasPendidikan, setBerkasPendidikan] = useState<BerkasItem[]>(initialData?.berkas_pendidikan || []);
  const [berkasPribadi, setBerkasPribadi] = useState<BerkasItem[]>(initialData?.berkas_pribadi || []);
  const [berkasLainnya, setBerkasLainnya] = useState<BerkasItem[]>(initialData?.berkas_lainnya || []);
  const [activeTab, setActiveTab] = useState("1");

  const kategoriNakes = Form.useWatch("kategori_nakes", form);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        nik: values.nik,
        masa_berlaku_str: values.masa_berlaku_str?.format("YYYY-MM-DD"),
        masa_berlaku_sip: values.masa_berlaku_sip?.format("YYYY-MM-DD"),
        tanggal_lahir: values.tanggal_lahir?.format("YYYY-MM-DD"),
        tanggal_mulai_bekerja: values.tanggal_mulai_bekerja?.format("YYYY-MM-DD"),
        berkas_sk: JSON.stringify(berkasSk),
        berkas_pendidikan: JSON.stringify(berkasPendidikan),
        berkas_pribadi: JSON.stringify(berkasPribadi),
        berkas_lainnya: JSON.stringify(berkasLainnya),
      };

      if (initialData?.id) {
        // Update
        const { error } = await supabase
          .from("pegawais")
          .update(data)
          .eq("id", initialData.id);

        if (error) throw error;
        message.success("Data berhasil diperbarui!");
      } else {
        // Create
        const { error } = await supabase
          .from("pegawais")
          .insert(data);

        if (error) throw error;
        message.success("Data berhasil disimpan!");
      }

      onSuccess?.();
    } catch (error: any) {
      message.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // Tab items
  const tabItems = [
    {
      key: "1",
      label: "Data Pribadi",
      children: (
        <Card size="small">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="NIK" name="nik" rules={[{ required: true }]}>
                <Input placeholder="Nomor Induk Kependudukan" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Nama Lengkap" name="nama" rules={[{ required: true }]}>
                <Input placeholder="Nama lengkap" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tempat Lahir" name="tempat_lahir">
                <Input placeholder="Tempat lahir" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tanggal Lahir" name="tanggal_lahir">
                <DatePicker style={{ width: "100%" }} placeholder="Pilih tanggal" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Jenis Kelamin" name="jenis_kelamin">
                <Select placeholder="Pilih" options={JENIS_KELAMIN.map(j => ({ value: j.value, label: j.label }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Agama" name="agama">
                <Select placeholder="Pilih" options={AGAMA.map(a => ({ value: a.value, label: a.label }))} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="No. HP" name="no_hp">
                <Input placeholder="08xxxxxxxxxx" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email" name="email">
                <Input placeholder="email@contoh.com" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Alamat Domisili" name="alamat_domisili">
            <TextArea rows={2} placeholder="Alamat lengkap" />
          </Form.Item>
        </Card>
      ),
    },
    {
      key: "2",
      label: "Kepegawaian & Profesi",
      children: (
        <Card size="small">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Kategori Nakes" name="kategori_nakes" rules={[{ required: true }]}>
                <Select placeholder="Pilih kategori" options={KATEGORI_NAKES.map(k => ({ value: k.value, label: k.label }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Status Kepegawaian" name="status_kepegawaian">
                <Select placeholder="Pilih status" options={STATUS_KEPEGAWAIAN.map(s => ({ value: s.value, label: s.label }))} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              {kategoriNakes === "Perawat" ? (
                <Form.Item label="Jabatan (PK)" name="jabatan">
                  <Select placeholder="Pilih PK" options={JABATAN_PERAWAT.map(j => ({ value: j.value, label: j.label }))} />
                </Form.Item>
              ) : (
                <Form.Item label="Jabatan" name="jabatan">
                  <Input placeholder="Nama jabatan" />
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              <Form.Item label="Unit Kerja" name="unit_kerja">
                <Input placeholder="Nama unit kerja" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="NIP" name="nip">
                <Input placeholder="Nomor Induk Pegawai" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tanggal Mulai Bekerja" name="tanggal_mulai_bekerja">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Divider>STR & SIP</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Nomor STR" name="str">
                <Input placeholder="Nomor STR" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Masa Berlaku STR" name="masa_berlaku_str">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Nomor SIP" name="sip">
                <Input placeholder="Nomor SIP" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Masa Berlaku SIP" name="masa_berlaku_sip">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      key: "3",
      label: "Pendidikan",
      children: (
        <Card size="small">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Pendidikan Terakhir" name="pendidikan_terakhir">
                <Select placeholder="Pilih pendidikan" options={PENDIDIKAN_TERAKHIR.map(p => ({ value: p.value, label: p.label }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tahun Lulus" name="tahun_lulus">
                <Input placeholder="2020" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Nama Institusi" name="nama_institusi">
            <Input placeholder="Nama sekolah/perguruan tinggi" />
          </Form.Item>
        </Card>
      ),
    },
    {
      key: "4",
      label: "Berkas Digital",
      children: (
        <div>
          {/* Berkas SK */}
          <Card 
            title="Berkas SK Kepegawaian" 
            size="small" 
            style={{ marginBottom: 16 }}
            extra={
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={() => setBerkasSk([...berkasSk, { nama_berkas: "", file: "" }])}
              >
                Tambah
              </Button>
            }
          >
            {berkasSk.map((item, index) => (
              <div key={index} style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
                <Input 
                  placeholder="Nama Berkas (cth: SK PNS)" 
                  value={item.nama_berkas}
                  onChange={(e) => {
                    const newData = [...berkasSk];
                    newData[index].nama_berkas = e.target.value;
                    setBerkasSk(newData);
                  }}
                  style={{ flex: 1 }}
                />
                <Upload
                  accept=".pdf,.jpg,.jpeg,.png"
                  showUploadList={false}
                  beforeUpload={async (file) => {
                    const newData = [...berkasSk];
                    // Upload to storage
                    const fileName = `${Date.now()}_${file.name}`;
                    const { data, error } = await supabase.storage
                      .from("arsip-pegawai")
                      .upload(`sk/${fileName}`, file);
                    
                    if (!error && data) {
                      const { data: urlData } = supabase.storage
                        .from("arsip-pegawai")
                        .getPublicUrl(`sk/${fileName}`);
                      newData[index].file = urlData.publicUrl;
                      setBerkasSk(newData);
                    }
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => setBerkasSk(berkasSk.filter((_, i) => i !== index))}
                />
              </div>
            ))}
            {berkasSk.length === 0 && <p style={{ color: "#999" }}>Belum ada berkas</p>}
          </Card>

          {/* Berkas Pendidikan */}
          <Card 
            title="Berkas Pendidikan" 
            size="small" 
            style={{ marginBottom: 16 }}
            extra={
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={() => setBerkasPendidikan([...berkasPendidikan, { nama_berkas: "", file: "" }])}
              >
                Tambah
              </Button>
            }
          >
            {berkasPendidikan.map((item, index) => (
              <div key={index} style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
                <Input 
                  placeholder="Nama Berkas (cth: Ijazah S1)" 
                  value={item.nama_berkas}
                  onChange={(e) => {
                    const newData = [...berkasPendidikan];
                    newData[index].nama_berkas = e.target.value;
                    setBerkasPendidikan(newData);
                  }}
                  style={{ flex: 1 }}
                />
                <Button danger icon={<DeleteOutlined />} onClick={() => setBerkasPendidikan(berkasPendidikan.filter((_, i) => i !== index))} />
              </div>
            ))}
            {berkasPendidikan.length === 0 && <p style={{ color: "#999" }}>Belum ada berkas</p>}
          </Card>

          {/* Berkas Pribadi */}
          <Card 
            title="Berkas Data Pribadi" 
            size="small" 
            style={{ marginBottom: 16 }}
            extra={
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={() => setBerkasPribadi([...berkasPribadi, { nama_berkas: "", file: "" }])}
              >
                Tambah
              </Button>
            }
          >
            {berkasPribadi.map((item, index) => (
              <div key={index} style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
                <Input 
                  placeholder="Nama Berkas (cth: KTP)" 
                  value={item.nama_berkas}
                  onChange={(e) => {
                    const newData = [...berkasPribadi];
                    newData[index].nama_berkas = e.target.value;
                    setBerkasPribadi(newData);
                  }}
                  style={{ flex: 1 }}
                />
                <Button danger icon={<DeleteOutlined />} onClick={() => setBerkasPribadi(berkasPribadi.filter((_, i) => i !== index))} />
              </div>
            ))}
            {berkasPribadi.length === 0 && <p style={{ color: "#999" }}>Belum ada berkas</p>}
          </Card>
        </div>
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialData ? {
        ...initialData,
        masa_berlaku_str: initialData.masa_berlaku_str ? dayjs(initialData.masa_berlaku_str) : null,
        masa_berlaku_sip: initialData.masa_berlaku_sip ? dayjs(initialData.masa_berlaku_sip) : null,
        tanggal_lahir: initialData.tanggal_lahir ? dayjs(initialData.tanggal_lahir) : null,
        tanggal_mulai_bekerja: initialData.tanggal_mulai_bekerja ? dayjs(initialData.tanggal_mulai_bekerja) : null,
      } : undefined}
    >
      <Tabs 
        items={tabItems} 
        activeKey={activeTab} 
        onChange={setActiveTab}
      />
      
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Space>
          {onCancel && (
            <Button onClick={onCancel}>
              Batal
            </Button>
          )}
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialData ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </Space>
      </div>
    </Form>
  );
}
