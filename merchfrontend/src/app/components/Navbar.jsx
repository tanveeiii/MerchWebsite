"use client";

import { ShoppingCart, Shirt } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Shirt className="w-8 h-8 text-white" strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-tight text-white">
              TeeCustoms
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white hover:text-orange-100 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/discover"
              className="text-white hover:text-orange-100 transition-colors font-medium"
            >
              Discover
            </Link>
            <a
              href="#"
              className="text-white hover:text-orange-100 transition-colors font-medium"
            >
              Customized
            </a>
            <a
              href="#"
              className="text-white hover:text-orange-100 transition-colors font-medium"
            >
              Non-Customized
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="bg-white text-orange-500 px-6 py-2 rounded-md hover:bg-orange-50 transition-colors font-bold">
              Start Shopping
            </button>
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
