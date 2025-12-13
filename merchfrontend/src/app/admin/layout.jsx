"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. Allow access to login page without check
    if (pathname === "/admin/login") {
      setAuthorized(true);
      return;
    }

    // 2. Check for Admin Flag
    const isAdmin = localStorage.getItem("adminAuthenticated");

    if (!isAdmin) {
      // Not logged in? Redirect immediately
      router.push("/admin/login");
    } else {
      // Logged in? Show content
      setAuthorized(true);
    }
  }, [pathname, router]);

  // 3. Show Loading Spinner while checking (prevents flashing secret content)
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  // 4. If on Login page, don't show Sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // 5. Render Admin Dashboard Layout
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}