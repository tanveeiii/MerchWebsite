"use client";
import React, { useState } from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";

export default function ReturnModal({ order, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return alert("Please provide a reason for the return.");
    setSubmitting(true);
    await onSubmit(order, reason);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-red-50 p-5 border-b border-red-100 flex justify-between items-center">
          <h3 className="font-bold text-red-700 text-lg">Request Item Return</h3>
          <button onClick={onClose} className="text-red-400 hover:text-red-700 bg-white rounded-full p-1 shadow-sm">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          {/* Order Details */}
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Order Number</p>
                <p className="text-sm font-mono text-gray-900">{order.orderNo}</p>
            </div>
            <div className="text-right">
                <p className="text-xs font-bold text-gray-500 uppercase">Refund Amount</p>
                <p className="text-lg font-bold text-green-600">${order.totalAmount}</p>
            </div>
          </div>
          
          {/* Reason Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Return <span className="text-red-500">*</span></label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none min-h-[120px] text-sm resize-none"
              placeholder="Please describe why you want to return this item (e.g., Wrong size, Damaged, Not as described)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 flex gap-3 items-start">
            <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
            <p className="text-xs text-yellow-800 leading-relaxed">
              Your request will be sent to our admin team for approval. Once approved, you will receive an email with the return shipping label and further instructions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-gray-50 flex justify-end gap-3 border-t">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {submitting && <Loader2 className="animate-spin" size={18} />} 
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}