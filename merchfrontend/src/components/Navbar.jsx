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
import Link from "next/link";
import { useMotionValueEvent } from "motion/react";
import { User } from "lucide-react";
import { Heart } from "lucide-react";
import { LuShoppingBag } from "react-icons/lu";
import SearchBox from "./SearchBox";

export function NavbarFinal() {
  const navItems = [
    {
      name: "Lowers",
      link: "#features",
    },
    {
      name: "Customized",
      link: "/customized", // Updated link to the new page
    },
    {
      name: "Non-Customized",
      link: "non-customized", // Updated link to the new page
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 100);
    };

    // set initial state based on current scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
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
          <NavItems items={navItems} />
        </div>
        <div className="flex items-center gap-4">
          {visible && (
            <div className="transition-opacity duration-500 opacity-100">
              <SearchBox />
            </div>
          )}
          <Link className="w-full" href="/cart">
            <NavbarButton variant="secondary">
              <LuShoppingBag size={28} strokeWidth={1.5} />
            </NavbarButton>
          </Link>
          <Link className="w-full" href="/wishlist">
            <NavbarButton variant="secondary">
              <Heart size={30} strokeWidth={2} color="red" />
            </NavbarButton>
          </Link>
          <Link className="w-full" href="/account">
            <NavbarButton variant="secondary">
              <User size={28} strokeWidth={2} />
            </NavbarButton>
          </Link>
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
            <Link href="/orderDetails" className="w-full">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                <LuShoppingBag />
              </NavbarButton>
            </Link>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              <Heart />
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              <User />
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
    // </div>
  );
}

