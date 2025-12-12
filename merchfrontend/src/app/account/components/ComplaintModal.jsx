"use client";
import React, { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";

const ComplaintModal = ({ order, onClose, onSubmit }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    // We assume the user wants to complain about the specific order they clicked
    const contextMessage = `[Regarding Order #${order.orderNo}] ${message}`;
    await onSubmit(contextMessage);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Raise a Complaint</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Order: <span className="font-bold text-gray-900">{order.orderNo}</span>
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe your issue
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none h-32"
              placeholder="Wrong item? Damaged package? Delivery issue?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;