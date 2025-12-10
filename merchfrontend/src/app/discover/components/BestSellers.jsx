"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const BestSellers = ({ scrollLtoR, title, products = [] }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [duration, setDuration] = useState(20);

  // Fallback to empty array if undefined
  const itemsToDisplay = products || [];

  useEffect(() => {
    const updateDuration = () => {
      const content = contentRef.current;
      if (!content) return;
      const totalWidth = content.scrollWidth;
      if (!totalWidth) {
        requestAnimationFrame(updateDuration);
        return;
      }
      const singleWidth = totalWidth / 2; // Because we duplicate the list
      const pxPerSecond = 80;
      const computed = Math.max(8, singleWidth / pxPerSecond);
      setDuration(computed);
    };

    const raf = requestAnimationFrame(updateDuration);
    window.addEventListener("resize", updateDuration);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateDuration);
    };
  }, [itemsToDisplay]);

  if (itemsToDisplay.length === 0) return null;

  return (
    <div className="w-full mt-5">
      <div className="flex justify-center items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>

      <div ref={containerRef} className="relative w-full overflow-hidden">
        <div
          ref={contentRef}
          className="marquee flex items-center"
          style={{ animationDuration: `${duration}s` }}
        >
          {/* Duplicate list for seamless marquee loop */}
          {[...itemsToDisplay, ...itemsToDisplay].map((item, idx) => (
            <Link href={`/shop/product/${item.id}`} key={`${item.id}-${idx}`}>
              <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-6 min-w-[300px] flex-shrink-0 mr-6 transition-transform hover:scale-105 cursor-pointer">
                <div className="w-64 h-64 rounded-2xl overflow-hidden mb-4">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-base truncate w-full text-center">{item.name}</h3>
                <p className="font-bold mt-1 text-lg">${item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
          .marquee {
            display: flex;
            width: max-content;
            animation: ${scrollLtoR ? "scrollRight" : "scrollLeft"} linear infinite;
          }
          .marquee:hover { animation-play-state: paused; }
          @keyframes scrollRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
          @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};

export default BestSellers;