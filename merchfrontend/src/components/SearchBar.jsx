"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        fetchResults(query);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchResults = async (searchQuery) => {
    setLoading(true);
    setIsOpen(true);
    try {
      const res = await fetch(`http://localhost:5000/api/product/search?q=${searchQuery}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
        if (selectedIndex >= 0) {
            router.push(`/shop/product/${results[selectedIndex].product_id}`);
            setIsOpen(false);
        }
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto"> {/* Changed max-w-xl to max-w-2xl */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" /> {/* Bigger Icon */}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          placeholder="Search for items..."
          className="block w-full pl-14 pr-12 py-4 border border-gray-200 rounded-full text-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
        />
        {/* Loading / Clear Icon */}
        <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
          {loading ? (
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          ) : query ? (
            <button onClick={() => { setQuery(""); setIsOpen(false); }} className="hover:bg-gray-200 p-1.5 rounded-full transition">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && (query.length > 1) && (
        <div className="absolute mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <ul className="py-2 max-h-[70vh] overflow-y-auto">
              <li className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                Products Found ({results.length})
              </li>
              {results.map((product, index) => (
                <li key={product.product_id}>
                  <Link 
                    href={`/shop/product/${product.product_id}`}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors border-b border-gray-50 last:border-0 ${
                      index === selectedIndex ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="h-14 w-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                      <img 
                        src={product.ProductImage?.[0]?.image_url || "https://readymadeui.com/images/product14.webp"} 
                        alt={product.product_name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900 truncate">
                        {product.product_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {product.category?.category_name}
                      </p>
                    </div>
                    <div className="text-right">
                        <span className="block text-green-600 font-bold text-sm">${product.base_price}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            !loading && (
              <div className="p-10 text-center text-gray-500">
                <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-lg font-medium text-gray-900">No results found</p>
                <p className="text-sm mt-1 text-gray-400">We couldn't find anything for "{query}"</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}