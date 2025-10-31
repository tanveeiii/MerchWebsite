"use client";

import React, { useState } from "react";
import { NavbarFinal } from "../../components/Navbar"; // 3 levels up to src/
import Footer from "../../components/Footer"; // 3 levels up to src/
import { Tag, Shirt, Filter, ShoppingBag, Wind } from "lucide-react";

// Mock data for non-customized products
const allProducts = [
  {
    id: 1,
    category: "T-Shirts",
    name: "Classic Crewneck Tee",
    price: "$25.00",
    image:
      "https://placehold.co/600x600/f0f0f0/333?text=Classic+Tee",
  },
  {
    id: 2,
    category: "Hoodies",
    name: "Cozy Fleece Hoodie",
    price: "$55.00",
    image:
      "https://placehold.co/600x600/e0e0e0/333?text=Fleece+Hoodie",
  },
  {
    id: 3,
    category: "Jackets",
    name: "Lightweight Windbreaker",
    price: "$65.00",
    image:
      "https://placehold.co/600x600/d0d0d0/333?text=Windbreaker",
  },
  {
    id: 4,
    category: "T-Shirts",
    name: "V-Neck Graphic Tee",
    price: "$30.00",
    image:
      "https://placehold.co/600x600/f0f0f0/333?text=Graphic+Tee",
  },
  {
    id: 5,
    category: "Hoodies",
    name: "Zip-Up Hoodie",
    price: "$60.00",
    image:
      "https://placehold.co/600x600/e0e0e0/333?text=Zip-Up+Hoodie",
  },
  {
    id: 6,
    category: "T-Shirts",
    name: "Vintage Wash Tee",
    price: "$35.00",
    image:
      "https://placehold.co/600x600/f0f0f0/333?text=Vintage+Tee",
  },
  {
    id: 7,
    category: "Jackets",
    name: "Denim Jacket",
    price: "$85.00",
    image:
      "https://placehold.co/600x600/d0d0d0/333?text=Denim+Jacket",
  },
  {
    id: 8,
    category: "Hoodies",
    name: "Pullover Sweatshirt",
    price: "$50.00",
    image:
      "https://placehold.co/600x600/e0e0e0/333?text=Sweatshirt",
  },
];

const categories = [
  { name: "All", icon: <Filter className="w-4 h-4" /> },
  { name: "T-Shirts", icon: <Shirt className="w-4 h-4" /> },
  { name: "Hoodies", icon: <Tag className="w-4 h-4" /> },
  { name: "Jackets", icon: <Wind className="w-4 h-4" /> },
];

export default function NonCustomizedPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarFinal />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Ready to Wear
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our curated collection of graphic tees, hoodies, and jackets.
            No customization needed—just pick your style and go.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-10">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`flex items-center gap-2 px-4 py-2 text-sm sm:text-base sm:px-6 sm:py-3 font-semibold rounded-full transition-all duration-300 ease-in-out
                ${
                  activeCategory === category.name
                    ? "bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200"
                }
              `}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Product Card Component
function ProductCard({ product }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset after 2s
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x600/f87171/white?text=Image+Error";
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
      </div>
      <div className="p-5">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-pink-500 mt-1">
          {product.price}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`w-full flex items-center justify-center gap-2 mt-4 px-4 py-2.5 font-semibold rounded-lg text-white transition-all duration-200 ease-in-out
            ${
              isAdded
                ? "bg-green-500 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 hover:shadow-lg hover:scale-105"
            }
          `}
        >
          <ShoppingBag className="w-5 h-5" />
          {isAdded ? "Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
