"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  id: number;
  name: string;
  email: string;
  role_type: "super_admin" | "admin_kategori" | "admin_unit" | "user";
  kategori_nakes?: string;
  unit_kerja?: string;
  pegawai_id?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isSuperAdmin: () => boolean;
  isAdminKategori: () => boolean;
  isAdminUnit: () => boolean;
  isUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user dari localStorage saat mount
  useEffect(() => {
    const savedUser = localStorage.getItem("hrbase_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // Cek user di tabel users
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("is_aktif", true)
        .single();

      if (error || !data) {
        return { success: false, error: "Email tidak ditemukan atau akun nonaktif" };
      }

      // Simple password check
      // NOTE: Untuk production, gunakan password hash!
      if (data.password !== password) {
        return { success: false, error: "Password salah" };
      }

      // Simpan user ke state & localStorage
      const userData: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role_type: data.role_type,
        kategori_nakes: data.kategori_nakes,
        unit_kerja: data.unit_kerja,
        pegawai_id: data.pegawai_id,
      };

      setUser(userData);
      localStorage.setItem("hrbase_user", JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Terjadi kesalahan saat login" };
    }
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    localStorage.removeItem("hrbase_user");
  };

  // Role check functions
  const isSuperAdmin = () => user?.role_type === "super_admin";
  const isAdminKategori = () => user?.role_type === "admin_kategori";
  const isAdminUnit = () => user?.role_type === "admin_unit";
  const isUser = () => user?.role_type === "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isSuperAdmin,
        isAdminKategori,
        isAdminUnit,
        isUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
