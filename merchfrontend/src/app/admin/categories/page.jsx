"use client";
import React from "react";
import CategoryManager from "@/components/CategoryManager"; // This component handles the logic

export default function AdminCategories() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
        <p className="text-gray-500 mt-2">Create and organize product categories for your store.</p>
      </div>
      
      {/* Render the Manager Component */}
      <CategoryManager />
    </div>
  );
}