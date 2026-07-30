import React from 'react';
import Hero from '@/components/sections/Hero';
import AboutPreview from '@/components/sections/AboutPreview';
import EventsCarousel from '@/components/sections/EventsCarousel';
import GalleryPreview from '@/components/sections/GalleryPreview';
import MembershipTiers from '@/components/sections/MembershipTiers';
import NewsletterSignup from '@/components/sections/NewsletterSignup';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <AboutPreview />
      <EventsCarousel />
      <GalleryPreview />
      <MembershipTiers />
      <NewsletterSignup />
    </div>
  );
}
