"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Package,
  Image as ImageIcon,
  Layers,
  Save,
  Loader2,
  Star,
  CheckCircle,
  CheckSquare,
  Square,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import CustomToast from "@/components/CustomToast";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";
import ProductDetail from "./components/ProductDetail";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const initialFormState = {
    product_name: "",
    description: "",
    base_price: "",
    sku: "",
    category_ids: [], // CHANGED: Array
    tag_id: "",
    images: [{ url: "", is_primary: true }],
    variants: [],
  };

  const [formData, setFormData] = useState(initialFormState);

  const [newVariant, setNewVariant] = useState({
    size: "M",
    color: "Black",
    material: "Cotton",
    sku: "",
    price: "",
    stock_quantity: 10,
    weight: 0.5,
  });

  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) router.replace("/amdin/login");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

  const fetchAllData = async () => {
    try {
      const [prodRes, catRes, tagRes] = await Promise.all([
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "product/fetch"),
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "category/fetch"),
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "tag/fetch"),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();
      const tagData = await tagRes.json();
      console.log(prodData.data);
      if (prodData.data) setProducts(prodData.data);
      if (Array.isArray(catData)) setCategories(catData);
      if (Array.isArray(tagData)) setTags(tagData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- Category Selection Handler ---
  const toggleCategory = (id) => {
    const current = formData.category_ids;
    if (current.includes(id)) {
      setFormData({
        ...formData,
        category_ids: current.filter((c) => c !== id),
      });
    } else {
      setFormData({ ...formData, category_ids: [...current, id] });
    }
  };

  // --- Image Handlers ---
  const addImageSlot = () =>
    setFormData({
      ...formData,
      images: [...formData.images, { url: "", is_primary: false }],
    });
  const removeImageSlot = (index) => {
    if (formData.images.length === 1)
      return CustomToast("At least one image required");
    const updated = formData.images.filter((_, i) => i !== index);
    if (formData.images[index].is_primary && updated.length > 0)
      updated[0].is_primary = true;
    setFormData({ ...formData, images: updated });
  };
  const updateImageUrl = (index, value) => {
    const updated = [...formData.images];
    updated[index].url = value;
    setFormData({ ...formData, images: updated });
  };
  const setPrimaryImage = (index) => {
    const updated = formData.images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    setFormData({ ...formData, images: updated });
  };

  // --- Variant Handlers ---
  const addVariant = (e) => {
    e.preventDefault();
    if (!newVariant.sku || !newVariant.price)
      return CustomToast("SKU/Price required");
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { ...newVariant, price: Number(newVariant.price) },
      ],
    });
    setNewVariant({ ...newVariant, sku: "", price: "" });
  };
  const removeVariant = (index) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.category_ids.length === 0 || !formData.tag_id)
      return CustomToast("Select Categories & Tag");

    const validImages = formData.images.filter((img) => img.url.trim() !== "");
    if (validImages.length === 0) return CustomToast("Add valid image URL");

    setSubmitting(true);

    try {
      const payload = {
        product_name: formData.product_name,
        description: formData.description,
        base_price: Number(formData.base_price),
        sku: formData.sku,
        category_ids: formData.category_ids, // Send Array
        tag_id: Number(formData.tag_id),
        is_active: true,
        images: validImages.map((img, index) => ({
          image_url: img.url,
          alt_text: formData.product_name,
          display_order: index + 1,
          is_primary: img.is_primary,
        })),
        variants: formData.variants.map((v) => ({
          ...v,
          stock_quantity: Number(v.stock_quantity),
          low_stock_threshold: 5,
          weight: Number(v.weight),
          is_available: true,
        })),
      };

      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "product/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        CustomToast("Product Created!");
        setFormData(initialFormState);
        setShowForm(false);
        fetchAllData();
      } else {
        CustomToast(data.message || "Failed");
      }
    } catch (e) {
      console.error(e);
      CustomToast("Error submitting");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `product/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setProducts(products.filter((p) => p.product_id !== productId));
        CustomToast("Product deleted successfully");
      }
    } catch (error) {
      CustomToast("Error deleting the product");
      console.log(error);
    }
  };

  if (loading)
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <>
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Management
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
          >
            <Plus size={20} /> {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Package size={20} className="text-blue-600" /> Basic
                  Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    className="w-full border p-2.5 rounded-lg"
                    placeholder="Product Name"
                    value={formData.product_name}
                    onChange={(e) =>
                      setFormData({ ...formData, product_name: e.target.value })
                    }
                    required
                  />
                  <input
                    className="w-full border p-2.5 rounded-lg"
                    placeholder="SKU"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    required
                  />
                  <input
                    type="number"
                    className="w-full border p-2.5 rounded-lg"
                    placeholder="Price"
                    value={formData.base_price}
                    onChange={(e) =>
                      setFormData({ ...formData, base_price: e.target.value })
                    }
                    required
                  />

                  {/* --- MULTI-SELECT CATEGORIES --- */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories (Select Multiple)
                    </label>
                    <div className="border rounded-lg p-3 max-h-40 overflow-y-auto grid grid-cols-2 gap-2 bg-gray-50">
                      {categories.map((c) => (
                        <div
                          key={c.category_id}
                          onClick={() => toggleCategory(c.category_id)}
                          className={`cursor-pointer flex items-center gap-2 p-2 rounded border transition-all ${
                            formData.category_ids.includes(c.category_id)
                              ? "bg-blue-100 border-blue-300 text-blue-800"
                              : "bg-white border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {formData.category_ids.includes(c.category_id) ? (
                            <CheckSquare size={16} />
                          ) : (
                            <Square size={16} />
                          )}
                          <span className="text-sm font-medium">
                            {c.category_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tag
                    </label>
                    <select
                      className="w-full border p-2.5 rounded-lg bg-white"
                      value={formData.tag_id}
                      onChange={(e) =>
                        setFormData({ ...formData, tag_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Tag...</option>
                      {tags.map((t) => (
                        <option key={t.tag_id} value={t.tag_id}>
                          {t.tag_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    className="col-span-2 w-full border p-2.5 rounded-lg h-24"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <hr className="border-gray-100" />
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon size={20} className="text-purple-600" /> Images
                </h3>
                <div className="space-y-3">
                  {formData.images.map((img, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        className="flex-1 border p-2.5 rounded-lg"
                        placeholder="Image URL"
                        value={img.url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className={`flex gap-2 px-3 py-2 rounded-lg border ${
                          img.is_primary
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-50"
                        }`}
                      >
                        {img.is_primary ? (
                          <CheckCircle size={18} />
                        ) : (
                          <Star size={18} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImageSlot(index)}
                        className="p-2.5 text-red-500 bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageSlot}
                    className="text-sm text-blue-600 font-bold flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Image
                  </button>
                </div>
              </div>

              <hr className="border-gray-100" />
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Layers size={20} className="text-orange-600" /> Variants
                </h3>
                {formData.variants.length > 0 && (
                  <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {formData.variants.map((v, i) => (
                      <div
                        key={i}
                        className="flex justify-between border-b pb-2 mb-2 last:border-0 last:mb-0 text-sm"
                      >
                        <span>
                          {v.sku} - {v.size}/{v.color} - ${v.price} (
                          {v.stock_quantity})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
                  <select
                    className="border p-2 rounded"
                    value={newVariant.size}
                    onChange={(e) =>
                      setNewVariant({ ...newVariant, size: e.target.value })
                    }
                  >
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                  <input
                    className="border p-2 rounded"
                    placeholder="Color"
                    value={newVariant.color}
                    onChange={(e) =>
                      setNewVariant({ ...newVariant, color: e.target.value })
                    }
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="SKU"
                    value={newVariant.sku}
                    onChange={(e) =>
                      setNewVariant({ ...newVariant, sku: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Price"
                    value={newVariant.price}
                    onChange={(e) =>
                      setNewVariant({ ...newVariant, price: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Stock"
                    value={newVariant.stock_quantity}
                    onChange={(e) =>
                      setNewVariant({
                        ...newVariant,
                        stock_quantity: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={addVariant}
                    className="bg-blue-600 text-white p-2 rounded font-bold text-sm"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition flex justify-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <Save />}{" "}
                {submitting ? "Saving..." : "Save Product"}
              </button>
            </form>
          </div>
        )}

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const cover =
              p.ProductImage?.find((i) => i.is_primary)?.image_url ||
              p.ProductImage?.[0]?.image_url ||
              "https://readymadeui.com/images/product14.webp";
            return (
              <div
                key={p.product_id}
                disabled={!p.is_active}
                onClick={() => setSelectedProduct(p)}
                className="bg-white p-4 rounded-xl border flex gap-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                  <img src={cover} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 line-clamp-1">
                    {p.product_name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.categories?.map((c) => (
                      <span
                        key={c.category_id}
                        className="text-[10px] bg-gray-100 px-2 py-0.5 rounded border"
                      >
                        {c.category_name}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg text-gray-900 mt-2">
                      ${p.base_price}
                    </p>

                    <p
                      className={`text-sm ${
                        p.is_active ? "text-green-500" : "text-red-500"
                      } mt-2`}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onDelete={handleDeleteProduct}
          />
        )}
      </div>
    </>
  );
}
