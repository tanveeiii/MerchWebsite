"use client";
import React, { useEffect, useRef } from "react";

const BestSellers = () => {
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

  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrame;
    let scrollSpeed = 100; // adjust for faster/slower scrolling

    const smoothScroll = () => {
      scrollContainer.scrollLeft += scrollSpeed;

      // reset to start when reaching end
      if (
        scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth
      ) {
        scrollContainer.scrollLeft = 0;
      }

      animationFrame = requestAnimationFrame(smoothScroll);
    };

    animationFrame = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Top Picks
        </h2>
        <button className="text-sm font-medium hover:underline">
          Check Them Out
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-scroll no-scrollbar snap-x snap-mandatory"
      >
        {[...bestSellers, ...bestSellers].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md hover:shadow-lg p-5 min-w-[260px] snap-start cursor-pointer transition-transform hover:scale-105"
          >
            <div className="w-52 h-52 rounded-2xl overflow-hidden mb-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-base">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.designer}</p>
            <p className="font-bold mt-1 text-lg">${item.price}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default BestSellers;
