"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Eye, Loader2, Palette } from "lucide-react";
import CustomToast from "./CustomToast"; // Ensure this path is correct based on your folder structure

const ProductCard = ({ product }) => {
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWish, setLoadingWish] = useState(false);

  // --- 1. Image Logic ---
  // Prioritize Primary Image -> First Image -> Placeholder
  const displayImage =
    product.ProductImage?.find((img) => img.is_primary)?.image_url ||
    product.ProductImage?.[0]?.image_url ||
    product.img ||
    "https://readymadeui.com/images/product14.webp";

  const originalPrice = product.originalPrice;
  const defaultVariantId = product.ProductVariant?.[0]?.product_variant_id;

  // --- 2. Customization Logic ---
  // Check if ANY of the product's categories contain the word "Custom" (Case insensitive)
  // Example: "Customized T-Shirts", "Custom Hoodies" will return TRUE.
  // "Men's Wear", "Essentials" will return FALSE.
  const isCustomizable = product.categories?.some((c) =>
    c.category_name.toLowerCase().includes("custom")
  );

  // --- 3. Handlers ---
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const userId = localStorage.getItem("userId");
    if (!userId) return CustomToast("Please login to add to cart");
    if (!defaultVariantId) return CustomToast("Select size in details page");

    setLoadingCart(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "cart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId),
          product_id: product.product_id || product.id,
          product_variant_id: defaultVariantId,
          quantity: 1,
        }),
      });
      if (res.ok) CustomToast("Added to Cart!");
      else throw new Error("Failed");
    } catch (err) {
      console.error(err);
      CustomToast("Error adding to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const userId = localStorage.getItem("userId");
    if (!userId) return CustomToast("Please login to use wishlist");

    setLoadingWish(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "wishlist/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId),
          product_id: product.product_id || product.id,
          product_variant_id: defaultVariantId || 0,
        }),
      });
      if (res.ok) CustomToast("Added to Wishlist!");
      else throw new Error("Failed");
    } catch (err) {
      console.error(err);
      CustomToast("Error adding to wishlist");
    } finally {
      setLoadingWish(false);
    }
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* --- Image Section --- */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        <img
          src={displayImage}
          alt={product.product_name || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Sale Tag */}
        {originalPrice && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            SALE
          </div>
        )}

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
          {/* Standard Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={loadingCart}
            className="flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          >
            {loadingCart ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <ShoppingCart size={18} />
            )}
            {loadingCart ? "Adding..." : "Add to Cart"}
          </button>

          {/* --- CONDITIONAL CUSTOMIZE BUTTON --- */}
          {/* Only shows if product category includes "Custom" */}
          {isCustomizable && (
            <Link
              href={`/customized?product_id=${
                product.product_id || product.id
              }`}
              className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-full hover:bg-blue-700 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 shadow-lg"
            >
              <Palette size={18} /> Customize
            </Link>
          )}

          {/* Secondary Actions (Wishlist / View) */}
          <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
            <button
              onClick={handleAddToWishlist}
              disabled={loadingWish}
              className="p-3 bg-white text-gray-900 rounded-full hover:text-red-500 hover:bg-gray-50 transition-colors shadow-lg"
            >
              {loadingWish ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Heart size={18} />
              )}
            </button>
            <Link
              href={`/shop/product/${product.product_id || product.id}`}
              className="p-3 bg-white text-gray-900 rounded-full hover:text-blue-500 hover:bg-gray-50 transition-colors shadow-lg"
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* --- Product Details Section --- */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3
            className="text-lg font-bold text-gray-900 truncate"
            title={product.product_name || product.name}
          >
            <Link href={`/shop/product/${product.product_id || product.id}`}>
              {product.product_name || product.name}
            </Link>
          </h3>

          {/* Display Categories as Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {product.categories?.map((cat, idx) => (
              <span
                key={idx}
                className={`text-[10px] px-2 py-0.5 rounded border ${
                  cat.category_name.toLowerCase().includes("custom")
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {cat.category_name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">
              ${product.base_price || product.price}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;