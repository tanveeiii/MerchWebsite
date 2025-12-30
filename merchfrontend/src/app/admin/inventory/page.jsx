"use client";
import React, { useEffect, useState } from "react";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  Plus,
  X,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
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
  // We strictly convert to Number() to ensure type matching (String "1" vs Number 1)
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

      console.log("Inventory API Response:", { logsData, prodData }); // DEBUGGING

      // Robust handling: Check if it's an array OR an object with a .data array
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
      // Determine sign based on action (Restock/Return = +, Damage/Correction = -)
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
            quantity_after: 0, // Backend calculates this
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
        fetchData(); // Refresh logs
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

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="w-full relative">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Logs</h1>
          <p className="text-gray-500 mt-2">
            Track stock movements, restocks, and sales.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-sm"
        >
          <Plus size={20} /> Adjust Stock
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Date</th>
              <th className="p-4 font-semibold text-gray-700">Product</th>
              <th className="p-4 font-semibold text-gray-700">Variant</th>
              <th className="p-4 font-semibold text-gray-700">Action</th>
              <th className="p-4 font-semibold text-gray-700">Change</th>
              <th className="p-4 font-semibold text-gray-700">Stock After</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map((log) => (
              <tr
                key={log.inventory_log_id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-sm text-gray-500">
                  {new Date(log.logged_at).toLocaleString()}
                </td>
                <td className="p-4 font-medium text-gray-900">
                  {log.product_variant?.product?.product_name ||
                    "Unknown Product"}
                  <div className="text-xs text-gray-400">
                    {log.product_variant?.product?.sku}
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {log.product_variant
                    ? `${log.product_variant.size} / ${log.product_variant.color}`
                    : "N/A"}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold border ${
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
                <td className="p-4 font-mono">
                  <div
                    className={`flex items-center gap-1 ${
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
                <td className="p-4 font-bold text-gray-800">
                  {log.quantity_after}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No inventory history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADJUST STOCK MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ClipboardList size={20} className="text-blue-600" /> Adjust
                Stock
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdjust} className="p-6 space-y-4">
              {/* 1. Select Product */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product
                </label>
                <select
                  className="w-full border p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
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
                      ? "No Products Found (Create One First)"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Variant
                </label>
                <select
                  className="w-full border p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <select
                    className="w-full border p-2 rounded-lg bg-white"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border p-2 rounded-lg"
                    placeholder="10"
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
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2 mt-2"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Update Stock"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
