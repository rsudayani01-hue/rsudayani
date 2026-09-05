"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown, Typography, Spin, message } from "antd";
import { 
  DashboardOutlined, 
  UserOutlined, 
  TeamOutlined, 
  FileTextOutlined, 
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

const { Header, Sider, Content } = AntdLayout;
const { Text } = Typography;
const { Sider: AntdSider } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Redirect to login if not authenticated
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

  // Menu items based on role
  const menuItems: MenuProps["items"] = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/pegawai",
      icon: <TeamOutlined />,
      label: "Data Pegawai",
    },
    {
      key: "/admin/diklat",
      icon: <BookOutlined />,
      label: "Pelatihan",
    },
    {
      key: "/admin/unit-kerja",
      icon: <SettingOutlined />,
      label: "Unit Kerja",
    },
    {
      key: "/admin/jadwal-dinas",
      icon: <CalendarOutlined />,
      label: "Jadwal Dinas",
    },
    {
      key: "/admin/shift-template",
      icon: <ClockCircleOutlined />,
      label: "Template Shift",
    },
    // Super Admin only
    ...(user?.role_type === "super_admin" ? [
      {
        key: "admin-divider",
        type: "divider",
      },
      {
        key: "/admin/users",
        icon: <SafetyOutlined />,
        label: "Kelola User",
      },
    ] : []),
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profil Saya",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    } else if (key.startsWith("/")) {
      router.push(key);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <Spin size="large" tip="Memuat..." />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AntdSider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        style={{ 
          background: "#001529", 
          position: "fixed", 
          left: 0, 
          top: 0, 
          bottom: 0, 
          zIndex: 100,
          overflow: "auto",
        }}
      >
        {/* Logo */}
        <div style={{ 
          height: 64, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: collapsed ? "0 8px" : "0 16px",
        }}>
          {collapsed ? (
            <Text strong style={{ color: "#fff", fontSize: 18 }}>RSU</Text>
          ) : (
            <Text strong style={{ color: "#fff", fontSize: 14, whiteSpace: "nowrap" }}>
              RSI UNDAYANI
            </Text>
          )}
        </div>

        {/* Menu */}
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[pathname]} 
          items={menuItems}
          onClick={({ key }) => key.startsWith("/") && router.push(key)}
        />
      </AntdSider>

      {/* Main Content */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s" }}>
        {/* Header */}
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
            <div 
              onClick={() => setCollapsed(!collapsed)}
              style={{ cursor: "pointer", fontSize: 18 }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <Text strong style={{ fontSize: 16 }}>Sistem Manajemen Kepegawaian</Text>
          </div>

          {/* User Dropdown */}
          <Dropdown 
            menu={{ 
              items: userMenuItems, 
              onClick: handleMenuClick 
            }} 
            placement="bottomRight"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <Avatar style={{ backgroundColor: "#1677ff" }} icon={<UserOutlined />} />
              <div>
                <Text style={{ fontSize: 14, display: "block" }}>{user.name}</Text>
                <Text 
                  type="secondary" 
                  style={{ fontSize: 11 }}
                  style={{ 
                    fontSize: 11, 
                    color: getRoleColor(user.role_type) === "red" ? "#ff4d4f" :
                           getRoleColor(user.role_type) === "orange" ? "#fa8c16" :
                           getRoleColor(user.role_type) === "blue" ? "#1677ff" : "#52c41a"
                  }}
                >
                  {getRoleLabel(user.role_type)}
                </Text>
              </div>
            </div>
          </Dropdown>
        </Header>

        {/* Page Content */}
        <Content style={{ 
          margin: 24, 
          padding: 24, 
          background: "#fff", 
          borderRadius: 8, 
          minHeight: "calc(100vh - 112px)",
          overflow: "auto",
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
