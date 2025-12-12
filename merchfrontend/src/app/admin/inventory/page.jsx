"use client";
import React, { useEffect, useState } from "react";
import { Loader2, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function AdminInventory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/inventory_log/admin/all");
        const json = await res.json();
        if (Array.isArray(json)) setLogs(json);
      } catch (error) {
        console.error("Failed to fetch inventory logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Logs</h1>
        <p className="text-gray-500 mt-2">Track stock movements, restocks, and sales.</p>
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
              <tr key={log.inventory_log_id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm text-gray-500">
                  {new Date(log.logged_at).toLocaleString()}
                </td>
                <td className="p-4 font-medium text-gray-900">
                  {log.product_variant?.product?.product_name || "Unknown Product"}
                  <div className="text-xs text-gray-400">{log.product_variant?.product?.sku}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {log.product_variant ? `${log.product_variant.size} / ${log.product_variant.color}` : "N/A"}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${
                    log.action_type === 'RESTOCK' ? 'bg-green-50 text-green-700 border-green-200' :
                    log.action_type === 'ORDER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {log.action_type}
                  </span>
                </td>
                <td className="p-4 font-mono">
                  <div className={`flex items-center gap-1 ${log.quantity_change > 0 ? "text-green-600" : "text-red-600"}`}>
                    {log.quantity_change > 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                    {log.quantity_change > 0 ? "+" : ""}{log.quantity_change}
                  </div>
                </td>
                <td className="p-4 font-bold text-gray-800">
                  {log.quantity_after}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
                <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">No inventory history found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}