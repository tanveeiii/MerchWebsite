"use client";
import React, { useState } from "react"; // Corrected this line
import { NavbarFinal } from "../../../components/Navbar"; // 3 levels up to src, then /components
import Footer from "../../../components/Footer"; // 3 levels up to src, then /components
import { Tag, Star, ShoppingCart } from "lucide-react";

// Mock product data for best sellers
const bestSellers = [
  {
    id: 1,
    name: "Premium Custom Hoodie",
    price: "$49.99",
    category: "Hoodies",
    img: "https://placehold.co/400x500/1abc9c/FFF?text=Premium+Hoodie",
  },
  {
    id: 2,
    name: "Signature Logo Tee",
    price: "$24.99",
    category: "T-Shirts",
    img: "https://placehold.co/400x500/3498db/FFF?text=Signature+Tee",
  },
  {
    id: 3,
    name: "Everyday Essential Tee",
    price: "$22.99",
    category: "T-Shirts",
    img: "https://placehold.co/400x500/9b59b6/FFF?text=Essential+Tee",
  },
  {
    id: 4,
    name: "Embroidered Beanie",
    price: "$18.99",
    category: "Accessories",
    img: "https://placehold.co/400x500/f1c40f/FFF?text=Beanie",
  },
  {
    id: 5,
    name: "Graphic Print T-Shirt",
    price: "$29.99",
    category: "T-Shirts",
    img: "https://placehold.co/400x500/e67e22/FFF?text=Graphic+Tee",
  },
  {
    id: 6,
    name: "Urban Tote Bag",
    price: "$21.99",
    category: "Accessories",
    img: "https://placehold.co/400x500/e74c3c/FFF?text=Tote+Bag",
  },
];

const categories = ["All", "T-Shirts", "Hoodies", "Accessories"];

const BestSellersPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? bestSellers
      : bestSellers.filter((p) => p.category === activeCategory);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent card click
    console.log(`Added ${product.name} to cart`);
    // Add your cart logic here (e.g., updating context)
  };

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Star size={36} className="text-yellow-500" /> Our Best Sellers
          </h1>
          <p className="text-lg text-gray-600">
            Top-rated picks, loved by our customers.
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
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full flex items-center gap-1">
                  <Star size={12} /> BEST SELLER
                </span>
              </div>
              <div className="relative aspect-w-4 aspect-h-5 overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Add to Cart button on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-md
                               opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
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
                href={`/shop/product/${product.id}`} // Example product page link
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

export default BestSellersPage;

