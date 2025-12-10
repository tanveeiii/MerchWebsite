"use client";
import React, { useState, useEffect } from "react";
import { NavbarFinal } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tag, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { mapProductFromBackend } from "@/utils/productMapper";

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
          const mapped = json.data.map(mapProductFromBackend).reverse(); // Reverse to show newest
          setProducts(mapped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Added ${product.name} to cart (Simulated)`);
  };

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">New Arrivals</h1>
          <p className="text-lg text-gray-600">Fresh styles just added.</p>
        </div>

        {loading ? (
           <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
        ) : (
          <>
            <div className="flex justify-center flex-wrap gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === category ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all">
                  <div className="aspect-w-4 aspect-h-5 overflow-hidden relative h-80">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                        <button onClick={(e) => handleAddToCart(e, product)} className="bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200"><ShoppingCart size={16} /> Add</button>
                        <a href={`/shop/product/${product.id}`} className="text-white font-semibold underline">View Details</a>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-md font-bold text-gray-900">${product.price}</p>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{product.category}</span>
                    </div>
                  </div>
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

export default NewArrivalsPage;