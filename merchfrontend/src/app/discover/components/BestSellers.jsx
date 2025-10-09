"use client";
import React, { useEffect, useRef, useState } from "react";

const BestSellers = ({scrollLtoR, title}) => {
  const bestSellers = [
    {
      title: "Best Sellers This Month",
      designer: "Kevin Morris",
      price: 20,
      image:
        "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Vintage Graphic Tee",
      designer: "Sophia Mitchell",
      price: 15,
      image:
        "https://images.pexels.com/photos/5698853/pexels-photo-5698853.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Minimalist Style",
      designer: "Liam Johnson",
      price: 25,
      image:
        "https://images.pexels.com/photos/8532389/pexels-photo-8532389.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Bold Statement Tee",
      designer: "Emma Thompson",
      price: 18,
      image:
        "https://images.pexels.com/photos/4066288/pexels-photo-4066288.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Nature Lover Tee",
      designer: "Oliver Brown",
      price: 22,
      image:
        "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [duration, setDuration] = useState(20);

  useEffect(() => {
    const updateDuration = () => {
      const content = contentRef.current;
      if (!content) return;
      const totalWidth = content.scrollWidth;
      if (!totalWidth) {
        requestAnimationFrame(updateDuration);
        return;
      }

      const singleWidth = totalWidth / 2;
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
  }, []);

  return (
    <div className="w-full mt-5">
     <div className="flex justify-center items-center mb-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
        {title}
      </h2>
    </div>


      <div
        ref={containerRef}
        className="relative w-full overflow-hidden" /* hides scrollbar */
      >
        {/* Content is duplicated to allow seamless looping */}
        <div
          ref={contentRef}
          className="marquee flex items-center"
          style={{ animationDuration: `${duration}s` }}
        >
          {[...bestSellers, ...bestSellers].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-6 min-w-[300px] flex-shrink-0 mr-6 transition-transform hover:scale-105"
            >
              <div className="w-64 h-64 rounded-2xl overflow-hidden mb-4">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-base">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.designer}</p>
              <p className="font-bold mt-1 text-lg">${item.price}</p>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
          .marquee {
            display: flex;
            width: max-content;
            animation: ${scrollLtoR ? "scrollRight":"scrollLeft"} linear infinite;
            animation-timing-function: linear;
          }

          .marquee:hover {
            animation-play-state: paused;
          }

          @keyframes scrollRight {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }

          @keyframes scrollLeft {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
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
