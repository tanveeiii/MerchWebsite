"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import { FaRegUser } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";
// import Footer from "../app/discover/components/Footer";
// import TopPicks from "./components/TopPicks";
// import TrendSetter from "./components/TrendSetter";
// import CustomTees from "./components/CustomTees";
// import BestSellers from "./components/BestSellers";
// import Inspiration from "./components/Inspiration";
import SearchBox from "./SearchBox"


export function NavbarFinal() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // show only when at top
      setAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // <div className="z-10 w-full sticky">
    // <>
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <div className="flex justify-around w-full">
        <NavbarLogo />
        <NavItems items={navItems}/>
        </div>
        <div className="flex items-center gap-4">
          {atTop && (
            <div className="transition-opacity duration-500 opacity-100">
              <SearchBox />
            </div>
          )}
          <NavbarButton variant="secondary"><LuShoppingBag size={28}/></NavbarButton>
          <NavbarButton variant="secondary"><FaRegHeart size={28}/></NavbarButton>
          <NavbarButton variant="secondary"><FaRegUser size={28}/></NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              <LuShoppingBag/>
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              <FaRegHeart/>
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              <FaRegUser/>
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
    // </div>
  );
}
