"use client";
import React, { useState, useEffect } from "react";
import { NavbarFinal } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TrendingUp, ShoppingCart, Loader2, Tag } from "lucide-react";
import { mapProductFromBackend } from "@/utils/productMapper";

const TrendingStylesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/product/fetch");
        const json = await res.json();
        if (json.data) {
          const mapped = json.data.map(mapProductFromBackend);
          // Sort by view_count logic (assuming view_count is in raw data, if not just show slice)
          // Since mapper usually abstracts it, we'll randomize or take the first 12 for "trending" effect
          const trending = mapped.sort(() => 0.5 - Math.random()).slice(0, 8); 
          setProducts(trending);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    alert(`Added ${product.name} to cart`);
  };

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <TrendingUp size={36} className="text-green-500" /> Trending Styles
          </h1>
          <p className="text-lg text-gray-600">Discover what's hot right now.</p>
        </div>

        {loading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all">
                <div className="aspect-w-4 aspect-h-5 overflow-hidden relative h-80">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                    <button onClick={(e) => handleAddToCart(e, product)} className="bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200">
                        <ShoppingCart size={16} /> Add
                    </button>
                    <a href={`/shop/product/${product.id}`} className="text-white font-semibold underline">View</a>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-md font-bold text-gray-900">${product.price}</p>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 flex items-center gap-1"><Tag size={12}/> {product.category}</span>
                  </div>
                </div>
                <a href={`/shop/product/${product.id}`} className="absolute inset-0 z-0"><span className="sr-only">View</span></a>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TrendingStylesPage;