"use client";
import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle, Clock, Truck, Eye } from "lucide-react"; // Added Eye
import { useRouter } from "next/navigation"; // Added useRouter
import { ToastContainer, toast } from "react-toastify";
import CustomToast from "@/components/CustomToast";
import { checkAuth } from "@/utils/checkauth";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router
  const [checkingAuth, setCheckingAuth] = useState(true);

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
      const res = await fetch("http://localhost:5000/api/order/admin/all");
      const json = await res.json();
      if (Array.isArray(json)) setOrders(json);
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
      const res = await fetch(`http://localhost:5000/api/order/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        CustomToast("Status Updated");
        fetchOrders(); // Refresh
      }
    } catch (e) {
      CustomToast("Failed to update");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div>
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Order Management
      </h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Order ID</th>
              <th className="p-4 font-semibold text-gray-700">Customer</th>
              <th className="p-4 font-semibold text-gray-700">Amount</th>
              <th className="p-4 font-semibold text-gray-700">Date</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
              <th className="p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">#{order.order_number}</td>
                <td className="p-4">
                  <div className="font-medium">
                    {order.user?.first_name} {order.user?.last_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email}
                  </div>
                </td>
                <td className="p-4 font-bold text-green-600">
                  ${order.total_amount}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.order_status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.order_status === "SHIPPED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </td>
                <td className="p-4 flex items-center gap-3">
                  {/* --- NEW VIEW BUTTON --- */}
                  <button
                    onClick={() =>
                      router.push(`/admin/orders/${order.order_id}`)
                    }
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details & Customization"
                  >
                    <Eye size={20} />
                  </button>

                  {/* Status Dropdown */}
                  <select
                    className="border rounded p-1 text-sm bg-white cursor-pointer"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
