'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, Filter } from 'lucide-react';
import Lightbox from '@/components/shared/Lightbox';
import { GalleryItem } from '@/types';

interface GalleryClientViewProps {
  initialItems: GalleryItem[];
  categories?: string[];
}

export default function GalleryClientView({
  initialItems,
  categories = ['All', 'Culture', 'Festivals', 'Youth', 'Community', 'Sports'],
}: GalleryClientViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems =
    activeCategory === 'All'
      ? initialItems
      : initialItems.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-16 bg-[#0A1440]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] font-bold shadow-md'
                  : 'bg-[#121F54] text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            No photos found in category &quot;{activeCategory}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative h-72 rounded-xl overflow-hidden cursor-pointer border border-[#1B3A6B] hover:border-[#C9A227] shadow-lg transition-all duration-300 gold-glow-hover"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.alt || item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1440] via-[#0A1440]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <span className="p-2 rounded-full bg-black/40 text-white group-hover:bg-[#C9A227] group-hover:text-[#0A1440] transition-colors">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>

                  <div>
                    <span className="inline-block text-[10px] uppercase font-bold text-[#E8C468] bg-[#1B3A6B] px-2.5 py-0.5 rounded-full mb-1">
                      {item.category} • {item.date}
                    </span>
                    <h3 className="text-base font-serif font-bold text-white group-hover:text-[#E8C468] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        items={filteredItems}
        currentIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setSelectedIndex(newIndex)}
      />
    </section>
  );
}
