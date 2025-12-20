"use client";
import React, { useState, useEffect } from 'react';
import { Tag, Edit2, Check, X } from 'lucide-react';

const TagManager = () => {
    const [tags, setTags] = useState([]);
    const [tagName, setTagName] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null); // Track ID if editing

    const fetchTags = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/tag/fetch');
            const data = await res.json();
            if (Array.isArray(data)) setTags(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchTags(); }, []);

    const handleEditClick = (tag) => {
        setEditingId(tag.tag_id);
        setTagName(tag.tag_name);
    };

    const handleCancel = () => {
        setEditingId(null);
        setTagName("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tagName.trim()) return;
        setLoading(true);

        const url = editingId 
            ? 'http://localhost:5000/api/tag/update' 
            : 'http://localhost:5000/api/tag/create';
        const method = editingId ? 'PUT' : 'POST';
        const payload = editingId ? { tag_id: editingId, tag_name: tagName } : { tag_name: tagName };

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                handleCancel();
                fetchTags();
            }
        } catch (e) { alert("Failed to save tag"); }
        finally { setLoading(false); }
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
                    <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-700 px-3 rounded-lg hover:bg-gray-300">
                        <X size={20} />
                    </button>
                )}
                
                <button 
                    disabled={loading}
                    className={`text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'}`}
                >
                    {editingId ? <Check size={18}/> : "Add"}
                    {loading ? "..." : (editingId ? "Update" : "Add")}
                </button>
            </form>

            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <button 
                        key={tag.tag_id} 
                        onClick={() => handleEditClick(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors flex items-center gap-2 ${editingId === tag.tag_id ? 'bg-blue-50 border-blue-300 text-blue-700 ring-1 ring-blue-300' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        title="Click to Edit"
                    >
                        {tag.tag_name}
                        {editingId !== tag.tag_id && <Edit2 size={10} className="opacity-30" />}
                    </button>
                ))}
                {tags.length === 0 && <p className="text-gray-500 text-sm">No tags found.</p>}
            </div>
        </div>
    );
};

export default TagManager;