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
import { User, Heart, Search } from "lucide-react";
import { LuShoppingBag } from "react-icons/lu";
import SearchBar from "./SearchBar";
import NotificationDropdown from "./NotificationDropdown";

export function NavbarFinal() {
  const navItems = [
    { name: "Home", link: "/discover" },
    { name: "Custom Merch", link: "/customized/options" },
    { name: "Our Products", link: "/non-customized" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showMobileSearch, setShowMobileSearch] = useState(false); // New state for mobile search

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY < 100);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar>
      {/* --- DESKTOP NAVIGATION --- */}
      <NavBody className="hidden md:flex justify-between items-center w-full px-4 lg:px-8">
        
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <NavbarLogo />
        </div>

        {/* Center: Search & Links */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
            {/* Search Bar (Conditionally Visible on Scroll) */}
            <div className={`transition-all duration-300 w-full max-w-2xl ${visible ? 'opacity-100 h-auto mb-2' : 'opacity-0 h-0 overflow-hidden'}`}>
               <SearchBar />
            </div>
            
            {/* Nav Items */}
            <NavItems items={navItems} />
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-3 lg:gap-5 flex-shrink-0">
          <NotificationDropdown />
          
          <Link href="/wishlist">
            <NavbarButton variant="secondary">
              <Heart size={24} strokeWidth={2} className="hover:text-red-500 transition-colors" />
            </NavbarButton>
          </Link>

          <Link href="/cart">
            <NavbarButton variant="secondary">
              <LuShoppingBag size={24} strokeWidth={1.5} />
            </NavbarButton>
          </Link>

          <Link href="/account">
            <NavbarButton variant="secondary">
              <User size={24} strokeWidth={2} />
            </NavbarButton>
          </Link>
        </div>
      </NavBody>


      {/* --- MOBILE NAVIGATION --- */}
      <MobileNav className="md:hidden">
        <MobileNavHeader>
          <NavbarLogo />
          
          <div className="flex items-center gap-3">
            {/* Mobile Search Icon Toggle */}
            <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="p-2 text-gray-600">
                <Search size={22} />
            </button>

            {/* Mobile Cart Icon (Always Visible) */}
            <Link href="/cart">
                <LuShoppingBag size={24} className="text-gray-800" />
            </Link>

            <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        {/* Mobile Search Bar (Collapsible) */}
        {showMobileSearch && (
            <div className="px-4 py-3 bg-white border-b animate-in slide-in-from-top-2">
                <SearchBar />
            </div>
        )}

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {/* Mobile Links */}
          <div className="flex flex-col gap-4 pt-4">
            {navItems.map((item, idx) => (
                <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2"
                >
                {item.name}
                </Link>
            ))}
          </div>

          {/* Mobile Action Buttons (Grid Layout) */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center justify-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <Heart className="text-red-500" size={20} />
                    <span className="font-medium text-sm">Wishlist</span>
                </div>
            </Link>
            <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center justify-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <User className="text-blue-600" size={20} />
                    <span className="font-medium text-sm">Profile</span>
                </div>
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}