"use client";
import React, { useState } from "react";
import { NavbarFinal } from "@/components/Navbar"; // Using path alias
import Footer from "@/components/Footer"; // Using path alias
import { TrendingUp, ShoppingCart, ArrowRight, Tag } from "lucide-react";

// Mock product data for trending styles
const trendingProducts = [
  {
    id: 1,
    name: "Streetwise Utility Vest",
    price: "$89.99",
    category: "Vests",
    img: "https://placehold.co/400x500/34495e/FFF?text=Utility+Vest",
  },
  {
    id: 2,
    name: "Oversized Graphic Tee",
    price: "$44.99",
    category: "Tees",
    img: "https://placehold.co/400x500/e74c3c/FFF?text=Oversized+Tee",
  },
  {
    id: 3,
    name: "Retro-Future Sneakers",
    price: "$129.99",
    category: "Shoes",
    img: "https://placehold.co/400x500/8e44ad/FFF?text=Retro+Sneakers",
  },
  {
    id: 4,
    name: "Parachute Cargo Pants",
    price: "$99.99",
    category: "Pants",
    img: "https://placehold.co/400x500/2c3e50/FFF?text=Cargo+Pants",
  },
  {
    id: 5,
    name: "Faded Wash Denim",
    price: "$119.99",
    category: "Pants",
    img: "https://placehold.co/400x500/95a5a6/FFF?text=Faded+Denim",
  },
  {
    id: 6,
    name: "Techwear Crossbody Bag",
    price: "$59.99",
    category: "Accessories",
    img: "https://placehold.co/400x500/1abc9c/FFF?text=Crossbody+Bag",
  },
];

const categories = [
  "All",
  "Tees",
  "Vests",
  "Pants",
  "Shoes",
  "Accessories",
];

const TrendingStylesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? trendingProducts
      : trendingProducts.filter((p) => p.category === activeCategory);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Added ${product.name} to cart`);
    // Add your cart logic here
  };

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <TrendingUp size={36} className="text-green-500" />
            Trending Styles
          </h1>
          <p className="text-lg text-gray-600">
            Discover what's hot right now in the world of merch.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative aspect-w-4 aspect-h-5 overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay for Add to Cart and View Details */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col items-center justify-center p-4">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-md
                               opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <a
                    href={`/shop/product/${product.id}`}
                    className="flex items-center gap-2 mt-4 text-white font-medium
                               opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100"
                    onClick={(e) => e.stopPropagation()} // Prevent card click from firing
                  >
                    View Details <ArrowRight size={16} />
                  </a>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-lg font-bold text-gray-900">
                    {product.price}
                  </p>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Tag size={14} /> {product.category}
                  </span>
                </div>
              </div>
              <a
                href={`/shop/product/${product.id}`} // Main card link
                className="absolute inset-0 z-0"
              >
                <span className="sr-only">View {product.name}</span>
              </a>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrendingStylesPage;

