import React from "react";
import { NavbarFinal } from "../../../components/Navbar"; // Adjusted path
import Footer from "../../../components/Footer"; // Adjusted path
import { ShoppingCart } from "lucide-react"; // Using lucide-react for icons

// You can fetch this data from your backend later
const mockGiftedProducts = [
  {
    id: 1,
    name: "Classic Logo Hoodie",
    price: 49.99,
    imageUrl:
      "https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    name: "Retro-Style T-Shirt",
    price: 24.99,
    imageUrl:
      "https://images.pexels.com/photos/4066290/pexels-photo-4066290.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    name: "Embroidered Beanie",
    price: 19.99,
    imageUrl:
      "https://images.pexels.com/photos/10153243/pexels-photo-10153243.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 4,
    name: "Stainless Steel Tumbler",
    price: 29.99,
    imageUrl:
      "https://images.pexels.com/photos/10390886/pexels-photo-10390886.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 5,
    name: "Custom 'Events' Tee",
    price: 27.99,
    imageUrl:
      "https://images.pexels.com/photos/1233648/pexels-photo-1233648.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 6,
    name: "Sports Jersey Replica",
    price: 79.99,
    imageUrl:
      "https://images.pexels.com/photos/4773769/pexels-photo-4773769.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 7,
    name: "Premium Sticker Pack",
    price: 14.99,
    imageUrl:
      "https://images.pexels.com/photos/6710420/pexels-photo-6710420.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 8,
    name: "Collector's Enamel Pin",
    price: 12.99,
    imageUrl:
      "https://images.pexels.com/photos/716107/pexels-photo-716107.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

// Product Card Component
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
      <p className="text-lg font-semibold text-gray-800">${product.price.toFixed(2)}</p>
      <button className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors">
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to cart
      </button>
    </div>
  </div>
);

// Main Page Component
const MostGiftedPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <NavbarFinal />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center mb-4">
          Most Gifted Merch
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Find the perfect presents that everyone loves.
        </p>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {mockGiftedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MostGiftedPage;

