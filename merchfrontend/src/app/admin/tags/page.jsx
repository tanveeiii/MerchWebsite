"use client";
import React from "react";
import TagManager from "@/components/TagManager"; // This component handles the logic

export default function AdminTags() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tag Management</h1>
        <p className="text-gray-500 mt-2">Create tags to group products for specific sections (e.g., Trending, Sale).</p>
      </div>

      {/* Render the Manager Component */}
      <div className="max-w-2xl">
        <TagManager />
      </div>
    </div>
  );
}