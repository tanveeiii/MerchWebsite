"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, LayoutTemplate, X, Save, Loader2 } from "lucide-react";
import AdminTemplateEditor from "@/components/AdminTemplateEditor";
import { ToastContainer, toast } from "react-toastify";
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
        "http://localhost:5000/api/customization-template/fetch"
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
    if (!confirm("Delete this template?")) return;
    try {
      await fetch(
        `http://localhost:5000/api/customization-template/delete/${id}`,
        { method: "DELETE" }
      );
      CustomToast("Template deleted");
      fetchTemplates();
    } catch (e) {
      console.error(e);
    }
  };

  if (isCreating) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-auto">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutTemplate className="text-blue-600" /> Create New Template
          </h2>
          <button
            onClick={() => setIsCreating(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500"
          >
            <X /> Cancel
          </button>
        </div>
        {/* The Editor Component */}
        <AdminTemplateEditor
          onSuccess={() => {
            setIsCreating(false);
            fetchTemplates();
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Template Management
          </h1>
          <p className="text-gray-500 mt-2">
            Design starting points for your customers.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-black text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
        >
          <Plus size={20} /> Create Template
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <div
              key={t.template_id}
              className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="h-48 bg-gray-100 overflow-hidden relative">
                <img
                  src={t.preview_image}
                  className="w-full h-full object-cover"
                  alt={t.name}
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleDelete(t.template_id)}
                    className="bg-white p-2 rounded-full text-red-500 hover:bg-red-50 shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{t.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t.description || "No description"}
                </p>
              </div>
            </div>
          ))}
          {templates.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-20">
              No templates found. Create one!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
