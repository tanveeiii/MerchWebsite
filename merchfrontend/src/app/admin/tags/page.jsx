"use client";
import React, { useState, useEffect } from "react";
import TagManager from "@/components/TagManager"; // This component handles the logic
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

export default function AdminTags() {
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
        <h1 className="text-3xl font-bold text-gray-900">Tag Management</h1>
        <p className="text-gray-500 mt-2">
          Create tags to group products for specific sections (e.g., Trending,
          Sale).
        </p>
      </div>

      {/* Render the Manager Component */}
      <div className="max-w-2xl">
        <TagManager />
      </div>
    </div>
  );
}
