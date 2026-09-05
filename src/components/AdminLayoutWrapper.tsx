"use client";
import dynamic from "next/dynamic";

// AdminLayout uses client-side hooks that require QueryClient
// Disable SSR to avoid "No QueryClient set" error during prerendering
const AdminLayout = dynamic(
  () => import("@/components/admin/Layout").then((mod) => mod.default),
  { ssr: false, loading: () => <div style={{ padding: 20 }}>Loading...</div> }
);

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
