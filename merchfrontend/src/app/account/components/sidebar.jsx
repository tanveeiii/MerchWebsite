"use client";
import { User, Package, MapPin, Lock, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar({ activeSection, setActiveSection, userData }) {
  const router = useRouter();

  const menu = [
    { name: "Overview", icon: <User size={18} />, key: "overview" },
    { name: "Orders", icon: <Package size={18} />, key: "orders" },
    { name: "Returns", icon: <Package size={18} />, key: "returns" },
    { name: "Address", icon: <MapPin size={18} />, key: "address" },
    { name: "Password", icon: <Lock size={18} />, key: "password" }
  ];

  const firstName = userData?.first_name || "User";
  const lastName = userData?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = firstName ? (firstName[0] + (lastName ? lastName[0] : "")).toUpperCase() : "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    router.push("/auth/login");
  };

  return (
    <div className="w-full lg:w-72 lg:h-screen bg-white lg:bg-gray-100 p-4 lg:p-6 border-b lg:border-r border-gray-200 lg:border-none flex flex-col gap-4 transition-all">
      
      {/* Profile Section */}
      <div className="flex items-center gap-3 lg:mb-6">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-lg flex-shrink-0 shadow-sm">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Welcome,</p>
          <p className="font-bold text-gray-900 truncate max-w-[150px] lg:max-w-[200px]" title={fullName}>
            {fullName}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      {/* Mobile: Horizontal Scroll | Desktop: Vertical List */}
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveSection(item.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
              ${activeSection === item.key
                ? "bg-black text-white shadow-md lg:translate-x-1"
                : "bg-gray-50 lg:bg-transparent text-gray-600 hover:bg-gray-200 lg:hover:bg-white"
              }
            `}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}

        <div className="h-px bg-gray-300 my-2 hidden lg:block" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all whitespace-nowrap flex-shrink-0"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}