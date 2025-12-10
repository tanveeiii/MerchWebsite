"use client";
import React, { useState, useEffect } from "react";
import { NavbarFinal } from "@/components/Navbar"; // Using absolute imports for consistency
import Footer from "@/components/Footer";
import { Tag, Star, ShoppingCart, Loader2, ArrowRight } from "lucide-react";
import { mapProductFromBackend } from "@/utils/productMapper";

const BestSellersPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // --- Fetch Real Data ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/product/fetch");
        const json = await res.json();
        
        if (json.data) {
          const mapped = json.data.map(mapProductFromBackend);
          
          // Logic for "Best Sellers":
          // In a real app, you'd sort by 'total_sold' or 'rating'. 
          // For now, we simulate this by taking the first 12 items or randomizing.
          const bestSellers = mapped.slice(0, 12); 
          
          setProducts(bestSellers);
        }
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- Dynamic Categories ---
  // Extract unique categories from the fetched products, plus "All"
  const categories = ["All", ...new Set(products.map(p => p.category))];

  // --- Filter Logic ---
  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Connect to actual Cart API
    alert(`Added ${product.name} to cart`);
  };

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Star size={36} className="text-yellow-500" /> Our Best Sellers
          </h1>
          <p className="text-lg text-gray-600">
            Top-rated picks, loved by our customers.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-gray-500" size={40} />
          </div>
        ) : (
          <>
            {/* Category Filters */}
            <div className="flex justify-center flex-wrap gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full flex items-center gap-1">
                        <Star size={12} /> BEST SELLER
                      </span>
                    </div>
                    
                    <div className="relative aspect-w-4 aspect-h-5 overflow-hidden h-80 bg-gray-100">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-md
                                     opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                        >
                          <ShoppingCart size={18} />
                          Add to Cart
                        </button>
                        <a
                          href={`/shop/product/${product.id}`}
                          className="flex items-center gap-2 text-white font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:underline"
                        >
                          View Details <ArrowRight size={16} />
                        </a>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 truncate" title={product.name}>
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex flex-col">
                            <p className="text-lg font-bold text-gray-900">
                            ${product.price}
                            </p>
                            {product.originalPrice && (
                                <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                            )}
                        </div>
                        <span className="text-sm text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                          <Tag size={14} /> {product.category}
                        </span>
                      </div>
                    </div>
                    
                    <a
                      href={`/shop/product/${product.id}`}
                      className="absolute inset-0 z-0"
                    >
                      <span className="sr-only">View {product.name}</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    No products found in this category.
                </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BestSellersPage;