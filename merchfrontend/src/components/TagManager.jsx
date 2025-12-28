"use client";
import React, { useState, useEffect } from "react";
import { Tag, Edit2, Check, X, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import CustomToast from "./CustomToast";

const TagManager = () => {
  const [tags, setTags] = useState([]);
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchTags = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tag/fetch");
      const data = await res.json();
      if (Array.isArray(data)) setTags(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleEditClick = (tag) => {
    setEditingId(tag.tag_id);
    setTagName(tag.tag_name);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTagName("");
  };

  const handleDelete = async (id, e) => {
    // Prevent triggering edit click if delete button is clicked inside the tag chip
    if (e) e.stopPropagation();

    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/tag/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (editingId === id) handleCancel();
        fetchTags();
      } else {
        CustomToast("Failed to delete tag. It might be used by products.");
      }
    } catch (e) {
      CustomToast("Error deleting tag");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    setLoading(true);

    const url = editingId
      ? "http://localhost:5000/api/tag/update"
      : "http://localhost:5000/api/tag/create";
    const method = editingId ? "PUT" : "POST";
    const payload = editingId
      ? { tag_id: editingId, tag_name: tagName }
      : { tag_name: tagName };

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        handleCancel();
        fetchTags();
      }
    } catch (e) {
      CustomToast("Failed to save tag");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Tag size={20} /> {editingId ? "Edit Tag" : "Manage Tags"}
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter tag name..."
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {editingId && (
          <>
            <button
              type="button"
              onClick={(e) => handleDelete(editingId, e)}
              className="bg-red-50 text-red-600 px-3 rounded-lg hover:bg-red-100 border border-red-200"
              title="Delete Tag"
            >
              <Trash2 size={20} />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 px-3 rounded-lg hover:bg-gray-300"
            >
              <X size={20} />
            </button>
          </>
        )}

        <button
          disabled={loading}
          className={`text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2 ${
            editingId
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {editingId ? <Check size={18} /> : "Add"}
          {loading ? "..." : editingId ? "Update" : "Add"}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag.tag_id}
            onClick={() => handleEditClick(tag)}
            className={`group px-3 py-1 rounded-full text-sm font-medium border transition-colors flex items-center gap-2 cursor-pointer ${
              editingId === tag.tag_id
                ? "bg-blue-50 border-blue-300 text-blue-700 ring-1 ring-blue-300"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            title="Click to Edit"
          >
            {tag.tag_name}
            {/* Hover Icons */}
            <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100">
              {editingId !== tag.tag_id && <Edit2 size={10} />}
              <button
                onClick={(e) => handleDelete(tag.tag_id, e)}
                className="hover:text-red-600 p-0.5 rounded-full hover:bg-red-100 transition-colors"
                title="Delete"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
        {tags.length === 0 && (
          <p className="text-gray-500 text-sm">No tags found.</p>
        )}
      </div>
    </div>
  );
};

export default TagManager;
