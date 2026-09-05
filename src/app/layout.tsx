import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { RefineProvider } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RSUDAYANI - Sistem Manajemen Data Pegawai",
  description: "Sistem manajemen data pegawai RSUDAYANI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AntdRegistry>
          <RefineProvider>
            {children}
          </RefineProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
