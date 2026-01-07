"use client";
import React, { useEffect, useState } from "react";
import { Loader2, Eye, Search, Filter, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import CustomToast from "@/components/CustomToast";
import { checkAuth } from "@/utils/checkauth";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // --- 1. NEW STATE FOR FILTERING ---
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

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
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "order/admin/all");
      const json = await res.json();
      if (Array.isArray(json.data)) setOrders(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `order/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        CustomToast("Status Updated");
        fetchOrders();
      }
    } catch (e) {
      CustomToast("Failed to update");
    }
  };

  // --- 2. CLIENT-SIDE FILTERING LOGIC ---
  const filteredOrders = orders.filter((order) => {
    // A. Status Filter
    const matchesStatus = filterStatus === "ALL" || order.order_status === filterStatus;

    // B. Search Filter (Checks Order #, First Name, Last Name, Email)
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchLower) ||
      order.user?.first_name?.toLowerCase().includes(searchLower) ||
      order.user?.last_name?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-700 border-green-200";
      case "SHIPPED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "PROCESSING": return "bg-purple-100 text-purple-700 border-purple-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-yellow-100 text-yellow-700 border-yellow-200"; // PENDING
    }
  };

  if (loading || checkingAuth)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-6">
      <ToastContainer />
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Order Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
             Manage and track all customer orders here.
          </p>
        </div>
        
        {/* --- 3. ACTIVE SEARCH AND FILTER INPUTS --- */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Status Dropdown */}
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full sm:w-40 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text"
                    placeholder="Search ID, Name, or Email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Order ID</th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Customer</th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Amount</th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Date</th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {/* --- 4. RENDER FILTERED ORDERS --- */}
              {filteredOrders.length === 0 ? (
                 <tr>
                    <td colSpan="6" className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <Search size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">No orders found</p>
                            <p className="text-sm">Try adjusting your search or filters.</p>
                        </div>
                    </td>
                 </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50/80 transition-colors group">
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
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.order_status)}`}
                      >
                        {order.order_status}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/orders/${order.order_id}`)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <select
                          className="border border-gray-300 rounded-lg py-1.5 px-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-gray-400 transition-colors"
                          value={order.order_status}
                          onChange={(e) =>
                            handleStatusUpdate(order.order_id, e.target.value)
                          }
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
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