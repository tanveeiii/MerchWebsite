"use client";
import React, { useState, useEffect } from "react";
import { NavbarFinal } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Gift, ShoppingCart, Loader2 } from "lucide-react";
import { mapProductFromBackend } from "@/utils/productMapper";

const MostGiftedPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/product/fetch");
        const json = await res.json();
        if (json.data) {
          const mapped = json.data.map(mapProductFromBackend);
          // FILTER: Affordable gifts (Price < 50)
          setProducts(mapped.filter(p => parseFloat(p.price) < 50).slice(0, 12));
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center mb-4 flex justify-center items-center gap-2">
          <Gift className="text-pink-500" /> Most Gifted Merch
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">Perfect presents everyone loves.</p>

        {loading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all">
                <div className="aspect-w-3 aspect-h-4 bg-gray-200 h-72 overflow-hidden">
                  <img src={product.img} alt={product.name} className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex flex-1 flex-col space-y-2 p-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="text-lg font-semibold text-gray-800">${product.price}</p>
                  <button className="mt-4 flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to cart
                  </button>
                </div>
                <a href={`/shop/product/${product.id}`} className="absolute inset-0 z-0"><span className="sr-only">View</span></a>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MostGiftedPage;