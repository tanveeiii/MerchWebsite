"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, Loader2, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Store all data here
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const router = useRouter();

  // --- 1. Fetch Search Index ONCE on mount ---
  useEffect(() => {
    const fetchIndex = async () => {
      try {
        const res = await fetch(proccess.env.NEXT_PUBLIC_BACKEND_URL + "product/search-index");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllProducts(data);
        }
      } catch (e) {
        console.error("Search Index Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchIndex();
  }, []);

  // --- 2. Instant Filtering Logic ---
  useEffect(() => {
    if (query.trim().length === 0) {
      setFilteredResults([]);
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    
    // Normalize string: removes special chars, spaces, and makes lowercase
    // "T-Shirt" -> "tshirt", "t shirt" -> "tshirt"
    const normalize = (str) => str?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
    const searchTerms = normalize(query);

    const results = allProducts.filter((p) => {
      const name = normalize(p.product_name);
      const category = normalize(p.category?.category_name);
      const tag = normalize(p.tag?.tag_name);

      return name.includes(searchTerms) || category.includes(searchTerms) || tag.includes(searchTerms);
    });

    setFilteredResults(results.slice(0, 8)); // Limit to top 8
  }, [query, allProducts]);

  // --- 3. Close when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 4. Keyboard Nav ---
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        router.push(`/shop/product/${filteredResults[selectedIndex].product_id}`);
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Input Container - Made BIGGER (h-14, text-lg) */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="Search for 'Hoodies', 'Oversized', 'Black'..."
          className="block w-full pl-14 pr-12 h-14 border-2 border-gray-100 rounded-full text-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md hover:border-gray-200"
        />
        
        {/* Right Icon */}
        <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
          {query ? (
            <button onClick={() => { setQuery(""); setIsOpen(false); }} className="hover:bg-gray-200 p-2 rounded-full transition">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          ) : (
            loading && <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          )}
        </div>
      </div>

      {/* --- Results Dropdown --- */}
      {isOpen && (
        <div className="absolute mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top">
          
          {filteredResults.length > 0 ? (
            <ul className="py-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <li className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                <TrendingUp size={14} /> Top Matches
              </li>
              {filteredResults.map((product, index) => (
                <li key={product.product_id}>
                  <Link 
                    href={`/shop/product/${product.product_id}`}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors border-b border-gray-50 last:border-0 cursor-pointer ${
                      index === selectedIndex ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="h-16 w-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                      <img 
                        src={product.ProductImage?.[0]?.image_url || "https://readymadeui.com/images/product14.webp"} 
                        alt={product.product_name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900 truncate">
                        {product.product_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {product.category?.category_name || "Product"}
                        </span>
                        {product.tag?.tag_name && (
                            <span className="text-xs text-blue-600">#{product.tag.tag_name}</span>
                        )}
                      </div>
                    </div>

                    {/* Price & Arrow */}
                    <div className="text-right flex flex-col items-end gap-1">
                        <span className="block text-green-600 font-bold text-base">${product.base_price}</span>
                        <ChevronRight className={`h-5 w-5 text-gray-300 transition-transform ${index === selectedIndex ? "translate-x-1 text-blue-500" : ""}`} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-10 text-center text-gray-500">
              <Search className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No results found</p>
              <p className="text-sm mt-1 text-gray-400">
                We couldn't find anything matching "<span className="text-gray-900 font-medium">{query}</span>".
              </p>
              <p className="text-xs mt-4 text-gray-400">Tip: Try generic terms like 'Hoodie' or 'Tee'</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}