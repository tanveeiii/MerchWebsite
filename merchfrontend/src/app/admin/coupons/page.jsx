"use client";
import React, { useEffect, useState } from "react";
import { Plus, Trash2, Power, Loader2, Tag, Calendar, DollarSign, Percent } from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Initial State
  const initialFormState = {
    coupon_code: "",
    description: "",
    discount_type: "PERCENTAGE", // Default selection
    discount_value: "",
    min_purchase_amount: 0,
    max_purchase_amount: 0,
    usage_limit: 100,
    start_date: "",
    end_date: ""
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- 1. Fetch Coupons ---
  const fetchCoupons = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/coupon/admin/all");
      const data = await res.json();
      if (Array.isArray(data)) setCoupons(data);
    } catch (e) {
      console.error("Failed to fetch coupons:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // --- 2. Create Coupon ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/coupon/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Ensure numbers are sent as numbers, not strings
        body: JSON.stringify({
            ...formData,
            discount_value: Number(formData.discount_value),
            min_purchase_amount: Number(formData.min_purchase_amount),
            max_purchase_amount: Number(formData.max_purchase_amount),
            usage_limit: Number(formData.usage_limit)
        })
      });
      
      const responseData = await res.json();

      if (res.ok) {
        alert("Coupon Created Successfully!");
        setFormData(initialFormState); // Reset form
        setShowForm(false); // Close form
        fetchCoupons(); // Refresh list
      } else {
        alert(responseData.message || "Failed to create coupon");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while creating the coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- 3. Delete Coupon ---
  const deleteCoupon = async (id) => {
    if(!confirm("Are you sure you want to permanently delete this coupon?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/coupon/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c.coupon_id !== id));
      } else {
        alert("Failed to delete coupon");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // --- 4. Toggle Status (Active/Inactive) ---
  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/coupon/toggle/${id}`, { method: 'PATCH' });
      if (res.ok) {
        // Optimistic update for faster UI
        setCoupons(prev => prev.map(c => 
          c.coupon_id === id ? { ...c, is_active: !c.is_active } : c
        ));
      }
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="text-blue-600" /> Coupon Management
          </h1>
          <p className="text-gray-500 mt-1">Create and manage discounts for your store.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors ${showForm ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {showForm ? "Cancel" : <><Plus size={20} /> Create Coupon</>}
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-10 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-xl mb-6 text-gray-800 border-b pb-2">New Coupon Details</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Row 1 */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
              <input 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase tracking-wider font-bold text-gray-700" 
                placeholder="e.g. SUMMER2024" 
                value={formData.coupon_code}
                onChange={e => setFormData({...formData, coupon_code: e.target.value.toUpperCase()})} 
                required 
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="e.g. 20% Off Summer Collection" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})} 
                required 
              />
            </div>

            {/* Row 2: Discount Logic */}
            <div className="bg-gray-50 p-4 rounded-xl col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="type" 
                                value="PERCENTAGE" 
                                checked={formData.discount_type === "PERCENTAGE"} 
                                onChange={e => setFormData({...formData, discount_type: e.target.value})}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="flex items-center gap-1"><Percent size={16}/> Percentage</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="type" 
                                value="FIXED" 
                                checked={formData.discount_type === "FIXED"} 
                                onChange={e => setFormData({...formData, discount_type: e.target.value})}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="flex items-center gap-1"><DollarSign size={16}/> Fixed Amount</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                    <input 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        type="number" 
                        placeholder={formData.discount_type === "PERCENTAGE" ? "e.g. 20" : "e.g. 10.00"} 
                        value={formData.discount_value}
                        onChange={e => setFormData({...formData, discount_value: e.target.value})} 
                        required 
                    />
                </div>
            </div>
            
            {/* Row 3: Limits */}
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Min Purchase ($)</label>
                 <input className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" type="number" placeholder="0" value={formData.min_purchase_amount} onChange={e => setFormData({...formData, min_purchase_amount: e.target.value})} />
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (Total uses)</label>
                 <input className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" type="number" placeholder="100" value={formData.usage_limit} onChange={e => setFormData({...formData, usage_limit: e.target.value})} />
            </div>

            {/* Row 4: Dates */}
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
                </div>
            </div>
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required />
                </div>
            </div>

            <button disabled={submitting} className="col-span-1 md:col-span-2 bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition shadow-md disabled:opacity-70 mt-4">
               {submitting ? "Creating..." : "Launch Coupon"}
            </button>
          </form>
        </div>
      )}

      {/* COUPON LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-400">
                <Tag className="mx-auto mb-3 opacity-50" size={48} />
                <p>No coupons found. Create your first one!</p>
            </div>
        ) : (
            coupons.map(c => (
            <div key={c.coupon_id} className={`p-6 rounded-xl border relative transition-all hover:shadow-md ${c.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
                
                <div className="flex justify-between items-start mb-4">
                    <div className={`font-mono font-bold px-3 py-1 rounded text-sm tracking-wide border ${c.is_active ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-200 text-gray-600 border-gray-300'}`}>
                        {c.coupon_code}
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => toggleStatus(c.coupon_id)} 
                            title={c.is_active ? "Deactivate" : "Activate"}
                            className={`p-2 rounded-full transition-colors ${c.is_active ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-200 hover:bg-gray-300'}`}
                        >
                            <Power size={18} />
                        </button>
                        <button 
                            onClick={() => deleteCoupon(c.coupon_id)} 
                            title="Delete"
                            className="p-2 rounded-full text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
                
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-extrabold text-gray-900">
                        {c.discount_type === 'PERCENTAGE' ? `${c.discount_value}%` : `$${c.discount_value}`}
                    </span>
                    <span className="text-gray-500 font-medium">OFF</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 line-clamp-2 h-10">{c.description}</p>

                <div className="space-y-2 text-xs text-gray-500 border-t pt-4">
                    <div className="flex justify-between">
                        <span>Min Purchase:</span>
                        <span className="font-medium text-gray-900">${c.min_purchase_amount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Usage:</span>
                        <span className="font-medium text-gray-900">{c.usage_count} / {c.usage_limit}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Expires:</span>
                        <span className={`font-medium ${new Date(c.end_date) < new Date() ? 'text-red-500' : 'text-gray-900'}`}>
                            {new Date(c.end_date).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
}