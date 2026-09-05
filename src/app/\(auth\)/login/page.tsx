"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Form, Input, Button, Card, message, App } from "antd";
import { UserOutlined, LockOutlined, HospitalIcon } from "@ant-design/icons";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    const result = await login(values.email, values.password);
    setLoading(false);

    if (result.success) {
      message.success("Login berhasil!");
      router.push("/admin/dashboard");
    } else {
      message.error(result.error || "Login gagal");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
    }}>
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          borderRadius: 16,
        }}
        styles={{ body: { padding: 40 } }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <HospitalIcon style={{ fontSize: 40, color: "white" }} />
          </div>
          <h1 style={{ 
            fontSize: 24, 
            fontWeight: "bold", 
            margin: 0,
            color: "#333"
          }}>
            RSI Undayani
          </h1>
          <p style={{ color: "#666", margin: "8px 0 0" }}>
            Sistem Manajemen Kepegawaian
          </p>
        </div>

        {/* Form */}
        <App>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email harus diisi!" },
                { type: "email", message: "Format email tidak valid!" }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Password harus diisi!" }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 48,
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Masuk
              </Button>
            </Form.Item>
          </Form>
        </App>

        {/* Footer */}
        <div style={{ 
          textAlign: "center", 
          marginTop: 24,
          color: "#999",
          fontSize: 12 
        }}>
          <p style={{ margin: 0 }}>
            Demo: admin@test.com / admin123
          </p>
        </div>
      </Card>
    </div>
  );
}
