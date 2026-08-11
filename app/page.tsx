import React from 'react';
import Hero from '@/components/sections/Hero';
import AboutPreview from '@/components/sections/AboutPreview';
import EventsCarousel from '@/components/sections/EventsCarousel';
import GalleryPreview from '@/components/sections/GalleryPreview';
import MembershipTiers from '@/components/sections/MembershipTiers';
import NewsletterSignup from '@/components/sections/NewsletterSignup';
import { getHeroData, getGalleryAlbums } from '@/lib/contentService';

export const revalidate = 60; // Refresh live homepage content from DB every 60 seconds

export default async function Home() {
  const [heroData, albums] = await Promise.all([
    getHeroData(),
    getGalleryAlbums(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero data={heroData} />
      <AboutPreview />
      <EventsCarousel />
      <GalleryPreview initialAlbums={albums} />
      <MembershipTiers />
      <NewsletterSignup />
    </div>
  );
}
