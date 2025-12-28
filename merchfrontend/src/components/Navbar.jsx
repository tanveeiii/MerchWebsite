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
import SearchBar from "./SearchBar";
import NotificationDropdown from "./NotificationDropdown";

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
    const handleScroll = () => setVisible(window.scrollY < 100);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar>
      <NavBody>
        <div className="flex justify-around w-full items-center">
          <NavbarLogo />

          {/* Bigger Search Container */}
          {visible && (
            <div className="flex-[2] max-w-3xl mx-6 hidden md:block">
              <SearchBar />
            </div>
          )}

          <NavItems items={navItems} />
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />
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
