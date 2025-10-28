"use client";

import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "../../components/Footer";
import { NavbarFinal } from "@/components/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavbarFinal />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Footer />
    </div>
  );
};

export default HomePage;
