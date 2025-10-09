"use client";

import React from "react";

export default function ItemCard() {
  return (
    <div className=" max-h-max max-w-max">
        <div className="group relative w-80 h-56 rounded-t-lg overflow-hidden cursor-pointer shadow-lg">
        <img
            src="https://images.unsplash.com/photo-1522199710521-72d69614c702"
            alt="Merch"
            className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
        />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 gap-4">
            <div className="text-white text-xl font-semibold">Wishlist</div>
            <div className="text-white text-xl font-semibold">Add to Cart</div>
        </div>
        </div>
        <div className="flex flex-col text-[Poppins] mx-2">
            <div className="text-sm">Item Name</div>
            <div className="text-sm">Price</div>
        </div>
    </div>
  );
}
