"use client";
import React, { useState, useEffect } from "react";
import { NavbarFinal } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Loader2 } from "lucide-react";
import { mapProductFromBackend } from "@/utils/productMapper";
import ProductCard from "@/components/ProductCard";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

const TopPicksPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) router.replace("/auth/login");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/product/fetch");
        const json = await res.json();

        if (json.data) {
          const mapped = json.data.map(mapProductFromBackend);
          // Filter by Tag "Top Pick"
          const topPicks = mapped.filter((p) => p.tag === "Top Pick");
          setProducts(topPicks);
        }
      } catch (e) {
        console.error("Failed to fetch top picks:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Dynamic Categories
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filter Logic
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavbarFinal />
      
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3 flex justify-center items-center gap-2">
            <Star size={32} className="text-yellow-500 fill-yellow-500 md:w-9 md:h-9" /> 
            Our Top Picks
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Customer favorites and highly-rated items curated just for you.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-gray-400" size={48} />
          </div>
        ) : (
          <>
            {/* Category Filters - Responsive Flex Wrap */}
            {categories.length > 1 && (
              <div className="flex justify-center flex-wrap gap-2 md:gap-3 mb-10 md:mb-12">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2 text-sm md:text-base rounded-full font-medium transition-all duration-200 border ${
                      activeCategory === category
                        ? "bg-black text-white border-black shadow-lg transform scale-105"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {/* Product Grid - Responsive Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-lg text-gray-500">No top picks found in this category.</p>
                  <button 
                    onClick={() => setActiveCategory("All")}
                    className="mt-4 text-blue-600 hover:underline text-sm font-medium"
                  >
                    View all products
                  </button>
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

export default TopPicksPage;