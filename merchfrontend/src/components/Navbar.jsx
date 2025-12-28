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
import { User, Heart } from "lucide-react";
import { LuShoppingBag } from "react-icons/lu";
import SearchBox from "./SearchBox";
import NotificationDropdown from "./NotificationDropdown"; // <--- 1. Import Added

export function NavbarFinal() {
  const navItems = [
    {
      name: "Home",
      link: "/discover",
    },
    {
      name: "Custom Merch",
      link: "/customized", 
    },
    {
      name: "Our Products",
      link: "/non-customized", 
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 100);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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

          {/* --- 2. Notification Dropdown Added Here --- */}
          <NotificationDropdown />
          {/* ------------------------------------------- */}

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
            {/* Note: Notifications are usually kept in the header for mobile or added as a list item here if needed */}
            
            <Link href="/cart" className="w-full">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                <LuShoppingBag />
              </NavbarButton>
            </Link>
            <Link href="/wishlist" className="w-full">
                <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
                >
                <Heart />
                </NavbarButton>
            </Link>
            <Link href="/account" className="w-full">
                <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
                >
                <User />
                </NavbarButton>
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}