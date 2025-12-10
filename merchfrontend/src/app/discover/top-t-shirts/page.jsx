"use client";
import React, { useState, useEffect } from "react";
import { NavbarFinal } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, ShoppingCart, Loader2 } from "lucide-react";
import { mapProductFromBackend } from "@/utils/productMapper";

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
          // FILTER: Category must contain 'tee' or 'shirt'
          const tees = mapped.filter(p => 
            p.category.toLowerCase().includes("tee") || 
            p.category.toLowerCase().includes("shirt")
          );
          setProducts(tees);
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
          <p className="text-lg text-gray-600">Hand-selected favorites just for you.</p>
        </div>

        {loading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.length > 0 ? products.map(product => (
              <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all">
                <div className="aspect-w-4 aspect-h-5 overflow-hidden relative h-80">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-lg font-bold text-gray-900 mt-2">${product.price}</p>
                </div>
                <a href={`/shop/product/${product.id}`} className="absolute inset-0 z-0"><span className="sr-only">View</span></a>
              </div>
            )) : <p className="text-center w-full text-gray-500">No t-shirts found.</p>}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TopTShirtsPage;