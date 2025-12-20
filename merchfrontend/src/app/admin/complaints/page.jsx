"use client";
import React, { useEffect, useState } from "react";
import { Loader2, MessageSquare, Send, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for handling replies
  const [replyText, setReplyText] = useState({}); // Map: { complaintId: "text" }
  const [submitting, setSubmitting] = useState(null); // ID of complaint being submitted

  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/complaint/admin/all");
      const data = await res.json();
      if (Array.isArray(data)) setComplaints(data);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleResolve = async (id) => {
    const text = replyText[id];
    if (!text) return alert("Please enter a reply message.");

    setSubmitting(id);
    try {
      const res = await fetch(`http://localhost:5000/api/complaint/resolve/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_reply: text,
          status: "RESOLVED"
        })
      });

      if (res.ok) {
        alert("Complaint Resolved!");
        // Update UI locally to reflect change immediately
        setComplaints(prev => prev.map(c => 
          c.message_id === id 
            ? { ...c, status: "RESOLVED", admin_reply: text, resolved_at: new Date() } 
            : c
        ));
      } else {
        alert("Failed to send reply.");
      }
    } catch (e) {
      console.error(e);
      alert("Error occurred.");
    } finally {
      setSubmitting(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "RESOLVED":
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Resolved</span>;
      case "IN_PROGRESS":
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> In Progress</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12}/> Open</span>;
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <MessageSquare className="text-blue-600" /> Customer Support
      </h1>

      <div className="space-y-6">
        {complaints.length === 0 ? (
           <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed text-gray-400">
             No complaints found. Good job!
           </div>
        ) : (
          complaints.map(c => (
            <div key={c.message_id} className={`p-6 rounded-xl border shadow-sm transition-all ${c.status === 'RESOLVED' ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-100 shadow-md'}`}>
              
              {/* Header: User Info & Status */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    {c.user?.first_name?.[0]}{c.user?.last_name?.[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{c.user?.first_name} {c.user?.last_name}</h3>
                    <p className="text-xs text-gray-500">{c.user?.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(c.status)}
                    <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* User Message */}
              <div className="bg-gray-100 p-4 rounded-lg text-gray-700 mb-4 text-sm leading-relaxed relative">
                 <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-100 transform rotate-45"></div>
                 {c.message}
              </div>

              {/* Action Area */}
              {c.status === "RESOLVED" ? (
                // If Resolved, Show Admin Reply
                <div className="ml-8 border-l-2 border-green-200 pl-4 py-2">
                    <p className="text-xs font-bold text-green-700 mb-1">Support Team Replied:</p>
                    <p className="text-sm text-gray-600 italic">"{c.admin_reply}"</p>
                    <p className="text-[10px] text-gray-400 mt-1">Resolved on {new Date(c.resolved_at).toLocaleDateString()}</p>
                </div>
              ) : (
                // If Open, Show Reply Box
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Reply to Customer</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Type your response here..."
                            value={replyText[c.message_id] || ""}
                            onChange={(e) => setReplyText({ ...replyText, [c.message_id]: e.target.value })}
                        />
                        <button 
                            onClick={() => handleResolve(c.message_id)}
                            disabled={submitting === c.message_id}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting === c.message_id ? <Loader2 className="animate-spin" size={16}/> : <Send size={16} />}
                            Send & Resolve
                        </button>
                    </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}