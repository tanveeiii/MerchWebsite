"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Package, Image as ImageIcon, Layers, Save, Loader2 } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- 1. Form State Structure ---
  const initialFormState = {
    product_name: "",
    description: "",
    base_price: "",
    sku: "",
    category_id: "",
    tag_id: "",
    image_url: "", // For primary image
    
    // Variant Temp State
    variants: [] 
  };

  const [formData, setFormData] = useState(initialFormState);
  
  // Temp state for adding a variant row
  const [newVariant, setNewVariant] = useState({
    size: "M", color: "Black", material: "Cotton", sku: "", 
    price: "", stock_quantity: 10, weight: 0.5
  });

  // --- 2. Fetch Products ---
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/product/fetch");
      const json = await res.json();
      if (json.data) setProducts(json.data);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  // --- 3. Helper Functions ---
  const addVariant = (e) => {
    e.preventDefault();
    if (!newVariant.sku || !newVariant.price) return alert("SKU and Price are required for variants");
    
    setFormData({
      ...formData,
      variants: [...formData.variants, { ...newVariant, price: Number(newVariant.price) }]
    });

    // Reset temp variant
    setNewVariant({ ...newVariant, sku: "", price: "" }); 
  };

  const removeVariant = (index) => {
    const updated = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updated });
  };

  // --- 4. Submit Handler (Single Request) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Construct the Deep Insert Payload
      const payload = {
        product_name: formData.product_name,
        description: formData.description,
        base_price: Number(formData.base_price),
        sku: formData.sku,
        category_id: Number(formData.category_id),
        tag_id: Number(formData.tag_id),
        is_active: true,

        // Map Images (Creating an array with one primary image for now)
        images: formData.image_url ? [{
          image_url: formData.image_url,
          alt_text: formData.product_name,
          display_order: 1,
          is_primary: true
        }] : [],

        // Map Variants
        variants: formData.variants.map(v => ({
          ...v,
          stock_quantity: Number(v.stock_quantity),
          low_stock_threshold: 5,
          weight: Number(v.weight),
          is_available: true
        }))
      };

      const res = await fetch("http://localhost:5000/api/product/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product Created Successfully!");
        setFormData(initialFormState);
        setShowForm(false);
        fetchProducts();
      } else {
        alert(data.message || "Failed to create product");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-500 mt-1">Add items, manage stock, and update prices.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
        >
          <Plus size={20} /> {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {/* --- CREATE FORM --- */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-10 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Basic Info */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Package size={20} className="text-blue-600" /> Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input className="w-full border p-2.5 rounded-lg" placeholder="e.g. Classic White Tee" value={formData.product_name} onChange={e => setFormData({...formData, product_name: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                        <input className="w-full border p-2.5 rounded-lg" placeholder="e.g. TEE-001" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Base Price ($)</label>
                        <input type="number" className="w-full border p-2.5 rounded-lg" placeholder="0.00" value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
                        <input type="number" className="w-full border p-2.5 rounded-lg" placeholder="e.g. 1" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tag ID</label>
                        <input type="number" className="w-full border p-2.5 rounded-lg" placeholder="e.g. 1" value={formData.tag_id} onChange={e => setFormData({...formData, tag_id: e.target.value})} required />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="w-full border p-2.5 rounded-lg h-24" placeholder="Product details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    </div>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section 2: Media */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ImageIcon size={20} className="text-purple-600" /> Media
                </h3>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Image URL</label>
                <input className="w-full border p-2.5 rounded-lg" placeholder="https://..." value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} required />
            </div>

            <hr className="border-gray-100" />

            {/* Section 3: Variants */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Layers size={20} className="text-orange-600" /> Variants
                </h3>
                
                {/* Variant List */}
                {formData.variants.length > 0 && (
                    <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="text-gray-500 font-semibold border-b">
                                    <th className="pb-2">SKU</th>
                                    <th className="pb-2">Size</th>
                                    <th className="pb-2">Color</th>
                                    <th className="pb-2">Price</th>
                                    <th className="pb-2">Stock</th>
                                    <th className="pb-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.variants.map((v, i) => (
                                    <tr key={i} className="border-b last:border-0">
                                        <td className="py-2">{v.sku}</td>
                                        <td className="py-2">{v.size}</td>
                                        <td className="py-2">{v.color}</td>
                                        <td className="py-2">${v.price}</td>
                                        <td className="py-2">{v.stock_quantity}</td>
                                        <td className="py-2">
                                            <button type="button" onClick={() => removeVariant(i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Add Variant Form */}
                <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
                    <div>
                        <label className="text-xs font-bold text-gray-500">Size</label>
                        <select className="w-full border p-2 rounded bg-white" value={newVariant.size} onChange={e => setNewVariant({...newVariant, size: e.target.value})}>
                            <option>S</option><option>M</option><option>L</option><option>XL</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500">Color</label>
                        <input className="w-full border p-2 rounded" placeholder="Color" value={newVariant.color} onChange={e => setNewVariant({...newVariant, color: e.target.value})} />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-gray-500">SKU</label>
                        <input className="w-full border p-2 rounded" placeholder="SKU" value={newVariant.sku} onChange={e => setNewVariant({...newVariant, sku: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500">Price ($)</label>
                        <input type="number" className="w-full border p-2 rounded" placeholder="0.00" value={newVariant.price} onChange={e => setNewVariant({...newVariant, price: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500">Stock</label>
                        <input type="number" className="w-full border p-2 rounded" value={newVariant.stock_quantity} onChange={e => setNewVariant({...newVariant, stock_quantity: e.target.value})} />
                    </div>
                    <div>
                        <button onClick={addVariant} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold text-sm">
                            + Add
                        </button>
                    </div>
                </div>
            </div>

            {/* Submit */}
            <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-2"
            >
                {submitting ? <Loader2 className="animate-spin" /> : <Save />}
                {submitting ? "Saving Product..." : "Save Product & Variants"}
            </button>
          </form>
        </div>
      )}

      {/* --- PRODUCT LIST --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.product_id} className="bg-white p-4 rounded-xl border flex gap-4 hover:shadow-md transition">
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
               <img 
                 src={p.ProductImage?.[0]?.image_url || "https://readymadeui.com/images/product14.webp"} 
                 className="w-full h-full object-cover" 
                 alt={p.product_name}
               />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{p.product_name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.is_active ? 'ACTIVE' : 'DRAFT'}
                  </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">SKU: {p.sku}</p>
              
              <div className="mt-3 flex justify-between items-end">
                  <p className="font-bold text-lg text-gray-900">${p.base_price}</p>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {p.ProductVariant?.length || 0} Variants
                  </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}