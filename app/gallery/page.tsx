import React from 'react';
import type { Metadata } from 'next';
import SEOSchema from '@/components/shared/SEOSchema';
import { getBreadcrumbSchema } from '@/lib/seo';
import { getGalleryAlbums, getGalleryCategories } from '@/lib/contentService';
import GalleryAlbumGrid from '@/components/gallery/GalleryAlbumGrid';

export const revalidate = 60; // Refresh gallery albums from DB every 60 seconds

export const metadata: Metadata = {
  title: 'Photo & Video Gallery Collections | Scotland Tamils Raise',
  description:
    'Explore albums and photo collections from Scotland Tamils Raise Pongal vizhas, Tamil Academy cultural recitals, youth summits, and Highland gatherings.',
};

export default async function GalleryPage() {
  const [albums, categories] = await Promise.all([
    getGalleryAlbums(),
    getGalleryCategories(),
  ]);

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Gallery', item: '/gallery' },
  ]);

  return (
    <>
      <SEOSchema schema={breadcrumbs} />

      {/* Header Banner */}
      <section className="relative py-16 bg-[#070D2B] tartan-pattern border-b border-[#1B3A6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-[#E8C468] bg-[#1B3A6B]/50 border border-[#C9A227]/30 rounded-full">
            Visual Heritage & Collections
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-white">
            Photo & Event <span className="gold-gradient-text">Galleries</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Browse through curated albums capturing Pongal festivals, traditional folk arts, youth leadership events, and community life in Scotland.
          </p>
        </div>
      </section>

      {/* Live Album Collections Grid */}
      <GalleryAlbumGrid initialAlbums={albums} categories={categories} />
    </>
  );
}
