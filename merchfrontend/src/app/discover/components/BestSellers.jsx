"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BestSellers = ({ scrollLtoR, title, products = [], link = "/discover" }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [duration, setDuration] = useState(20);

  // Fallback to empty array to prevent errors
  const itemsToDisplay = products || [];

  useEffect(() => {
    const updateDuration = () => {
      const content = contentRef.current;
      if (!content) return;
      
      const totalWidth = content.scrollWidth;
      // If content hasn't rendered width yet, retry
      if (!totalWidth) {
        requestAnimationFrame(updateDuration);
        return;
      }

      // Calculate speed (width / pixels per second)
      // We duplicate the list, so we divide by 2 to get the base width
      const singleWidth = totalWidth / 2;
      const pxPerSecond = 80; 
      const computed = Math.max(10, singleWidth / pxPerSecond);
      setDuration(computed);
    };

    const raf = requestAnimationFrame(updateDuration);
    window.addEventListener("resize", updateDuration);
    
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateDuration);
    };
  }, [itemsToDisplay]);

  // Don't render empty sections
  if (itemsToDisplay.length === 0) return null;

  return (
    <div className="w-full mt-12 mb-12">
      {/* Header Section with View More */}
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-end mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          {title}
        </h2>
        
        <Link 
          href={link}
          className="group flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors"
        >
          View More
          <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Scrolling Marquee */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden py-4"
      >
        <div
          ref={contentRef}
          className="marquee flex items-center"
          style={{ animationDuration: `${duration}s` }}
        >
          {/* Duplicate list for seamless infinite loop */}
          {[...itemsToDisplay, ...itemsToDisplay].map((item, idx) => (
            <Link 
              href={`/shop/product/${item.id}`} 
              key={`${item.id}-${idx}`}
              className="flex-shrink-0 mr-6 block"
            >
              <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-[280px] h-[380px] transition-transform hover:scale-105 hover:shadow-xl">
                <div className="w-full h-56 rounded-xl overflow-hidden mb-4 bg-gray-50">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="text-center w-full px-2">
                  <h3 className="font-bold text-gray-900 text-base truncate w-full" title={item.name}>
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">
                    {item.category}
                  </p>
                  <div className="mt-3 flex items-baseline justify-center gap-2">
                    <p className="font-bold text-lg text-gray-900">${item.price}</p>
                    {item.originalPrice && (
                      <p className="text-sm text-gray-400 line-through">${item.originalPrice}</p>
                    )}
                  </div>
                </div>
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

        /* Pause on hover so user can click */
        .marquee:hover {
          animation-play-state: paused;
        }

        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: no-preference) {
          .marquee {
            will-change: transform;
          }
        }
      `}</style>
    </div>
  );
};

export default BestSellers;