"use client";
import React, { useState, useEffect } from "react";
import { NavbarFinal } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Gift, Loader2 } from "lucide-react";
import { mapProductFromBackend } from "@/utils/productMapper";
import ProductCard from "@/components/ProductCard";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

const MostGiftedPage = () => {
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

          // 1. Filter by Tag "Gift" (Ensure your products have this tag in DB)
          const gifted = mapped.filter((p) => p.tag === "Gift");

          setProducts(gifted);
        }
      } catch (e) {
        console.error("Failed to fetch most gifted products:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Dynamic Categories based on the "Gift" products found
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // 3. Filter Display Logic
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center mb-4 flex justify-center items-center gap-2">
            <Gift className="text-pink-500" /> Most Gifted Merch
          </h1>
          <p className="text-lg text-gray-600 text-center mb-12">
            Perfect presents everyone loves.
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
                        ? "bg-pink-500 text-white shadow-md"
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
                  No gifted items found in this category.
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

export default MostGiftedPage;
