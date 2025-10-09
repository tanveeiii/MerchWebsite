"use client";
import React, { useEffect, useRef, useState } from "react";

const Hero = () => {
  const images = [
    "data:image/jpeg;base64,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",
    "/images/profile2.jpg",
    "/images/profile3.jpg",
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
