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
      router.push("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // 3. Loading Spinner
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  // 4. Login Page (Full Screen, No Sidebar)
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // 5. Admin Dashboard Layout
  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar: 
          On Mobile: It's fixed/absolute (handled inside AdminSidebar component).
          On Desktop: It takes up physical space.
      */}
      <div className="md:w-64 flex-shrink-0">
         <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden">
        {/* p-4: Small padding on mobile
            md:p-8: Larger padding on desktop
            pt-20: Extra top padding on mobile to clear the Hamburger button
            md:pt-8: Standard top padding on desktop
        */}
        <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}