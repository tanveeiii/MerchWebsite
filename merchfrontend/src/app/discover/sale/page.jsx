"use client";
import React, { useState, useEffect } from "react";
import { NavbarFinal } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Percent, Loader2 } from "lucide-react";
import { mapProductFromBackend } from "@/utils/productMapper";
import ProductCard from "@/components/ProductCard";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

const SalePage = () => {
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

          // 1. Filter by Tag "Sale"
          // This ensures only products explicitly tagged as "Sale" appear here
          const saleItems = mapped.filter((p) => p.tag === "Sale");

          setProducts(saleItems);
        }
      } catch (e) {
        console.error("Failed to fetch sale products:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Dynamic Categories (Based on the filtered "Sale" products)
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // 3. Display Filter Logic
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-600 mb-2 flex items-center justify-center gap-3">
            <Percent size={36} /> On Sale!
          </h1>
          <p className="text-lg text-gray-600">
            Grab these styles at a discount.
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
                        ? "bg-red-600 text-white shadow-md"
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
                  No sale items found in this category.
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

export default SalePage;
