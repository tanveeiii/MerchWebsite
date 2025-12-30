"use client";
import React, { useState, useEffect } from "react";
import { DollarSign, Users, ShoppingBag, Package, Loader2 } from "lucide-react";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 transition-transform hover:scale-[1.02]">
    <div className={`p-4 rounded-full ${color} text-white shadow-md`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0"> {/* min-w-0 fixes flex child truncation issues */}
      <p className="text-sm text-gray-500 font-medium truncate">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 truncate">{value}</h3>
    </div>
  </div>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) router.replace("/admin/login");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

  if (checkingAuth) {
    return (
       <div className="h-[50vh] flex items-center justify-center">
         <Loader2 className="animate-spin text-gray-400" size={32} />
       </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard Overview
        </h1>
        <span className="text-sm text-gray-500">
           Last updated: {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value="$12,450"
          icon={<DollarSign size={24} />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value="154"
          icon={<ShoppingBag size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Products"
          value="45"
          icon={<Package size={24} />}
          color="bg-orange-500"
        />
        <StatCard
          title="Active Users"
          value="1,203"
          icon={<Users size={24} />}
          color="bg-purple-500"
        />
      </div>

      {/* Placeholder for Recent Orders (Visual cue) */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-400">
         <p>Recent Orders Table Component</p>
      </div>
    </div>
  );
}