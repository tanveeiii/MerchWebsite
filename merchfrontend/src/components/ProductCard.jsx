"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Eye, Loader2 } from "lucide-react";

const ProductCard = ({ product }) => {
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWish, setLoadingWish] = useState(false);

  // --- Handlers ---
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to details page
    e.stopPropagation();

    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please login to add to cart");
    if (!product.defaultVariantId) return alert("Select size in details page");

    setLoadingCart(true);
    try {
      const res = await fetch("http://localhost:5000/api/cart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId),
          product_id: product.id,
          product_variant_id: product.defaultVariantId,
          quantity: 1
        }),
      });
      if (res.ok) alert("Added to Cart!");
      else throw new Error("Failed");
    } catch (err) {
      console.error(err);
      alert("Error adding to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please login to use wishlist");

    setLoadingWish(true);
    try {
      const res = await fetch("http://localhost:5000/api/wishlist/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId),
          product_id: product.id,
          product_variant_id: product.defaultVariantId || 0 // Handle edge case
        }),
      });
      if (res.ok) alert("Added to Wishlist!");
      else throw new Error("Failed");
    } catch (err) {
      console.error(err);
      alert("Error adding to wishlist");
    } finally {
      setLoadingWish(false);
    }
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Area */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Sale Tag */}
        {product.originalPrice && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            SALE
          </div>
        )}

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={loadingCart}
            className="flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            {loadingCart ? <Loader2 className="animate-spin" size={18}/> : <ShoppingCart size={18} />}
            {loadingCart ? "Adding..." : "Add to Cart"}
          </button>
          
          <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
            <button 
                onClick={handleAddToWishlist}
                disabled={loadingWish}
                className="p-3 bg-white text-gray-900 rounded-full hover:text-red-500 hover:bg-gray-50 transition-colors"
            >
                {loadingWish ? <Loader2 className="animate-spin" size={18}/> : <Heart size={18} />}
            </button>
            <Link href={`/shop/product/${product.id}`} className="p-3 bg-white text-gray-900 rounded-full hover:text-blue-500 hover:bg-gray-50 transition-colors">
                <Eye size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 truncate" title={product.name}>
            <Link href={`/shop/product/${product.id}`}>
                {product.name}
            </Link>
            </h3>
            <p className="text-sm text-gray-500 mt-1">{product.category}</p>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;