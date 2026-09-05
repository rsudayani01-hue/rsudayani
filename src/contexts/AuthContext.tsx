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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user dari localStorage
    const savedUser = localStorage.getItem("hrbase_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Login attempt:", email);

    // Retry logic for network issues
    const maxRetries = 2;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Clear any stale session state before retry
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt}...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .eq("is_aktif", true)
          .single();

        console.log("Query result:", { data, error, attempt });

        if (error) {
          console.error("Supabase error:", error);

          // Check if it's a network-related error
          const errorMsg = error.message || '';
          if (
            errorMsg.includes('NetworkError') ||
            errorMsg.includes('fetch') ||
            errorMsg.includes('network') ||
            error.code === '' ||
            error.details === ''
          ) {
            lastError = { isNetworkError: true, message: "Gagal terhubung ke database. Cek koneksi internet Anda." };
            continue; // Retry
          }

          return { success: false, error: "Gagal terhubung ke database. " + error.message };
        }

        if (!data) {
          return { success: false, error: "Email tidak ditemukan atau akun nonaktif" };
        }

        // Password check
        if (data.password !== password) {
          return { success: false, error: "Password salah" };
        }

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
        console.error("Login catch error:", err, { attempt });

        // Check if it's a network error
        const errorMessage = (err as Error).message || '';
        if (errorMessage.includes('NetworkError') || errorMessage.includes('fetch') || errorMessage.includes('network')) {
          lastError = { isNetworkError: true, message: "Gagal terhubung ke database. Cek koneksi internet Anda." };
          continue; // Retry
        }

        return { success: false, error: "Terjadi kesalahan: " + errorMessage };
      }
    }

    // All retries failed
    if (lastError?.isNetworkError) {
      return { success: false, error: lastError.message };
    }

    return { success: false, error: "Gagal terhubung ke database setelah beberapa percobaan." };
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("hrbase_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
