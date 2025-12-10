"use client";
import React, { useEffect, useState } from "react";
import { NavbarFinal } from "../../components/Navbar";
import Footer from "../../components/Footer";
import TopPicks from "./components/TopPicks";
import MostGifted from "./components/MostGifted";
import CustomTees from "./components/SignupSection";
import BestSellers from "./components/BestSellers";
import Inspiration from "./components/Inspiration";
import Hero from "./components/Hero";
import { mapProductFromBackend } from "@/utils/productMapper";

const Discover = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/product/fetch");
        const data = await res.json();
        
        if (data.data) {
          const mapped = data.data.map(mapProductFromBackend);
          setProducts(mapped);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // -- Data Distribution --
  // 1. Top Pick: Use the first product available
  const topPickProduct = products.length > 0 ? products[0] : null;
  
  // 2. Best Sellers Groups: Slice the array
  const bestSellers1 = products.slice(0, 6);
  const bestSellers2 = products.slice(6, 12);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <Hero />
      
      <div className="flex flex-col md:flex-row max-h-1/4 ml-3">
        <TopPicks product={topPickProduct} />
        <MostGifted />
      </div>

      <BestSellers scrollLtoR={true} title={"Trending Now"} products={bestSellers1} />
      <BestSellers scrollLtoR={false} title={"New Arrivals"} products={bestSellers2} />
      
      <CustomTees />
      <Inspiration />
      <Footer />
    </div>
  );
};

export default Discover;