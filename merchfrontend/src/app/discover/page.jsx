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
import { Loader2 } from "lucide-react";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

const Discover = () => {
  const [loading, setLoading] = useState(true);

  // Data State
  const [topPick, setTopPick] = useState(null);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) router.replace("/auth/login");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/product/fetch");
        const json = await res.json();

        if (json.data) {
          const mapped = json.data.map(mapProductFromBackend);

          // 1. Top Pick: Use the first item
          setTopPick(mapped[0]);

          // 2. Trending: Randomize list to show variety
          // Note: In real app, sort by view_count
          const trending = [...mapped]
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);
          setTrendingProducts(trending);

          // 3. New Arrivals: Sort by ID descending (Newest first)
          const newest = [...mapped].sort((a, b) => b.id - a.id).slice(0, 10);
          setNewArrivals(newest);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <Hero />

      <div className="flex flex-col md:flex-row max-h-1/4 ml-3">
        <TopPicks product={topPick} />
        <MostGifted />
      </div>

      {/* --- SCROLLING SECTION 1: TRENDING --- */}
      <BestSellers
        scrollLtoR={true}
        title={"Trending Now"}
        products={trendingProducts}
        link="/discover/trending"
      />

      {/* --- SCROLLING SECTION 2: NEW ARRIVALS --- */}
      <BestSellers
        scrollLtoR={false}
        title={"New Arrivals"}
        products={newArrivals}
        link="/discover/new-arrivals"
      />

      <Inspiration />
      <CustomTees />
      <Footer />
    </div>
  );
};

export default Discover;
