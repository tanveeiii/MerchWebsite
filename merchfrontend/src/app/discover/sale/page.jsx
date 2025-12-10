"use client";
import React, { useState, useEffect } from "react";
import { NavbarFinal } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tag, Percent, Loader2, ShoppingCart } from "lucide-react";
import { mapProductFromBackend } from "@/utils/productMapper";

const SalePage = () => {
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
          // FILTER: Only keep products that have a discount (originalPrice is not null)
          setProducts(mapped.filter(p => p.originalPrice !== null));
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
          <h1 className="text-4xl font-bold text-red-600 mb-2 flex items-center justify-center gap-3"><Percent size={36} /> On Sale!</h1>
          <p className="text-lg text-gray-600">Grab these styles at a discount.</p>
        </div>

        {loading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> : (
          <>
            <div className="flex justify-center flex-wrap gap-3 mb-12">
              {categories.map(category => (
                <button key={category} onClick={() => setActiveCategory(category)} className={`px-6 py-2 rounded-full font-medium transition-all ${activeCategory === category ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{category}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all">
                  <div className="absolute top-3 left-3 z-10"><span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">SALE</span></div>
                  <div className="aspect-w-4 aspect-h-5 overflow-hidden relative h-80">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-baseline gap-2">
                            <p className="text-lg font-bold text-red-600">${product.price}</p>
                            <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                        </div>
                        <span className="text-sm text-gray-500 flex items-center gap-1"><Tag size={14} /> {product.category}</span>
                    </div>
                  </div>
                  <a href={`/shop/product/${product.id}`} className="absolute inset-0 z-0"><span className="sr-only">View</span></a>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SalePage;