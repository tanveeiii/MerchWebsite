"use client";
import React, { useState, useEffect } from 'react';
import { FolderPlus, Loader2, Image as ImageIcon, Edit2, X } from 'lucide-react';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null); // Track ID if editing

    const [formData, setFormData] = useState({
        category_name: "",
        description: "",
        image_url: ""
    });

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/category/fetch');
            const data = await res.json();
            if (Array.isArray(data)) setCategories(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditClick = (cat) => {
        setEditingId(cat.category_id);
        setFormData({
            category_name: cat.category_name,
            description: cat.description,
            image_url: cat.image_url
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ category_name: "", description: "", image_url: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const url = editingId 
            ? 'http://localhost:5000/api/category/update' 
            : 'http://localhost:5000/api/category/create';
            
        const method = editingId ? 'PUT' : 'POST';
        
        const payload = { 
            ...formData, 
            is_active: true,
            // If editing, add the ID
            ...(editingId && { category_id: editingId }) 
        };

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                alert(editingId ? "Category Updated!" : "Category Created!");
                handleCancelEdit(); // Reset form
                fetchCategories();
            } else {
                alert("Failed to save category");
            }
        } catch (e) { 
            console.error(e);
            alert("Error occurred"); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="p-6 bg-white border rounded-xl shadow-sm max-w-4xl mx-auto my-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                    <FolderPlus size={24} /> {editingId ? "Edit Category" : "Manage Categories"}
                </h2>
                {editingId && (
                    <button onClick={handleCancelEdit} className="text-sm text-red-600 flex items-center gap-1 hover:underline">
                        <X size={16} /> Cancel Edit
                    </button>
                )}
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 border-b pb-10">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input 
                            name="category_name" 
                            value={formData.category_name} 
                            onChange={handleChange}
                            placeholder="e.g. Hoodies" 
                            className="w-full border p-2 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input 
                            name="image_url" 
                            value={formData.image_url} 
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg" 
                            className="w-full border p-2 rounded-lg"
                            required
                        />
                    </div>
                </div>
                
                <div className="flex flex-col h-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange}
                        placeholder="Describe this category..." 
                        className="w-full border p-2 rounded-lg flex-1 resize-none"
                        required
                    />
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`mt-4 text-white py-3 rounded-lg font-bold disabled:opacity-50 flex items-center justify-center gap-2 transition-colors ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'}`}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (editingId ? "Update Category" : "Create Category")}
                    </button>
                </div>
            </form>

            {/* List */}
            <h3 className="text-lg font-bold mb-4">Existing Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <div key={cat.category_id} className="border rounded-lg overflow-hidden flex flex-col group relative">
                        {/* Edit Button Overlay */}
                        <button 
                            onClick={() => handleEditClick(cat)}
                            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800"
                            title="Edit Category"
                        >
                            <Edit2 size={16} />
                        </button>

                        <div className="h-32 bg-gray-100 overflow-hidden relative">
                            {cat.image_url ? (
                                <img src={cat.image_url} alt={cat.category_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon /></div>
                            )}
                        </div>
                        <div className="p-3">
                            <h4 className="font-bold text-gray-900">{cat.category_name}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && <p className="text-gray-500 text-sm col-span-full">No categories found.</p>}
            </div>
        </div>
    );
};

export default CategoryManager;