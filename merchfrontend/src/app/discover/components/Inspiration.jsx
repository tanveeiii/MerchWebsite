"use client";
import React from "react";
import Link from "next/link"; // Import Link for navigation

const Inspiration = () => {
  // Updated sections with correct links to your new pages
  const inspirationSections = [
    {
      title: "Top T-shirt Picks",
      cta: "View Collection",
      image:
        "https://images.pexels.com/photos/5698853/pexels-photo-5698853.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/discover/top-t-shirts", // Links to Best Sellers page
    },
    {
      title: "Explore Our Latest Designs",
      cta: "Start Now",
      image:
        "https://images.pexels.com/photos/5698853/pexels-photo-5698853.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/discover/new-arrivals", // Links to New Arrivals page
    },
    {
      title: "Trending Styles",
      cta: "Shop Trends",
      image:
        "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/discover/trending", // Links to Trending page
    },
    {
      title: "Express Yourself with Tees",
      cta: "Discover More",
      image:
        "https://images.pexels.com/photos/4066288/pexels-photo-4066288.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/discover/virtual-try-on", // Links to the new Virtual Try-On page
    },
    {
      title: "Best Sellers This Month",
      cta: "Shop Bestsellers",
      image:
        "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/discover/best-sellers", // Links to Best Sellers page
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Get Inspired</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inspirationSections.map((section, index) => (
          <Link
            href={section.link || "#"} // Use the link from the section object
            key={index}
            className={`relative rounded-3xl overflow-hidden ${
              index === 3 ? "md:row-span-2" : ""
            } min-h-80 group cursor-pointer hover:shadow-2xl transition-shadow`}
          >
            <img
              src={section.image}
              alt={section.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white text-3xl font-bold mb-4">
                {section.title}
              </h3>
              {/* This button is now part of the Link, so it's clickable */}
              <div className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors w-fit">
                {section.cta}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Inspiration;

