"use client";
import React, { useState, useEffect } from "react";
import { Check, X, Loader2, Clock, AlertCircle } from "lucide-react";
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

  // --- LOADING STATE ---
  if (loading || checkingAuth) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <ToastContainer />
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Clock size={24} />
                </span>
                Return Requests
            </h1>
            <p className="text-gray-500 text-sm mt-1 ml-1">
                Manage refund and return approvals.
            </p>
        </div>
        
        {/* Count Badge */}
        <div className="self-start sm:self-center">
            <span className="bg-orange-50 text-orange-700 border border-orange-200 px-4 py-1.5 rounded-full text-sm font-medium">
                {requests.length} Pending
            </span>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Horizontal Scroll Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Request ID</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">User Details</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Order Ref</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Refund Amt</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {requests.length === 0 ? (
                // --- EMPTY STATE ---
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <Check className="mb-4 text-green-500 bg-green-50 rounded-full p-2" size={48} />
                        <p className="text-lg font-medium text-gray-900">All Caught Up!</p>
                        <p className="text-sm">There are no pending return requests right now.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // --- DATA ROWS ---
                requests.map((req) => (
                  <tr key={req.return_request_id} className="hover:bg-gray-50/50 transition-colors group">
                    
                    {/* ID */}
                    <td className="p-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        <span className="font-mono text-gray-500">#</span>
                        {req.return_name || req.return_request_id}
                    </td>

                    {/* User */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                         {/* Initials Avatar */}
                         <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {req.user?.first_name ? req.user.first_name[0].toUpperCase() : "U"}
                         </div>
                         <div>
                            <div className="font-medium text-sm text-gray-900">
                                {req.user?.first_name} {req.user?.last_name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {req.user?.email}
                            </div>
                         </div>
                      </div>
                    </td>

                    {/* Order ID */}
                    <td className="p-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded w-fit text-xs font-medium">
                            <span>ORD:</span>
                            <span>{req.order_id}</span>
                        </div>
                    </td>

                    {/* Reason */}
                    <td className="p-4 max-w-[200px]">
                        <p className="text-sm text-gray-600 truncate italic" title={req.reason}>
                            "{req.reason}"
                        </p>
                    </td>

                    {/* Amount */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-bold text-gray-900 text-sm">
                        ${Number(req.refund_amount).toFixed(2)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(req.return_request_id, "approve")}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg text-xs font-bold transition-all border border-emerald-200 shadow-sm"
                          title="Approve Request"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(req.return_request_id, "reject")}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 rounded-lg text-xs font-bold transition-all border border-red-200 shadow-sm"
                          title="Reject Request"
                        >
                          <X size={14} /> Reject
                        </button>
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