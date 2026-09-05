"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Spin } from "antd";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Kalau belum login, redirect ke login
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Kalau ada role restriction
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role_type)) {
          router.push("/admin/dashboard");
        }
      }
    }
  }, [user, loading, router, allowedRoles]);

  // Show loading while checking auth
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

  // Kalau tidak ada user, return null (akan redirect)
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
