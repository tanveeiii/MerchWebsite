"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Tag, Folder, MessageSquare, LogOut, ClipboardList } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // 1. Clear Admin Session
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminName");
    
    // 2. Redirect to Login or Home
    router.push("/admin/login"); 
  };

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Products", icon: <Package size={20} />, path: "/admin/products" },
    { name: "Orders", icon: <ShoppingBag size={20} />, path: "/admin/orders" },
    { name: "Inventory", icon: <ClipboardList size={20} />, path: "/admin/inventory" },
    { name: "Categories", icon: <Folder size={20} />, path: "/admin/categories" },
    { name: "Tags", icon: <Tag size={20} />, path: "/admin/tags" },
    { name: "Complaints", icon: <MessageSquare size={20} />, path: "/admin/complaints" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6 flex flex-col fixed left-0 top-0 z-50">
      <div className="text-2xl font-bold mb-10 tracking-wider text-center border-b border-gray-700 pb-4">
        ADMIN PANEL
      </div>
      
      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              pathname === item.path ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 rounded-lg mt-auto transition-colors w-full"
      >
        <LogOut size={20} />
        <span>Log Out</span>
      </button>
    </div>
  );
}