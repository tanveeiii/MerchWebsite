"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, LayoutTemplate, X, Loader2, Image as ImageIcon } from "lucide-react";
import AdminTemplateEditor from "@/components/AdminTemplateEditor";
import { ToastContainer } from "react-toastify";
import CustomToast from "@/components/CustomToast";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const fetchTemplates = async () => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "customization-template/fetch"
      );
      const data = await res.json();
      if (Array.isArray(data)) setTemplates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this template? This cannot be undone.")) return;
    try {
      await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `customization-template/delete/${id}`,
        { method: "DELETE" }
      );
      CustomToast("Template deleted successfully");
      fetchTemplates();
    } catch (e) {
      console.error(e);
    }
  };

  // --- 1. FULL SCREEN EDITOR MODE (MOBILE FIXED) ---
  if (isCreating) {
    return (
      // h-[100dvh] ensures full height on mobile browsers (ignores address bar issues)
      // z-[200] ensures it is above all other admin sidebars/navbars
      <div className="fixed inset-0 z-[200] bg-white flex flex-col h-[100dvh]">
        
        {/* Fixed Header */}
        <div className="flex-none p-4 border-b flex justify-between items-center bg-white shadow-sm z-20">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 truncate">
            <LayoutTemplate className="text-blue-600 flex-shrink-0" /> 
            <span className="truncate">New Template</span>
          </h2>
          <button
            onClick={() => setIsCreating(false)}
            className="flex-shrink-0 flex items-center gap-1 text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <X size={20} /> <span className="hidden sm:inline">Cancel</span>
          </button>
        </div>
        
        {/* Scrollable Content Area */}
        {/* overflow-x-auto allows scrolling sideways if the editor is too wide for mobile */}
        <div className="flex-1 overflow-y-auto overflow-x-auto bg-gray-50 p-2 md:p-4 w-full">
            {/* Min-width wrapper ensures the editor doesn't get crushed to 0 width */}
            <div className="min-w-[350px] mx-auto pb-20">
                <AdminTemplateEditor
                    onSuccess={() => {
                        setIsCreating(false);
                        fetchTemplates();
                    }}
                />
            </div>
        </div>
      </div>
    );
  }

  if (loading || checkingAuth) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <ToastContainer />
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Template Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Create and manage starting designs for your customers.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-black text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg active:scale-95"
        >
          <Plus size={20} /> Create Template
        </button>
      </div>

      {/* --- TEMPLATE GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => (
          <div
            key={t.template_id}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Image Area */}
            <div className="h-48 bg-gray-100 overflow-hidden relative border-b border-gray-100">
              {t.preview_image ? (
                  <img
                    src={t.preview_image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={t.name}
                  />
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon size={48} />
                  </div>
              )}
              
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDelete(t.template_id)}
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 shadow-md border border-gray-100 transition-colors"
                  title="Delete Template"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                {t.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 h-10 leading-relaxed">
                {t.description || "No description provided."}
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customizable
                  </span>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
        ))}
        
        {templates.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
             <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                <LayoutTemplate size={40} className="text-blue-500" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-1">No Templates Yet</h3>
             <p className="text-gray-500 max-w-sm mb-6">
                Get started by creating your first customization template.
             </p>
             <button
                onClick={() => setIsCreating(true)}
                className="text-blue-600 font-bold hover:underline"
             >
                Create Now &rarr;
             </button>
          </div>
        )}
      </div>
    </div>
  );
}