"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const slides = [
    {
      img: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1200",
      headline: "The New Collection is Here",
      description: "Fresh designs for the new season. T-Shirts, hoodies, and more.",
      cta: "Shop Now",
      link: "/discover/new-arrivals",
    },
    {
      img: "https://images.pexels.com/photos/3826678/pexels-photo-3826678.jpeg?auto=compress&cs=tinysrgb&w=1200",
      headline: "Create Your Own Style",
      description: "Use our customizer to build the perfect tee, just for you.",
      cta: "Start Designing",
      link: "/customized",
    },
    {
      img: "https://images.pexels.com/photos/5698853/pexels-photo-5698853.jpeg?auto=compress&cs=tinysrgb&w=1200",
      headline: "Spring Sale - Up to 40% Off",
      description: "Limited time offer on select merch. Don't miss out!",
      cta: "Shop the Sale",
      link: "/discover/sale",
    },
  ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
      }, 4000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [index, isPaused, slides.length]);

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div
      className="relative h-[65vh] overflow-hidden rounded-xl m-4 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full h-full relative flex-shrink-0">
            <img
              src={slide.img}
              alt={slide.headline}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white p-8">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-down">
                {slide.headline}
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-lg animate-fade-in-up">
                {slide.description}
              </p>
              <Link
                href={slide.link}
                className="bg-white text-black font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 hover:scale-105 transition-all animate-fade-in-up"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 text-black p-2 rounded-full shadow-md hover:bg-white transition-all z-20 opacity-0 group-hover:opacity-100">
        <ChevronLeft size={24} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 text-black p-2 rounded-full shadow-md hover:bg-white transition-all z-20 opacity-0 group-hover:opacity-100">
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/50"} transition-all`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;