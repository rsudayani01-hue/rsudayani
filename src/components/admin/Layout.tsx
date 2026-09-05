"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown, Typography, Spin, message } from "antd";
import { 
  DashboardOutlined, 
  UserOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  LogoutOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  SafetyOutlined,
  BookOutlined
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getRoleLabel, getRoleColor } from "@/lib/roles";
import type { MenuProps } from "antd";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/(auth)/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    message.success("Logout berhasil!");
    router.push("/(auth)/login");
  };

  const menuItems: MenuProps["items"] = [
    { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/admin/pegawai", icon: <TeamOutlined />, label: "Data Pegawai" },
    { key: "/admin/diklat", icon: <BookOutlined />, label: "Pelatihan" },
    { key: "/admin/unit-kerja", icon: <SettingOutlined />, label: "Unit Kerja" },
    { key: "/admin/jadwal-dinas", icon: <CalendarOutlined />, label: "Jadwal Dinas" },
    { key: "/admin/shift-template", icon: <ClockCircleOutlined />, label: "Template Shift" },
    ...(user?.role_type === "super_admin" ? [
      { type: "divider" as const },
      { key: "/admin/users", icon: <SafetyOutlined />, label: "Kelola User" },
    ] : []),
  ];

  const userMenuItems: MenuProps["items"] = [
    { key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Memuat..." />
      </div>
    );
  }

  if (!user) return null;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        style={{ background: "#001529", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100, overflow: "auto" }}
      >
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Text strong style={{ color: "#fff", fontSize: 14, whiteSpace: "nowrap" }}>
            {collapsed ? "RSU" : "RSI UNDAYANI"}
          </Text>
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[pathname]} 
          items={menuItems}
          onClick={({ key }) => key.startsWith("/") && router.push(key)}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s" }}>
        <Header style={{ 
          padding: "0 24px", 
          background: "#fff", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          position: "sticky", 
          top: 0, 
          zIndex: 99, 
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          height: 64,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div onClick={() => setCollapsed(!collapsed)} style={{ cursor: "pointer", fontSize: 18 }}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <Text strong style={{ fontSize: 16 }}>Sistem Manajemen Kepegawaian</Text>
          </div>
          <Dropdown 
            menu={{ items: userMenuItems, onClick: ({ key }) => key === "logout" && handleLogout() }} 
            placement="bottomRight"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <Avatar style={{ backgroundColor: "#1677ff" }} icon={<UserOutlined />} />
              <div>
                <Text style={{ fontSize: 14, display: "block" }}>{user.name}</Text>
                <Text style={{ fontSize: 11, color: getRoleColor(user.role_type) === "red" ? "#ff4d4f" : "#666" }}>
                  {getRoleLabel(user.role_type)}
                </Text>
              </div>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: 24, padding: 24, background: "#fff", borderRadius: 8, minHeight: "calc(100vh - 112px)", overflow: "auto" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
