"use client";
import { Trash2 } from "lucide-react"; // I suggest using lucide icons if possible, much cleaner than SVGs

const CartItems = ({ items, onQuantityChange, onRemove }) => {
  return (
    <div className="grid lg:grid-cols-2 w-full mx-5">
      <div className="lg:col-span-2 bg-gray-100 p-6 rounded-md w-full">
        <h3 className="text-lg font-semibold text-slate-900">Your Cart ({items.length} Items)</h3>
        <hr className="border-gray-300 mt-4 mb-8" />

        <div className="space-y-8">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="grid sm:grid-cols-3 items-center gap-4 border-b border-gray-200 pb-6 last:border-0">
                <div className="sm:col-span-2 flex sm:items-center max-sm:flex-col gap-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 shrink-0 bg-white p-2 rounded-md shadow-sm">
                    <img
                      src={item.image || "https://readymadeui.com/images/product14.webp"} // Fallback image
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div>
                    <h4 className="text-[15px] font-semibold text-slate-900">
                      {item.name}
                    </h4>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => onRemove(item.id)}
                      className="flex items-center gap-1 text-xs font-medium text-red-500 cursor-pointer mt-2 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>

                    <div className="flex gap-4 mt-4 items-center">
                      {/* Size Selector (Static for now, can be dynamic later) */}
                      <div className="relative group">
                         <span className="text-xs text-gray-500 mr-2">Size:</span>
                         <span className="text-xs font-bold text-gray-800">XL</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-md bg-white">
                        <button
                          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-slate-900 hover:bg-gray-100 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2 text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-slate-900 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="sm:ml-auto">
                  <h4 className="text-lg font-bold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </h4>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItems;