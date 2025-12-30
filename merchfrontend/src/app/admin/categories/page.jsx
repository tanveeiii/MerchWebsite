"use client";
import React, { useEffect, useState } from "react";
import CategoryManager from "@/components/CategoryManager"; // This component handles the logic
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

export default function AdminCategories() {
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

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Category Management
        </h1>
        <p className="text-gray-500 mt-2">
          Create and organize product categories for your store.
        </p>
      </div>

      {/* Render the Manager Component */}
      <CategoryManager />
    </div>
  );
}
