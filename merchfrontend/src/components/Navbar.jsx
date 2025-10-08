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
import { User } from 'lucide-react';
import { Heart } from 'lucide-react';
import { LuShoppingBag } from "react-icons/lu";
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
          <NavbarButton variant="secondary"><LuShoppingBag size={28} strokeWidth={1.5}/></NavbarButton>
          <NavbarButton variant="secondary"><Heart size={30} strokeWidth={2} color="red"/></NavbarButton>
          <NavbarButton variant="secondary"><User size={28} strokeWidth={2}/></NavbarButton>
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
              <Heart/>
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              <User/>
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
    // </div>
  );
}
