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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/product/fetch");
        const json = await res.json();
        if (json.data) {
          const mapped = json.data.map(mapProductFromBackend);
          const topTshirts = mapped.filter(p => p.tag === "TopTshirts");          
          setProducts(topTshirts);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Star size={36} className="text-yellow-500" /> Top T-Shirt Picks
          </h1>
        </div>
        {loading ? <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TopTShirtsPage;