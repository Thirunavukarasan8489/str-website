'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, Images, Sparkles } from 'lucide-react';
import Lightbox from '@/components/shared/Lightbox';
import { GalleryItem } from '@/types';

interface SingleAlbumGalleryViewProps {
  photos: GalleryItem[];
  albumTitle: string;
}

export default function SingleAlbumGalleryView({
  photos,
  albumTitle,
}: SingleAlbumGalleryViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  if (photos.length === 0) {
    return (
      <div className="py-20 text-center bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-8 space-y-3">
        <Images className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-serif font-bold text-white">No photos in this album yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Photos will appear here as soon as the admin uploads event pictures for this collection.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <div
            key={photo.id || index}
            onClick={() => openLightbox(index)}
            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-[#1B3A6B] hover:border-[#C9A227] shadow-xl transition-all duration-300 gold-glow-hover"
          >
            <Image
              src={photo.imageUrl}
              alt={photo.alt || photo.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1440] via-[#0A1440]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            {/* Overlay Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex justify-end">
                <span className="p-2.5 rounded-full bg-black/50 text-white group-hover:bg-[#C9A227] group-hover:text-[#0A1440] transition-colors shadow-md">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>

              <div>
                {/* <span className="inline-block text-[10px] uppercase font-bold text-[#E8C468] bg-[#1B3A6B] px-3 py-1 rounded-full mb-1.5 border border-[#C9A227]/30 shadow-sm">
                  {photo.category} {photo.date ? `• ${photo.date}` : ''}
                </span> */}

                {/* <h3 className="text-base font-serif font-bold text-white group-hover:text-[#E8C468] transition-colors leading-snug">
                  {photo.title}
                </h3> */}

                {/* {photo.caption && (
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    {photo.caption}
                  </p>
                )} */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        items={photos}
        currentIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setSelectedIndex(newIndex)}
      />
    </>
  );
}
