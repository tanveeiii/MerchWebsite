"use client";
import React, { useState, useEffect } from "react";
import { Plus, Loader2, Image as ImageIcon } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    product_name: "", description: "", base_price: "", sku: "", 
    category_id: "", tag_id: "", image_url: ""
  });

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/product/fetch");
    const json = await res.json();
    if (json.data) setProducts(json.data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create Product
      const productRes = await fetch("http://localhost:5000/api/product/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: formData.product_name,
          description: formData.description,
          base_price: Number(formData.base_price),
          sku: formData.sku,
          category_id: Number(formData.category_id), // Ensure you have Category IDs known
          tag_id: Number(formData.tag_id), // Ensure you have Tag IDs known
          is_active: true
        })
      });
      const productJson = await productRes.json();

      if (productRes.ok && productJson.product) {
        // 2. Add Image (Chained Request)
        await fetch("http://localhost:5000/api/product_image/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: productJson.product.product_id,
            image_url: formData.image_url,
            alt_text: formData.product_name,
            display_order: 1,
            is_primary: true
          })
        });
        
        alert("Product Created Successfully!");
        setShowForm(false);
        fetchProducts();
      } else {
        alert("Failed to create product base.");
      }
    } catch (e) { console.error(e); alert("Error submitting product"); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <input className="border p-2 rounded" placeholder="Product Name" onChange={e => setFormData({...formData, product_name: e.target.value})} required />
            <input className="border p-2 rounded" placeholder="SKU (e.g. TEE-001)" onChange={e => setFormData({...formData, sku: e.target.value})} required />
            <input className="border p-2 rounded" placeholder="Price ($)" type="number" onChange={e => setFormData({...formData, base_price: e.target.value})} required />
            <input className="border p-2 rounded" placeholder="Image URL" onChange={e => setFormData({...formData, image_url: e.target.value})} required />
            <input className="border p-2 rounded" placeholder="Category ID (e.g. 1)" type="number" onChange={e => setFormData({...formData, category_id: e.target.value})} required />
            <input className="border p-2 rounded" placeholder="Tag ID (e.g. 1)" type="number" onChange={e => setFormData({...formData, tag_id: e.target.value})} required />
            <textarea className="border p-2 rounded col-span-2" placeholder="Description" onChange={e => setFormData({...formData, description: e.target.value})} required />
            <button className="bg-green-600 text-white py-2 rounded col-span-2 font-bold hover:bg-green-700">Save Product</button>
          </form>
        </div>
      )}

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.product_id} className="bg-white p-4 rounded-xl border flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
               <img src={p.ProductImage?.[0]?.image_url || "https://readymadeui.com/images/product14.webp"} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 line-clamp-1">{p.product_name}</h3>
              <p className="text-gray-500 text-sm">{p.sku}</p>
              <p className="font-bold text-green-600 mt-1">${p.base_price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}