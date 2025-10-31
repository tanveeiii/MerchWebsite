"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  // We'll change the `images` array to `slides` to hold more data
  const slides = [
    {
      img: "https://placehold.co/1200x600/313131/FFF?text=New+Collection",
      headline: "The New Collection is Here",
      description:
        "Fresh designs for the new season. T-Shirts, hoodies, and more.",
      cta: "Shop Now",
      link: "/discover/new-arrivals",
    },
    {
      img: "https://placehold.co/1200x600/FF5733/FFF?text=Custom+Tees",
      headline: "Create Your Own Style",
      description: "Use our customizer to build the perfect tee, just for you.",
      cta: "Start Designing",
      link: "/customized",
    },
    {
      img: "https://placehold.co/1200x600/4a90e2/FFF?text=Spring+Sale",
      headline: "Spring Sale - Up to 40% Off",
      description: "Limited time offer on select merch. Don't miss out!",
      cta: "Shop the Sale",
      link: "/discover/sale",
    },
    {
      img: "https://placehold.co/1200x600/f4b400/FFF?text=Best+Sellers",
      headline: "Shop Our Best Sellers",
      description: "See what's trending and find your new favorite items.",
      cta: "See best sellers",
      link: "/discover/best-sellers",
    },
    {
      img: "https://placehold.co/1200x600/8e44ad/FFF?text=Hoodie+Season",
      headline: "Cozy Up with New Hoodies",
      description: "Explore our latest collection of hoodies and outerwear.",
      cta: "Shop Hoodies",
      link: "/discover/hoodies",
    },
  ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
      }, 3000); // Increased time to 3s
    }
    return () => clearTimeout(timeoutRef.current);
  }, [index, isPaused, slides.length]);

  const next = () =>
    setIndex((prev) => (prev + 1) % slides.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div
      className="relative h-[65vh] overflow-hidden rounded-xl m-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full h-full relative flex-shrink-0">
            {/* Background Image */}
            <img
              src={slide.img}
              alt={slide.headline}
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Text & CTA Content */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white p-8">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-down">
                {slide.headline}
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-lg animate-fade-in-up">
                {slide.description}
              </p>
              <a
                href={slide.link}
                className="bg-white text-black font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 hover:scale-105 transition-all animate-fade-in-up"
              >
                {slide.cta}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 text-black p-2 rounded-full shadow-md hover:bg-white transition-all z-20"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next Button */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 text-black p-2 rounded-full shadow-md hover:bg-white transition-all z-20"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-white" : "bg-white/50"
            } transition-all`}
          />
        ))}
      </div>

      {/* Simple CSS for fade-in animations */}
      <style jsx global>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.7s ease-out 0.3s both;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s ease-out 0.5s both;
        }
      `}</style>
    </div>
  );
};

export default Hero;

