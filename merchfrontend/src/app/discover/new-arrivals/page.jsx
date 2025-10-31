"use client";
import React, { useState } from "react";
import { NavbarFinal } from "@/components/Navbar"; // Using path alias
import Footer from "@/components/Footer"; // Using path alias
import { Tag } from "lucide-react";

// Mock product data
const newProducts = [
  {
    id: 1,
    name: "Classic Logo Tee",
    price: "$24.99",
    category: "T-Shirts",
    img: "https://placehold.co/400x500/313131/FFF?text=Classic+Tee",
  },
  {
    id: 2,
    name: "Embroidered Hoodie",
    price: "$54.99",
    category: "Hoodies",
    img: "https://placehold.co/400x500/4a90e2/FFF?text=Embroidered+Hoodie",
  },
  {
    id: 3,
    name: "Customizable Cap",
    price: "$19.99",
    category: "Accessories",
    img: "https://placehold.co/400x500/f4b400/FFF?text=Custom+Cap",
  },
  {
    id: 4,
    name: "Graphic Print T-Shirt",
    price: "$29.99",
    category: "T-Shirts",
    img: "https://placehold.co/400x500/FF5733/FFF?text=Graphic+Tee",
  },
  {
    id: 5,
    name: "Vintage Wash Sweatshirt",
    price: "$49.99",
    category: "Hoodies",
    img: "https://placehold.co/400x500/8e44ad/FFF?text=Vintage+Sweatshirt",
  },
  {
    id: 6,
    name: "Logo Beanie",
    price: "$17.99",
    category: "Accessories",
    img: "https://placehold.co/400x500/34495e/FFF?text=Beanie",
  },
  {
    id: 7,
    name: "Long Sleeve Tee",
    price: "$32.99",
    category: "T-Shirts",
    img: "https://placehold.co/400x500/2ecc71/FFF?text=Long+Sleeve",
  },
  {
    id: 8,
    name: "Tote Bag",
    price: "$22.99",
    category: "Accessories",
    img: "https://placehold.co/400x500/9b59b6/FFF?text=Tote+Bag",
  },
];

const categories = ["All", "T-Shirts", "Hoodies", "Accessories"];

const NewArrivalsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? newProducts
      : newProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            New Arrivals
          </h1>
          <p className="text-lg text-gray-600">
            Check out the freshest styles just added to our collection.
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
                  ? "bg-black text-white"
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
              <div className="aspect-w-4 aspect-h-5 overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-md text-gray-700">{product.price}</p>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Tag size={14} /> {product.category}
                  </span>
                </div>
              </div>
              <a
                href={`/shop/product/${product.id}`} // Example product page link
                className="absolute inset-0"
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

export default NewArrivalsPage;

