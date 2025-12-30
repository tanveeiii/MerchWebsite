"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavbarFinal } from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { LayoutTemplate, Shirt, Loader2, X } from "lucide-react";
import { ToastContainer } from "react-toastify";
import CustomToast from "@/components/CustomToast";
import { checkAuth } from "@/utils/checkauth";

export default function TemplateLibraryPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) router.replace("/auth/login");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/customization-template/fetch"
        );
        const data = await res.json();
        if (Array.isArray(data)) setTemplates(data);
      } catch (err) {
        console.error("Failed to load templates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleOpenDesigner = (templateData) => {
    if (templateData) {
      try {
        localStorage.setItem("selectedTemplate", JSON.stringify(templateData));
        CustomToast("Template saved — opening designer...");
      } catch (e) {
        console.error("localStorage error", e);
        CustomToast("Could not save template locally");
      }
    } else {
      localStorage.removeItem("selectedTemplate");
      CustomToast("Starting from scratch — opening designer...");
    }
    router.push("/customized");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <NavbarFinal />

      <main className="container mx-auto max-w-6xl px-4 py-10">
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 flex items-center gap-3">
              <LayoutTemplate className="text-blue-600" /> Create your custom
              T‑shirt
            </h1>
            <p className="text-gray-600 text-lg">
              Choose a template below or start from scratch. Once you pick a
              template, the designer will open with that template loaded.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleOpenDesigner(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Start Designing
              </button>
              <button
                onClick={() =>
                  window.scrollTo({ left: 0, top: 1000, behavior: "smooth" })
                }
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Browse Templates
              </button>
            </div>
          </div>

          <div className="w-48 h-48 bg-gray-50 rounded-xl flex items-center justify-center drop-shadow">
            <Shirt className="w-20 h-20 text-gray-400" />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Available Templates
          </h2>

          <div className="relative">
            {loading ? (
              <div className="flex items-center justify-center h-44 bg-white rounded-2xl shadow-sm">
                <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
              </div>
            ) : (
              <div className="overflow-x-auto py-4">
                <div className="flex gap-4 items-stretch">
                  <div
                    onClick={() => handleOpenDesigner(null)}
                    className="min-w-[220px] max-w-[220px] bg-white rounded-2xl shadow-sm border hover:shadow-lg cursor-pointer flex flex-col overflow-hidden"
                  >
                    <div className="h-36 bg-gray-50 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <Shirt className="w-10 h-10 text-gray-300" />
                        <div className="text-sm font-semibold text-gray-700">
                          Start from Scratch
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500">
                        Open the designer with a blank canvas.
                      </p>
                    </div>
                  </div>

                  {templates.length === 0 ? (
                    <div className="min-w-[220px] max-w-[220px] bg-white rounded-2xl shadow-sm border flex items-center justify-center">
                      <div className="p-4 text-center text-sm text-gray-500">
                        No templates found
                      </div>
                    </div>
                  ) : (
                    templates.map((t) => (
                      <article
                        key={t.template_id}
                        onClick={() => handleOpenDesigner(t.data)}
                        className="min-w-[220px] max-w-[220px] bg-white rounded-2xl shadow-sm border hover:shadow-lg cursor-pointer flex flex-col overflow-hidden"
                        title={t.name}
                      >
                        <div className="h-36 bg-gray-100 overflow-hidden flex items-center justify-center">
                          <img
                            src={t.preview_image}
                            alt={t.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                            {t.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                            {t.description}
                          </p>
                          <div className="mt-auto pt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDesigner(t.data);
                              }}
                              className="w-full text-sm py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
                            >
                              Use Template
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
