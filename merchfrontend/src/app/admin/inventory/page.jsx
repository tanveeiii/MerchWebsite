"use client";
import React, { useEffect, useState } from "react";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  Plus,
  X,
  PackageOpen,
  History
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import CustomToast from "@/components/CustomToast";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

export default function AdminInventory() {
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    product_variant_id: "",
    action_type: "RESTOCK",
    quantity_change: "",
  });

  // Derived State
  const selectedProduct = products.find(
    (p) => p.product_id === Number(formData.product_id)
  );

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

  // Fetch Logs & Products
  const fetchData = async () => {
    try {
      const [logsRes, prodRes] = await Promise.all([
        fetch("http://localhost:5000/api/inventory_log/admin/all"),
        fetch("http://localhost:5000/api/product/fetch"),
      ]);

      const logsData = await logsRes.json();
      const prodData = await prodRes.json();

      if (Array.isArray(logsData)) {
        setLogs(logsData);
      } else if (logsData.data && Array.isArray(logsData.data)) {
        setLogs(logsData.data);
      }

      if (Array.isArray(prodData)) {
        setProducts(prodData);
      } else if (prodData.data && Array.isArray(prodData.data)) {
        setProducts(prodData.data);
      }
    } catch (error) {
      console.error("Failed to fetch inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Submit
  const handleAdjust = async (e) => {
    e.preventDefault();
    if (!formData.product_id || !formData.product_variant_id) {
      return CustomToast("Please select a product and variant.");
    }

    setSubmitting(true);

    try {
      let qty = Number(formData.quantity_change);
      if (
        formData.action_type === "DAMAGE" ||
        formData.action_type === "CORRECTION"
      ) {
        qty = -Math.abs(qty); // Ensure negative
      } else {
        qty = Math.abs(qty); // Ensure positive
      }

      const res = await fetch(
        "http://localhost:5000/api/inventory_log/adjust",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_variant_id: Number(formData.product_variant_id),
            action_type: formData.action_type,
            quantity_change: qty,
            quantity_after: 0,
          }),
        }
      );

      if (res.ok) {
        CustomToast("Stock Adjusted Successfully!");
        setShowModal(false);
        setFormData({
          product_id: "",
          product_variant_id: "",
          action_type: "RESTOCK",
          quantity_change: "",
        });
        fetchData();
      } else {
        const err = await res.json();
        CustomToast(err.message || "Failed to adjust stock");
      }
    } catch (e) {
      console.error(e);
      CustomToast("Error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || checkingAuth)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <ToastContainer />
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
             <ClipboardList className="text-blue-600" /> Inventory Logs
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track stock movements, restocks, and damage reports.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-95 text-sm font-medium"
        >
          <Plus size={18} /> Adjust Stock
        </button>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Product</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Variant</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Action</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Change</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Stock After</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                 <tr>
                    <td colSpan="6" className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <History size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium text-gray-900">No History Yet</p>
                            <p className="text-sm">Stock adjustments and sales will appear here.</p>
                        </div>
                    </td>
                 </tr>
                ) : (
                    logs.map((log) => (
                    <tr
                        key={log.inventory_log_id}
                        className="hover:bg-gray-50/50 transition-colors group"
                    >
                        {/* Date */}
                        <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(log.logged_at).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })}
                        </td>

                        {/* Product */}
                        <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex flex-col">
                                <span>{log.product_variant?.product?.product_name || "Unknown Product"}</span>
                                <span className="text-xs text-gray-400 font-mono mt-0.5">
                                    SKU: {log.product_variant?.product?.sku || 'N/A'}
                                </span>
                            </div>
                        </td>

                        {/* Variant */}
                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                        {log.product_variant ? (
                            <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs font-medium">
                                {log.product_variant.size} • {log.product_variant.color}
                            </span>
                        ) : (
                            "N/A"
                        )}
                        </td>

                        {/* Action Badge */}
                        <td className="p-4 whitespace-nowrap">
                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                            log.action_type === "RESTOCK"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : log.action_type === "ORDER"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                        >
                            {log.action_type}
                        </span>
                        </td>

                        {/* Quantity Change */}
                        <td className="p-4 font-mono text-sm whitespace-nowrap">
                        <div
                            className={`flex items-center gap-1.5 font-bold ${
                            log.quantity_change > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                        >
                            {log.quantity_change > 0 ? (
                            <TrendingUp size={16} />
                            ) : (
                            <TrendingDown size={16} />
                            )}
                            {log.quantity_change > 0 ? "+" : ""}
                            {log.quantity_change}
                        </div>
                        </td>

                        {/* Final Stock */}
                        <td className="p-4 whitespace-nowrap">
                             <span className="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                                {log.quantity_after}
                             </span>
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* --- ADJUST STOCK MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                <PackageOpen size={20} className="text-blue-600" /> 
                Adjust Stock
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAdjust} className="p-6 space-y-5">
              
              {/* 1. Select Product */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Select Product
                </label>
                <select
                  className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all"
                  value={formData.product_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product_id: e.target.value,
                      product_variant_id: "",
                    })
                  }
                  required
                >
                  <option value="">
                    {products.length === 0
                      ? "No Products Found"
                      : "-- Choose Product --"}
                  </option>
                  {products.map((p) => (
                    <option key={p.product_id} value={p.product_id}>
                      {p.product_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Select Variant */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Select Variant
                </label>
                <select
                  className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                  value={formData.product_variant_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product_variant_id: e.target.value,
                    })
                  }
                  required
                  disabled={!formData.product_id}
                >
                  <option value="">
                    {selectedProduct
                      ? "-- Choose Variant --"
                      : "Select a product first"}
                  </option>
                  {selectedProduct?.ProductVariant?.map((v) => (
                    <option
                      key={v.product_variant_id}
                      value={v.product_variant_id}
                    >
                      {v.size} / {v.color} (Current: {v.stock_quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 3. Action Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Reason
                  </label>
                  <select
                    className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                    value={formData.action_type}
                    onChange={(e) =>
                      setFormData({ ...formData, action_type: e.target.value })
                    }
                  >
                    <option value="RESTOCK">Restock (+)</option>
                    <option value="DAMAGE">Damaged (-)</option>
                    <option value="CORRECTION">Correction (-)</option>
                    <option value="RETURN">Return (+)</option>
                  </select>
                </div>

                {/* 4. Quantity */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                    placeholder="e.g. 10"
                    value={formData.quantity_change}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity_change: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-200 flex justify-center items-center gap-2 mt-4"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>Update Stock</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}