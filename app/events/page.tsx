import React from 'react';
import type { Metadata } from 'next';
import EventCard from '@/components/cards/EventCard';
import SectionHeading from '@/components/shared/SectionHeading';
import SEOSchema from '@/components/shared/SEOSchema';
import { getBreadcrumbSchema } from '@/lib/seo';
import { EVENTS_DATA } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Events & Festivals | Scotland Tamils Raise',
  description:
    'Discover upcoming Pongal galas, Tamil New Year events, youth summits, and cultural workshops hosted in Edinburgh, Glasgow, and Stirling.',
};

export default function EventsPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Events', item: '/events' },
  ]);

  const upcomingEvents = EVENTS_DATA.filter((e) => !e.isPast);
  const pastEvents = EVENTS_DATA.filter((e) => e.isPast);

  return (
    <>
      <SEOSchema schema={breadcrumbs} />

      {/* Page Header */}
      <section className="relative py-16 bg-[#070D2B] tartan-pattern border-b border-[#1B3A6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-[#E8C468] bg-[#1B3A6B]/50 border border-[#C9A227]/30 rounded-full">
            Community Calendar
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-white">
            Scottish Tamil <span className="gold-gradient-text">Events & Galas</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Join us for authentic harvest celebrations, youth leadership workshops, music recitals, and family sports days across Scotland.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-[#0A1440]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
              Upcoming Events (2026)
            </h2>
            <p className="text-sm text-slate-300">
              Book your tickets early for priority seating and banana leaf feast allocation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 bg-[#070D2B] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
              Past Celebrations & Archives
            </h2>
            <p className="text-sm text-slate-300">
              A look back at our recent community gatherings and celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
