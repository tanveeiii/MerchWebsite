"use client";

import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "../../components/Footer";
import { NavbarFinal } from "@/components/Navbar";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HomePage = () => {
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
