import dynamic from "next/dynamic";

// Admin pages use client-side hooks (useLogout, useGetIdentity) that require QueryClient
// Disable SSR to avoid "No QueryClient set" error during prerendering
const AdminLayout = dynamic(
  () => import("@/components/admin/Layout").then((mod) => mod.AdminLayout),
  { ssr: false }
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
