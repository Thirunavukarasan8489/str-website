'use client';

import React, { useEffect } from 'react';
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % items.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || !items[currentIndex]) return null;

  const currentItem = items[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery view"
    >
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
      >
        <X className="w-6 h-6" />
      </button>

      <button
        onClick={() => onNavigate((currentIndex - 1 + items.length) % items.length)}
        aria-label="Previous image"
        className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 text-white hover:bg-[#C9A227] hover:text-[#0A1440] transition-colors z-50"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => onNavigate((currentIndex + 1) % items.length)}
        aria-label="Next image"
        className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 text-white hover:bg-[#C9A227] hover:text-[#0A1440] transition-colors z-50"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="max-w-4xl w-full flex flex-col items-center">
        <div className="relative w-full h-[60vh] md:h-[70vh] rounded-xl overflow-hidden shadow-2xl border border-white/10">
          <Image
            src={currentItem.imageUrl}
            alt={currentItem.alt}
            fill
            className="object-contain"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
        </div>

        <div className="mt-4 text-center text-white max-w-2xl px-4">
          <span className="inline-block text-xs uppercase tracking-wider text-[#E8C468] font-semibold bg-[#1B3A6B] px-3 py-1 rounded-full mb-2">
            {currentItem.category} • {currentItem.date}
          </span>
          <h3 className="text-xl font-serif font-bold text-white mb-1">
            {currentItem.title}
          </h3>
          <p className="text-sm text-slate-300">{currentItem.caption}</p>
        </div>
      </div>
    </div>
  );
}
