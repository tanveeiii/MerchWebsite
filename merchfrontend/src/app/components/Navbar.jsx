import { ShoppingCart, Shirt } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Shirt className="w-8 h-8" strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-tight">
              TeeDesigns
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
            >
              Customized
            </a>
            <a
              href="#"
              className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
            >
              Non-Customized
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium">
              Start Shopping
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
