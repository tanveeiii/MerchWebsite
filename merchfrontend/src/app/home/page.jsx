"use client";

import Navbar from "../../components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "../../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Footer />
    </div>
  );
};

export default HomePage;
