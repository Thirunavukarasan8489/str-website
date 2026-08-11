'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Images, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import CTAButton from '@/components/shared/CTAButton';
import { GalleryAlbum } from '@/types';
import { GALLERY_ALBUMS_DATA } from '@/lib/data';

interface GalleryPreviewProps {
  initialAlbums?: GalleryAlbum[];
}

export default function GalleryPreview({ initialAlbums }: GalleryPreviewProps) {
  // Show up to 6 latest album cards
  const previewAlbums = (
    initialAlbums && initialAlbums.length > 0 ? initialAlbums : GALLERY_ALBUMS_DATA
  ).slice(0, 6);

  return (
    <section className="py-20 bg-[#0A1440] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="MOMENTS & MEMORIES"
          title="Vibrant Moments from Scottish Tamil Life"
          subtitle="A visual showcase of our cultural galas, youth performances, community feasts, and Highland excursions."
        />

        {previewAlbums.length === 0 ? (
          <div className="text-center py-16 bg-[#121F54]/50 border border-[#1B3A6B] rounded-2xl p-8 space-y-3">
            <Images className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-white">No gallery albums available</h3>
            <p className="text-xs text-slate-400">
              Gallery albums will appear here as soon as they are created.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewAlbums.map((album) => {
              const photoCount = album.photoCount !== undefined ? album.photoCount : album.photos?.length || 0;

              return (
                <Link
                  key={album.id || album.slug}
                  href={`/gallery/${album.slug}`}
                  className="group bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between gold-glow-hover transform hover:-translate-y-1"
                >
                  <div>
                    {/* Cover Image Frame */}
                    <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                      <Image
                        src={album.coverImage}
                        alt={album.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1440] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                        <span className="px-3 py-1 text-[11px] uppercase font-bold text-[#0A1440] bg-[#E8C468] rounded-full shadow-md">
                          {album.category}
                        </span>

                        <span className="px-2.5 py-1 text-[11px] font-bold text-white bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1 shadow-md">
                          <Images className="w-3.5 h-3.5 text-[#E8C468]" />
                          <span>{photoCount} Photos</span>
                        </span>
                      </div>
                    </div>

                    {/* Album Details */}
                    <div className="p-6 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>{album.date}</span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#E8C468] transition-colors leading-snug">
                        {album.title}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {album.description || 'Explore the complete photo collection from this celebration.'}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom CTA Bar */}
                  <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#E8C468] group-hover:text-white transition-colors bg-[#0D1845]">
                    <span>View Full Collection</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-[#C9A227]" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center pt-4">
          <CTAButton href="/gallery" variant="secondary">
            <span>Explore All Photo & Video Collections</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
