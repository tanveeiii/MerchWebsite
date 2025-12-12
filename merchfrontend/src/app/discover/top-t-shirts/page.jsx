"use client";
import React, { useState, useEffect } from "react";
import { NavbarFinal } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Loader2 } from "lucide-react";
import { mapProductFromBackend } from "@/utils/productMapper";
import ProductCard from "@/components/ProductCard";

const TopTShirtsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/product/fetch");
        const json = await res.json();
        
        if (json.data) {
          const mapped = json.data.map(mapProductFromBackend);
          
          // 1. Filter by Tag "TopTshirts" (Ensure your products have this specific tag in DB)
          const topTshirts = mapped.filter(p => p.tag === "TopTshirts");
          
          setProducts(topTshirts);
        }
      } catch (e) {
        console.error("Failed to fetch top t-shirts:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Dynamic Categories based on the "TopTshirts" products found
  const categories = ["All", ...new Set(products.map(p => p.category))];

  // 3. Filter Display Logic
  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Star size={36} className="text-yellow-500" /> Top T-Shirt Picks
          </h1>
          <p className="text-lg text-gray-600">
            Hand-selected favorites just for you.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-gray-400" size={40} />
          </div>
        ) : (
          <>
            {/* --- Category Filter Buttons --- */}
            {categories.length > 1 && (
              <div className="flex justify-center flex-wrap gap-3 mb-12">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? "bg-black text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No top t-shirts found in this category.
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TopTShirtsPage;