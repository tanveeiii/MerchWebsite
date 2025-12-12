"use client";
import React, { useEffect, useState } from "react";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/complaint/admin/all")
      .then(res => res.json())
      .then(data => { if(Array.isArray(data)) setComplaints(data); });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Complaints</h1>
      <div className="space-y-4">
        {complaints.map(c => (
          <div key={c.complaint_id} className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-bold text-gray-900">{c.user?.first_name} {c.user?.last_name}</span>
                <span className="text-sm text-gray-500 ml-2">({c.user?.email})</span>
              </div>
              <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 mt-2">
              {c.message}
            </div>
            {/* You could add a 'Reply' or 'Resolve' button here if you extend backend logic */}
          </div>
        ))}
        {complaints.length === 0 && <p className="text-gray-500">No complaints found.</p>}
      </div>
    </div>
  );
}