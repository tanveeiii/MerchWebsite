"use client";
import React, { useState, useEffect } from "react";
import { NavbarFinal } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard"; // Import the robust component
import { Tag, Shirt, Filter, Wind, Layers, Loader2 } from "lucide-react";

export default function NonCustomizedPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("http://localhost:5000/api/product/fetch"),
          fetch("http://localhost:5000/api/category/fetch"),
        ]);

        const prodJson = await prodRes.json();
        const catJson = await catRes.json();

        // 1. Filter out "Customized" products
        // We assume any category containing 'custom' is a customized category
        const nonCustomProducts = (prodJson.data || []).filter((p) => {
          // Check if ANY category of this product is "Custom*"
          const isCustom = p.categories?.some((c) =>
            c.category_name.toLowerCase().includes("custom")
          );
          return !isCustom && p.is_active; // Only show non-custom and active products
        });

        // 2. Filter out "Customized" categories for the tabs
        const nonCustomCategories = (Array.isArray(catJson) ? catJson : []).filter(
          (c) => !c.category_name.toLowerCase().includes("custom")
        );

        setProducts(nonCustomProducts);
        setCategories(nonCustomCategories);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- FILTER LOGIC ---
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) =>
          p.categories?.some((c) => c.category_name === activeCategory)
        );

  // Helper to pick an icon based on category name (Optional visual flair)
  const getCategoryIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("hoodie")) return <Tag className="w-4 h-4" />;
    if (lower.includes("jacket") || lower.includes("wind")) return <Wind className="w-4 h-4" />;
    if (lower.includes("shirt") || lower.includes("tee")) return <Shirt className="w-4 h-4" />;
    return <Layers className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarFinal />

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

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
          </div>
        ) : (
          <>
            {/* Dynamic Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10">
              {/* 'All' Button */}
              <button
                onClick={() => setActiveCategory("All")}
                className={`flex items-center gap-2 px-4 py-2 text-sm sm:text-base sm:px-6 sm:py-3 font-semibold rounded-full transition-all duration-300 ease-in-out
                  ${
                    activeCategory === "All"
                      ? "bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200"
                  }
                `}
              >
                <Filter className="w-4 h-4" />
                All
              </button>

              {/* Dynamic Categories from DB */}
              {categories.map((cat) => (
                <button
                  key={cat.category_id}
                  onClick={() => setActiveCategory(cat.category_name)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm sm:text-base sm:px-6 sm:py-3 font-semibold rounded-full transition-all duration-300 ease-in-out
                    ${
                      activeCategory === cat.category_name
                        ? "bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200"
                    }
                  `}
                >
                  {getCategoryIcon(cat.category_name)}
                  {cat.category_name}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  // We map the backend data to the structure ProductCard expects if necessary
                  // Assuming ProductCard accepts the raw product object from DB directly
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <p className="text-xl font-medium">No products found in this category.</p>
                <button 
                    onClick={() => setActiveCategory("All")}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    View all products
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}