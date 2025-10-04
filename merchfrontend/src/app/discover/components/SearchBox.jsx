import React from "react";
import Hero from "./Hero";
import { Search, Tag, ShoppingBag } from "lucide-react";

const SearchBox = () => {
  return (
    <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search t-shirts"
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-pink-400 focus:outline-none"
              />
            </div>
          </div>
          <button className="ml-4 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
            $10.99
          </button>
        </div>

        <Hero />
      </div>
    </div>
  );
};

export default SearchBox;
