// Role types
export type RoleType = "super_admin" | "admin_kategori" | "admin_unit" | "user";

// Kategori Nakes
export const KATEGORI_NAKES = [
  { value: "Dokter", label: "Dokter" },
  { value: "Perawat", label: "Perawat" },
  { value: "KTKL", label: "KTKL" },
  { value: "Admin", label: "Admin" },
  { value: "Manajemen", label: "Manajemen" },
  { value: "Direksi", label: "Direksi" },
] as const;

// Status Kepegawaian
export const STATUS_KEPEGAWAIAN = [
  { value: "PNS", label: "PNS" },
  { value: "PPPK", label: "PPPK" },
  { value: "PPPK Paruh Waktu BLUD", label: "PPPK Paruh Waktu BLUD" },
  { value: "PPPK Paruh Waktu THL", label: "PPPK Paruh Waktu THL" },
  { value: "BLUD", label: "BLUD" },
  { value: "THL", label: "THL" },
  { value: "Honorer", label: "Honorer" },
  { value: "Kontrak", label: "Kontrak" },
] as const;

// Pendidikan Terakhir
export const PENDIDIKAN_TERAKHIR = [
  { value: "SMA", label: "SMA" },
  { value: "D3", label: "D3" },
  { value: "D4/S1", label: "D4/S1" },
  { value: "Profesi", label: "Profesi" },
  { value: "S2", label: "S2" },
  { value: "Spesialis", label: "Spesialis" },
  { value: "Sub Spesialis", label: "Sub Spesialis" },
  { value: "S3", label: "S3" },
] as const;

// Agama
export const AGAMA = [
  { value: "Islam", label: "Islam" },
  { value: "Kristen", label: "Kristen" },
  { value: "Katolik", label: "Katolik" },
  { value: "Hindu", label: "Hindu" },
  { value: "Budha", label: "Budha" },
  { value: "Khonghucu", label: "Khonghucu" },
] as const;

// Jenis Kelamin
export const JENIS_KELAMIN = [
  { value: "Laki-laki", label: "Laki-laki" },
  { value: "Perempuan", label: "Perempuan" },
] as const;

// Role untuk select di form
export const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin — Akses penuh" },
  { value: "admin_kategori", label: "Admin Kategori — Akses per kategori" },
  { value: "admin_unit", label: "Admin Unit — Akses per unit kerja" },
  { value: "user", label: "User — Akses data diri sendiri" },
] as const;

// Kategori Diklat/Pelatihan
export const KATEGORI_DIKLAT = [
  { value: "Pelatihan Khusus", label: "Pelatihan Khusus" },
  { value: "Pelatihan Akreditasi", label: "Pelatihan Akreditasi (Wajib KARS)" },
  { value: "IHT", label: "IHT (In House Training)" },
  { value: "Sertifikasi", label: "Sertifikasi" },
  { value: "Workshop", label: "Workshop" },
  { value: "Seminar", label: "Seminar" },
  { value: "Diklat", label: "Diklat" },
  { value: "Lainnya", label: "Lainnya" },
] as const;

// Topik KARS
export const TOPIK_KARS = [
  { value: "PMKP", label: "PMKP" },
  { value: "Etik RS", label: "Etik RS" },
  { value: "BHD", label: "BHD" },
  { value: "K3 dan Kebakaran", label: "K3 dan Kebakaran" },
  { value: "MFK", label: "MFK" },
  { value: "Hand Hygiene", label: "Hand Hygiene" },
  { value: "Hak dan Kewajiban Pasien & Keluarga", label: "Hak & Kewajiban Pasien" },
  { value: "BHD dan BHL", label: "BHD dan BHL" },
  { value: "K3", label: "K3" },
  { value: "B3", label: "B3" },
  { value: "PIC Data", label: "PIC Data" },
  { value: "Sistem Informasi", label: "Sistem Informasi" },
  { value: "Pembersihan, desinfeksi, dan sterilisasi", label: "PDS" },
  { value: "Outbreak", label: "Outbreak" },
  { value: "APD", label: "APD" },
  { value: "Regulasi dan praktik program PPI", label: "PPI" },
  { value: "POCT", label: "POCT" },
  { value: "Skrining, pengkajian dan tatalaksana pasien risiko bunuh diri", label: "Skrining Bunuh Diri" },
  { value: "EWS", label: "EWS" },
  { value: "Edukasi nyeri", label: "Edukasi Nyeri" },
  { value: "Sitostatik dispensing", label: "Sitostatik" },
  { value: "Medication error", label: "Medication Error" },
  { value: "Komunikasi efektif", label: "Komunikasi Efektif" },
  { value: "Jejaring PONEK", label: "Jejaring PONEK" },
  { value: "Stunting & wasting", label: "Stunting & Wasting" },
  { value: "PPRA", label: "PPRA" },
] as const;

// Jabatan Perawat
export const JABATAN_PERAWAT = [
  { value: "PK 1", label: "PK 1" },
  { value: "PK 2", label: "PK 2" },
  { value: "PK 3", label: "PK 3" },
  { value: "PK 4", label: "PK 4" },
  { value: "PK 5", label: "PK 5" },
] as const;

// Role label helper
export const getRoleLabel = (role: RoleType): string => {
  const labels: Record<RoleType, string> = {
    super_admin: "Super Admin",
    admin_kategori: "Admin Kategori",
    admin_unit: "Admin Unit",
    user: "User",
  };
  return labels[role] || role;
};

// Role color helper untuk Badge
export const getRoleColor = (role: RoleType): string => {
  const colors: Record<RoleType, string> = {
    super_admin: "red",
    admin_kategori: "orange",
    admin_unit: "blue",
    user: "green",
  };
  return colors[role] || "default";
};
