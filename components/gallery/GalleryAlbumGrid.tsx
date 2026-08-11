'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Images, ArrowRight, Calendar, Search, Filter, Sparkles } from 'lucide-react';
import { GalleryAlbum } from '@/types';

interface GalleryAlbumGridProps {
  initialAlbums: GalleryAlbum[];
  categories?: string[];
}

export default function GalleryAlbumGrid({
  initialAlbums,
  categories = ['All'],
}: GalleryAlbumGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlbums = initialAlbums.filter((album) => {
    const matchesCat = activeCategory === 'All' || album.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="py-16 bg-[#0A1440]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Category & Search Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          {categories.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#C9A227]" /> Categories:
              </span>
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
          ) : (
            <div />
          )}

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search albums..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121F54] border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#C9A227]"
            />
          </div>
        </div>

        {/* Albums Grid */}
        {filteredAlbums.length === 0 ? (
          <div className="text-center py-20 bg-[#121F54]/50 border border-[#1B3A6B] rounded-2xl p-8 space-y-4">
            <Images className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-white">No gallery albums found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No albums matching "${searchQuery}". Try another search keyword.`
                : `No albums available in category "${activeCategory}".`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-[#C9A227] text-[#0A1440] font-bold text-xs rounded-lg"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlbums.map((album) => {
              const photoCount = album.photoCount || album.photos?.length || 0;

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
      </div>
    </section>
  );
}
