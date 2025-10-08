"use client";

import { usePathname } from "next/navigation";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export default function AdminAuthWrapper({ children }) {
  const pathname = usePathname();

  // Check if this is an admin page based on pathname
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    console.log(
      "AdminAuthWrapper: Wrapping admin page with AdminAuthProvider:",
      pathname
    );
  }

  // If not an admin page, just return children without the admin context
  if (!isAdminPage) {
    return children;
  }

  // Wrap admin pages with the admin auth context
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
