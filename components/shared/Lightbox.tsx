'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '@/types';

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while lightbox is active
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % items.length);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || !mounted || !items[currentIndex]) return null;

  const currentItem = items[currentIndex];

  const lightboxContent = (
    <div
      className="fixed inset-0 z-[99999] w-screen h-screen min-h-[100dvh] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 select-none animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full flex items-center justify-between z-10 px-2 sm:px-4 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs uppercase font-bold text-[#0A1440] bg-[#E8C468] rounded-full shadow-md">
            {currentItem.category || 'Gallery'}
          </span>
          <span className="text-xs font-semibold text-slate-300">
            {currentIndex + 1} of {items.length}
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close modal"
          className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/25 hover:text-[#E8C468] transition-all shadow-lg"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 w-full max-w-6xl mx-auto flex items-center justify-center px-2 sm:px-12 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex - 1 + items.length) % items.length)}
            aria-label="Previous image"
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 border border-white/10 text-white hover:bg-[#C9A227] hover:text-[#0A1440] transition-all z-20 shadow-xl"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex + 1) % items.length)}
            aria-label="Next image"
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 border border-white/10 text-white hover:bg-[#C9A227] hover:text-[#0A1440] transition-all z-20 shadow-xl"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Image Display Frame */}
        <div className="relative w-full h-[62vh] sm:h-[68vh] md:h-[72vh] flex items-center justify-center">
          <Image
            src={currentItem.imageUrl}
            alt={currentItem.alt || currentItem.title || 'Gallery image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div
        className="w-full max-w-2xl mx-auto text-center px-4 py-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.title && (
          <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-snug">
            {currentItem.title}
          </h3>
        )}
        {currentItem.caption && (
          <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {currentItem.caption}
          </p>
        )}
        {currentItem.date && !currentItem.caption && (
          <p className="text-xs text-slate-400 mt-0.5">{currentItem.date}</p>
        )}
      </div>
    </div>
  );

  return createPortal(lightboxContent, document.body);
}

