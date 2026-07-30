'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Calendar, Users, Image as ImageIcon, Newspaper, Mail, Home, Award } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

export default function MobileMenu({ isOpen, onClose, pathname }: MobileMenuProps) {
  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About Us', href: '/about', icon: Users },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Gallery', href: '/gallery', icon: ImageIcon },
    { name: 'Membership', href: '/membership', icon: Award },
    { name: 'News', href: '/news', icon: Newspaper },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md md:hidden"
            aria-hidden="true"
          />

          {/* Sliding Navigation Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[#0A1440] border-l border-[#C9A227]/30 shadow-2xl flex flex-col justify-between p-6 md:hidden overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <Link href="/" onClick={onClose} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C9A227] to-[#E8C468] p-0.5 shadow-md">
                  <div className="w-full h-full bg-[#0A1440] rounded-full flex items-center justify-center overflow-hidden relative">
                    <Image
                      src="/logo.png"
                      alt="Scotland Tamils Raise Logo"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                </div>
                <span className="font-serif font-bold text-lg text-white">
                  Scotland Tamils Raise
                </span>
              </Link>
              <button
                onClick={onClose}
                aria-label="Close navigation menu"
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-[#E8C468]" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="my-auto py-6 flex flex-col space-y-2">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-lg text-base font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#1B3A6B] to-[#0A1440] text-[#E8C468] border-l-4 border-[#C9A227] font-semibold shadow-sm'
                          : 'text-slate-200 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#C9A227]' : 'text-slate-400'}`} />
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
              <Link
                href="/membership/join"
                onClick={onClose}
                className="w-full text-center py-3.5 rounded-lg font-bold text-[#0A1440] bg-gradient-to-r from-[#C9A227] to-[#E8C468] shadow-md hover:brightness-110 transition-all text-sm uppercase tracking-wider"
              >
                Join STR Community
              </Link>
              <Link
                href="/donate"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white bg-[#8B1A2B] hover:bg-[#a31f33] transition-all text-sm"
              >
                <Heart className="w-4 h-4 text-white fill-white" /> Support / Donate
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
