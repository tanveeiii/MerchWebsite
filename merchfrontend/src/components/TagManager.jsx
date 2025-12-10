"use client";
import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2 } from 'lucide-react';

const TagManager = () => {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch Tags
    const fetchTags = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/tag/fetch');
            const data = await res.json();
            if (Array.isArray(data)) setTags(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchTags(); }, []);

    // Create Tag
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTag.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/tag/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tag_name: newTag })
            });
            if (res.ok) {
                setNewTag("");
                fetchTags(); // Refresh list
            }
        } catch (e) { alert("Failed to create tag"); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-6 bg-white border rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Tag size={20} /> Manage Tags
            </h2>
            
            {/* Create Form */}
            <form onSubmit={handleCreate} className="flex gap-2 mb-6">
                <input 
                    type="text" 
                    placeholder="Enter new tag name (e.g. 'Trending', 'New')" 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="border p-2 rounded-lg flex-1"
                />
                <button 
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add Tag"}
                </button>
            </form>

            {/* List */}
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span key={tag.tag_id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium border">
                        {tag.tag_name}
                    </span>
                ))}
                {tags.length === 0 && <p className="text-gray-500 text-sm">No tags found.</p>}
            </div>
        </div>
    );
};

export default TagManager;