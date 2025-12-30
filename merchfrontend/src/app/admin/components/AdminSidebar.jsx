"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Folder,
  MessageSquare,
  LogOut,
  ClipboardList,
  Activity,
  Menu,
  X,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar automatically when route changes (mobile UX)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminName");
    router.push("/admin/login");
  };

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Analytics", icon: <Activity size={20} />, path: "/admin/analytics" },
    { name: "Products", icon: <Package size={20} />, path: "/admin/products" },
    { name: "Orders", icon: <ShoppingBag size={20} />, path: "/admin/orders" },
    { name: "Returns", icon: <ShoppingBag size={20} />, path: "/admin/return-requests" },
    { name: "Inventory", icon: <ClipboardList size={20} />, path: "/admin/inventory" },
    { name: "Categories", icon: <Folder size={20} />, path: "/admin/categories" },
    { name: "Tags", icon: <Tag size={20} />, path: "/admin/tags" },
    { name: "Coupons", icon: <Tag size={20} />, path: "/admin/coupons" },
    { name: "Templates", icon: <Activity size={20} />, path: "/admin/templates" },
    { name: "Reviews", icon: <MessageSquare size={20} />, path: "/admin/reviews" },
    { name: "Complaints", icon: <MessageSquare size={20} />, path: "/admin/complaints" },
  ];

  return (
    <>
      {/* --- MOBILE TOGGLE BUTTON --- */}
      {/* Visible only on mobile/tablet (md:hidden) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-gray-900 text-white rounded-md shadow-lg hover:bg-gray-800 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      {/* Darkens the background when menu is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-white p-6 flex flex-col 
          transition-transform duration-300 ease-in-out shadow-xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:shadow-none
        `}
      >
        {/* LOGO AREA */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
          <div className="text-2xl font-bold tracking-wider text-center w-full">
            ADMIN PANEL
          </div>
          {/* Close button inside sidebar for mobile */}
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION LINKS (Scrollable Area) */}
        {/* Added overflow-y-auto to handle small screens/long menus */}
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
          {menu.map((item) => {
             const isActive = pathname === item.path;
             return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                    {item.icon}
                </span>
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON (Pinned to bottom) */}
        <div className="pt-4 border-t border-gray-800 mt-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}