"use client";
import React, { useState, useEffect } from "react";
import { DollarSign, Users, ShoppingBag, Package } from "lucide-react";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
    <div className={`p-4 rounded-full ${color} text-white`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      {/* You can add a Recent Orders table here later */}
    </div>
  );
}
