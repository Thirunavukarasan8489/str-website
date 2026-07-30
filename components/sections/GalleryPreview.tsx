"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Maximize2, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAButton from "@/components/shared/CTAButton";
import Lightbox from "@/components/shared/Lightbox";
import { GALLERY_DATA } from "@/lib/data";

export default function GalleryPreview() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const previewItems = GALLERY_DATA.slice(0, 6);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-20 bg-[#0A1440] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Moments & Memories"
          title="Vibrant Moments from Scottish Tamil Life"
          subtitle="A visual showcase of our cultural galas, youth performances, community feasts, and Highland excursions."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {previewItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative h-64 rounded-xl overflow-hidden cursor-pointer border border-[#1B3A6B] hover:border-[#C9A227] shadow-lg transition-all duration-300 gold-glow-hover"
            >
              <Image
                src={item.imageUrl}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1440] via-[#0A1440]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="flex justify-end">
                  <span className="p-2 rounded-full bg-black/40 text-white group-hover:bg-[#C9A227] group-hover:text-[#0A1440] transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>

                <div>
                  <span className="inline-block text-[10px] uppercase font-bold text-[#E8C468] bg-[#1B3A6B] px-2.5 py-0.5 rounded-full mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-base font-serif font-bold text-white group-hover:text-[#E8C468] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <CTAButton href="/gallery" variant="secondary">
            <span>Explore Full Photo & Video Gallery</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </CTAButton>
        </div>
      </div>

      <Lightbox
        items={previewItems}
        currentIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setSelectedIndex(newIndex)}
      />
    </section>
  );
}
