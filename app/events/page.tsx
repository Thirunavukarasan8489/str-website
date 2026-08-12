import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Sparkles, ArrowRight } from 'lucide-react';
import EventCard from '@/components/cards/EventCard';
import SectionHeading from '@/components/shared/SectionHeading';
import SEOSchema from '@/components/shared/SEOSchema';
import { getBreadcrumbSchema } from '@/lib/seo';
import { getEventsList } from '@/lib/contentService';

export const revalidate = 60; // Refresh live events data every 60 seconds

export const metadata: Metadata = {
  title: 'Events & Festivals | Scotland Tamils Raise',
  description:
    'Discover upcoming Pongal galas, Tamil New Year events, youth summits, and cultural workshops hosted in Edinburgh, Glasgow, and Stirling.',
};

export default async function EventsPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Events', item: '/events' },
  ]);

  const allEvents = await getEventsList();
  const upcomingEvents = allEvents.filter((e) => !e.isPast);
  const pastEvents = allEvents.filter((e) => e.isPast);

  return (
    <>
      <SEOSchema schema={breadcrumbs} />

      {/* Page Header */}
      <section className="relative py-12 md:py-16 bg-[#070D2B] tartan-pattern border-b border-[#1B3A6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-[#E8C468] bg-[#1B3A6B]/50 border border-[#C9A227]/30 rounded-full">
            Community Calendar
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-white">
            Scottish Tamil <span className="gold-gradient-text">Events & Galas</span>
          </h1>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join us for authentic harvest celebrations, youth leadership workshops, music recitals, and family sports days across Scotland.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-[#0A1440]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
              Upcoming Events
            </h2>
            <p className="text-sm text-slate-300">
              Book your tickets early for priority seating and celebration participation.
            </p>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16 bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-8 max-w-xl mx-auto space-y-4 shadow-xl">
              <Calendar className="w-12 h-12 text-[#E8C468] mx-auto opacity-80" />
              <h3 className="text-lg font-serif font-bold text-white">No upcoming events currently scheduled</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                New festivals, cultural workshops, and youth events are added regularly by our committee. Check back soon or join our membership community to receive priority notifications!
              </p>
              <div className="pt-2">
                <Link
                  href="/membership/join"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] hover:brightness-110 shadow-lg transition-all"
                >
                  <span>Join STR Community</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id || event.slug} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events Archive */}
      {pastEvents.length > 0 && (
        <section className="py-16 bg-[#070D2B] border-t border-[#1B3A6B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                Past Event Highlights
              </h2>
              <p className="text-sm text-slate-300">
                Memories and milestones from our previous gatherings across Scotland.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-90">
              {pastEvents.map((event) => (
                <EventCard key={event.id || event.slug} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
