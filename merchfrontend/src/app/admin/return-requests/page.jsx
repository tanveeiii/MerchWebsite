"use client";
import React, { useState, useEffect } from "react";
import { Check, X, Loader2, Clock } from "lucide-react";
import CustomToast from "@/components/CustomToast";
import { ToastContainer } from "react-toastify";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

export default function AdminReturnRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) router.replace("/amdin/login");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/return-request/pending"
      );
      const data = await res.json();
      if (Array.isArray(data)) setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/return-request/${action}/${id}`,
        {
          method: "PUT",
        }
      );
      if (res.ok) {
        CustomToast(`Request ${action}ed successfully!`);
        fetchRequests(); // Refresh list
      } else {
        CustomToast("Action failed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="text-orange-500" /> Pending Return Requests
      </h1>

      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold text-sm text-gray-600">ID</th>
                <th className="p-4 font-bold text-sm text-gray-600">User</th>
                <th className="p-4 font-bold text-sm text-gray-600">
                  Order ID
                </th>
                <th className="p-4 font-bold text-sm text-gray-600">Reason</th>
                <th className="p-4 font-bold text-sm text-gray-600">Amount</th>
                <th className="p-4 font-bold text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map((req) => (
                <tr key={req.return_request_id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm font-mono">{req.return_name}</td>
                  <td className="p-4 text-sm">
                    <div className="font-bold">{req.user?.first_name}</div>
                    <div className="text-gray-500 text-xs">
                      {req.user?.email}
                    </div>
                  </td>
                  <td className="p-4 text-sm">#{req.order_id}</td>
                  <td className="p-4 text-sm italic">"{req.reason}"</td>
                  <td className="p-4 text-sm font-bold text-red-600">
                    ${req.refund_amount}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() =>
                        handleAction(req.return_request_id, "approve")
                      }
                      className="bg-green-100 text-green-700 px-3 py-1 rounded flex items-center gap-1 hover:bg-green-200 font-bold text-xs"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        handleAction(req.return_request_id, "reject")
                      }
                      className="bg-red-100 text-red-700 px-3 py-1 rounded flex items-center gap-1 hover:bg-red-200 font-bold text-xs"
                    >
                      <X size={14} /> Reject
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No pending requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
