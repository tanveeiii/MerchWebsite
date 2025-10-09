"use client";
import { User, Package, MapPin, Lock, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import react from "react";

export default function Sidebar({activeSection, setActiveSection}) {
  const menu = [
    { name: "Account overview", icon: <User size={18} />, key: "overview" },
    { name: "My orders", icon: <Package size={18} />, key:"orders" },
    { name: "My returns", icon: <Package size={18} />, key:"returns" },
    { name: "Address book", icon: <MapPin size={18} />, key:"address" },
    { name: "Change password", icon: <Lock size={18} />, key:"password" }
  ];

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 mx-10">
      {/* Profile Section */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
          TA
        </div>
        <div className="ml-3">
          <p className="font-semibold text-gray-800">Hi,</p>
          <p className="font-bold text-gray-900">Tanvi Agarwal</p>
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
      </ul>
    </div>
  );
}
