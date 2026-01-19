"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Heart, Clock, Home, Tv, Film, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchModal } from "./SearchModal";

interface NavbarProps {
  isLoggedIn?: boolean;
  username?: string;
  onLogout?: () => void;
}

const navLinks = [
  { href: "/UserPage", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Tv },
  { href: "/browse?type=Movie", label: "Movies", icon: Film },
];

export function Navbar({ isLoggedIn = false, username, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-slate-950/90 backdrop-blur-xl border-b border-white/5"
            : "bg-gradient-to-b from-slate-950/80 to-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            {/* Logo - White Rounded Background + Refined Scale */}
            <Link href="/" className="flex items-center group transition-transform hover:scale-105">
              <Image
                src="/Slice Meow Final-log.png"
                alt="Slice Meow"
                width={200}
                height={80}
                className="h-14 md:h-16 w-auto object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href.replace("/UserPage", "/")}
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium transition-colors text-sm",
                    pathname === link.href.replace("/UserPage", "/")
                      ? "text-white bg-white/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Search button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
              >
                <Search size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                <span className="hidden sm:block text-sm font-medium text-slate-400 group-hover:text-slate-200">
                  Search
                </span>
                <kbd className="hidden sm:block text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500 font-mono">
                  ⌘K
                </kbd>
              </button>

              <Link
                href="/login"
                className="hidden sm:block text-[10px] font-bold text-slate-700 hover:text-slate-500 uppercase tracking-[0.2em] transition-colors"
              >
                Admin
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl animate-in slide-in-from-top duration-200">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href.replace("/UserPage", "/")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                    pathname === link.href.replace("/UserPage", "/")
                      ? "text-white bg-white/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-white/5 pt-2 mt-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold text-slate-700 uppercase tracking-widest hover:text-slate-500"
                >
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(item) => {
          // Handle navigation to anime detail
          console.log("Selected:", item);
        }}
      />
    </>
  );
}

export default Navbar;
