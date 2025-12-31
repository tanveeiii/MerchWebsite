"use client";
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  ShoppingBag,
  Package,
  Loader2,
  Search,
  Eye,
  IndianRupee,
} from "lucide-react";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 transition-transform hover:scale-[1.02]">
    <div className={`p-4 rounded-full ${color} text-white shadow-md`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      {" "}
      {/* min-w-0 fixes flex child truncation issues */}
      <p className="text-sm text-gray-500 font-medium truncate">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 truncate">{value}</h3>
    </div>
  </div>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) router.replace("/admin/login");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/order/admin/dashboard"
      );
      const json = await res.json();
      setStats(json.stats);
      if (Array.isArray(json.recentOrders)) setOrders(json.recentOrders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (checkingAuth || loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700 border-green-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "PROCESSING":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200"; // PENDING
    }
  };

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
          value={"₹ " + stats.totalSales}
          icon={<IndianRupee size={24} />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingBag size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package size={24} />}
          color="bg-orange-500"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<Users size={24} />}
          color="bg-purple-500"
        />
      </div>

      {/* Placeholder for Recent Orders (Visual cue) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                  Order ID
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                  Customer
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                  Amount
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                  Date
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* --- 4. RENDER FILTERED ORDERS --- */}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-medium">No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.order_id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                      #{order.order_number}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {order.user?.first_name} {order.user?.last_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-900 whitespace-nowrap">
                      ${Number(order.total_amount).toFixed(2)}
                    </td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(
                          order.order_status
                        )}`}
                      >
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
