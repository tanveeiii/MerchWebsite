import React from "react";
import { NavbarFinal } from "../../../components/Navbar"; // Adjusted path (3 levels up)
import Footer from "../../../components/Footer"; // Adjusted path (3 levels up)
import { ShoppingCart, Star } from "lucide-react"; // Added Star icon

// Mock data for Top Picks
const mockTopPicks = [
  {
    id: 1,
    name: "Premium Blend T-Shirt",
    price: 29.99,
    imageUrl:
      "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
  },
  {
    id: 2,
    name: "Urban Explorer Backpack",
    price: 89.99,
    imageUrl:
      "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
  },
  {
    id: 3,
    name: "Minimalist 'Icon' Cap",
    price: 24.99,
    imageUrl:
      "https://images.pexels.com/photos/1878821/pexels-photo-1878821.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
  },
  {
    id: 4,
    name: "Insulated Coffee Mug",
    price: 22.99,
    imageUrl:
      "https://images.pexels.com/photos/3734689/pexels-photo-3734689.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5,
  },
];

// Product Card Component (with ratings)
const ProductCard = ({ product }) => (
  <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
    <div className="aspect-w-3 aspect-h-4 overflow-hidden rounded-t-lg bg-gray-200 sm:aspect-none group-hover:opacity-75 h-72">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-full w-full object-cover object-center"
      />
    </div>
    <div className="flex flex-1 flex-col space-y-2 p-4">
      <h3 className="text-lg font-medium text-gray-900">
        <a href="#">
          <span aria-hidden="true" className="absolute inset-0" />
          {product.name}
        </a>
      </h3>
      {/* Star Rating */}
      <div className="flex items-center">
        {[...Array(product.rating)].map((_, i) => (
          <Star
            key={i}
            className="h-5 w-5 flex-shrink-0 text-yellow-400 fill-yellow-400"
          />
        ))}
        <span className="ml-2 text-sm text-gray-500">(120+ reviews)</span>
      </div>
      <p className="text-lg font-semibold text-gray-800">${product.price.toFixed(2)}</p>
      <button className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors">
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to cart
      </button>
    </div>
  </div>
);

// Main Page Component
const TopPicksPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <NavbarFinal />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center mb-4">
          Our Top Picks
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Customer favorites and best-rated items.
        </p>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {mockTopPicks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TopPicksPage;

