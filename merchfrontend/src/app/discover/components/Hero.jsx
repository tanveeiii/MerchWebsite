"use client";
import React, { useEffect, useRef, useState } from "react";

const Hero = () => {
  const images = [
    "/images/image.png",
    "/images/image1.png",
    "/images/image2.png",
  ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 2000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [index, isPaused]);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative h-[65vh] overflow-hidden border-2 shadow-lg rounded-xl m-4" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="flex transition-transform duration-700 ease-in-out h-full " style={{ transform: `translateX(-${index * 100}%)` }}>
        {images.map((src, i) => (
          <img
            key = {i}
            src={src}
            alt={`photo-${i}`}
            className="w-full h-full object-cover flex-shrink-0 "
          />
        ))}
      </div>
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 text-black px-3 py-1 rounded-full shadow hover:scale-105 transition"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 text-black px-3 py-1 rounded-full shadow hover:scale-105 transition"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? 'bg-black' : 'bg-white/70'} transition-all`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
