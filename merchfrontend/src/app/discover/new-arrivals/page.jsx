"use client";
import React, { useState, useEffect } from "react";
import { NavbarFinal } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { mapProductFromBackend } from "@/utils/productMapper";
import ProductCard from "@/components/ProductCard";

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/product/fetch");
        const json = await res.json();
        if (json.data) {
          const newArrivals = mapped.filter(p => p.tag === "New Arrival");
          setProducts(newArrivals);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filteredProducts = activeCategory === "All" ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">New Arrivals</h1>
          <p className="text-lg text-gray-600">Fresh styles just added.</p>
        </div>

        {loading ? <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div> : (
          <>
            <div className="flex justify-center flex-wrap gap-3 mb-12">
              {categories.map((category) => (
                <button key={category} onClick={() => setActiveCategory(category)} className={`px-6 py-2 rounded-full font-medium transition-all ${activeCategory === category ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {category}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewArrivalsPage;