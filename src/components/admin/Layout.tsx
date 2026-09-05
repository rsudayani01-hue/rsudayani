"use client";
import React from "react";
import { Layout as AntdLayout, Menu, Avatar, Dropdown, Typography } from "antd";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { DashboardOutlined, UserOutlined, FileOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Header, Sider, Content } = AntdLayout;
const { Text } = Typography;

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { mutate: logout } = useLogout();
    const { data: identity } = useGetIdentity<any>();
    const router = useRouter();
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <AntdLayout style={{ minHeight: "100vh" }}>
            <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: "#001529", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100 }}>
                <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <Text strong style={{ color: "#fff", fontSize: collapsed ? 18 : 16 }}>{collapsed ? "RSI" : "RSI Undayani"}</Text>
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={["/admin/dashboard"]} onClick={({ key }) => router.push(key)} items={[
                    { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
                    { key: "/admin/pegawai", icon: <UserOutlined />, label: "Pegawai" },
                    { key: "/admin/dokumen", icon: <FileOutlined />, label: "Dokumen" },
                ]} />
            </Sider>
            <AntdLayout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s" }}>
                <Header style={{ padding: "0 24px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 99, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, { style: { fontSize: 18, cursor: "pointer" }, onClick: () => setCollapsed(!collapsed) })}
                        <Text strong style={{ fontSize: 16 }}>Sistem Manajemen Data Pegawai</Text>
                    </div>
                    <Dropdown menu={{ items: [{ key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true }], onClick: ({ key }) => key === "logout" && logout() }} placement="bottomRight">
                        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                            <Avatar style={{ backgroundColor: "#1677ff" }} icon={<UserOutlined />} />
                            <div><Text style={{ fontSize: 14 }}>{identity?.name || "User"}</Text><br/><Text type="secondary" style={{ fontSize: 12 }}>{identity?.role || "pegawai"}</Text></div>
                        </div>
                    </Dropdown>
                </Header>
                <Content style={{ margin: 24, padding: 24, background: "#fff", borderRadius: 8, minHeight: "calc(100vh - 112px)" }}>
                    {children}
                </Content>
            </AntdLayout>
        </AntdLayout>
    );
};
