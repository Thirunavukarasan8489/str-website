"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Heart } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Membership", href: "/membership" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0A1440]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-3"
            : "bg-gradient-to-b from-[#0A1440]/90 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-[#C9A227] via-[#E8C468] to-[#C9A227] p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0A1440] rounded-full flex items-center justify-center overflow-hidden relative">
                <Image
                  src="/logo.png"
                  alt="Scotland Tamils Raise Logo"
                  width={44}
                  height={44}
                  className="object-cover w-full h-full rounded-full"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base md:text-xl text-white tracking-tight leading-none group-hover:text-[#E8C468] transition-colors">
                Scotland Tamils Raise
              </span>
              <span className="text-[10px] md:text-xs text-[#E8C468] font-medium tracking-wider uppercase mt-0.5">
                Heritage • Community • Culture
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[#E8C468] bg-[#1B3A6B]/50 font-semibold border-b-2 border-[#C9A227]"
                      : "text-slate-200 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Header Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/donate"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-[#8B1A2B] hover:bg-[#a31f33] rounded-lg transition-colors shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span>Donate Now</span>
            </Link>
            <Link
              href="/membership/join"
              className="px-4 py-2 text-xs md:text-sm font-bold text-[#0A1440] bg-gradient-to-r from-[#C9A227] to-[#E8C468] hover:from-[#E8C468] hover:to-[#C9A227] rounded-lg transition-all shadow-md hover:shadow-[#C9A227]/25"
            >
              Join Us
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
