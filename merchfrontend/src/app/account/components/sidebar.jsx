"use client";
import { User, Package, MapPin, Lock, LogOut } from "lucide-react"; // Added LogOut icon
import { useRouter } from "next/navigation"; // Added router for redirect

export default function Sidebar({ activeSection, setActiveSection, userData }) {
  const router = useRouter();

  const menu = [
    { name: "Account overview", icon: <User size={18} />, key: "overview" },
    { name: "My orders", icon: <Package size={18} />, key: "orders" },
    { name: "My returns", icon: <Package size={18} />, key: "returns" },
    { name: "Address book", icon: <MapPin size={18} />, key: "address" },
    { name: "Change password", icon: <Lock size={18} />, key: "password" }
  ];

  // Helper to safely get display values
  const firstName = userData?.first_name || "User";
  const lastName = userData?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  
  // Calculate initials (e.g., "John Doe" -> "JD")
  const initials = firstName ? (firstName[0] + (lastName ? lastName[0] : "")).toUpperCase() : "U";

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    // 1. Clear sensitive data from storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken"); // clear potential extra tokens
    
    // 2. Redirect to Login Page
    router.push("/auth/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 mx-10">
      {/* Profile Section */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
          {initials}
        </div>
        <div className="ml-3">
          <p className="font-semibold text-gray-800">Hi,</p>
          <p className="font-bold text-gray-900 truncate w-32" title={fullName}>
            {fullName}
          </p>
        </div>
      </div>

      {/* Menu */}
      <ul className="space-y-2">
        {menu.map((item) => (
          <li
            key={item.key}
            className={`flex items-center gap-3 p-2 rounded cursor-pointer text-sm ${
              activeSection === item.key
                ? "bg-white font-semibold shadow"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveSection(item.key)}
          >
            {item.icon}
            <span>{item.name}</span>
          </li>
        ))}

        {/* Separator Line */}
        <hr className="border-gray-300 my-2" />

        {/* LOG OUT BUTTON */}
        <li
          className="flex items-center gap-3 p-2 rounded cursor-pointer text-sm text-red-600 hover:bg-red-100 transition-colors font-medium"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </li>
      </ul>
    </div>
  );
}