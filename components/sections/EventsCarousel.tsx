'use client';

import React, { useState } from 'react';
import SectionHeading from '@/components/shared/SectionHeading';
import EventCard from '@/components/cards/EventCard';
import CTAButton from '@/components/shared/CTAButton';
import { ArrowRight, Calendar } from 'lucide-react';
import { EventItem } from '@/types';

interface EventsCarouselProps {
  initialEvents?: EventItem[];
}

export default function EventsCarousel({ initialEvents = [] }: EventsCarouselProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  const eventsList = initialEvents || [];

  const filteredEvents = eventsList.filter((e) => {
    if (filter === 'upcoming') return !e.isPast;
    if (filter === 'past') return e.isPast;
    return true;
  });

  return (
    <section className="py-20 bg-[#070D2B] border-y border-[#1B3A6B]/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Community Calendar"
          title="Upcoming Festivals & Cultural Gatherings"
          subtitle="Explore our flagship celebrations, workshops, and youth summits taking place in Edinburgh, Glasgow, and Stirling."
        />

        {eventsList.length === 0 ? (
          <div className="text-center py-12 bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-8 max-w-xl mx-auto space-y-3">
            <Calendar className="w-10 h-10 text-[#E8C468] mx-auto opacity-80" />
            <h3 className="text-base font-serif font-bold text-white">
              Upcoming Celebrations Being Scheduled
            </h3>
            <p className="text-xs text-slate-300">
              New community gatherings, festival dates, and youth workshops will be published soon.
            </p>
            <div className="pt-2">
              <CTAButton href="/membership/join" variant="primary">
                <span>Join STR Membership</span>
              </CTAButton>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="flex items-center justify-center gap-2 mb-10">
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-5 py-2 text-xs md:text-sm font-semibold rounded-full transition-all ${
                  filter === 'upcoming'
                    ? 'bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] font-bold shadow-md'
                    : 'bg-[#121F54] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-5 py-2 text-xs md:text-sm font-semibold rounded-full transition-all ${
                  filter === 'past'
                    ? 'bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] font-bold shadow-md'
                    : 'bg-[#121F54] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                Past Highlights
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2 text-xs md:text-sm font-semibold rounded-full transition-all ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] font-bold shadow-md'
                    : 'bg-[#121F54] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                All Events
              </button>
            </div>

            {/* Grid */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No events found for this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id || event.slug} event={event} />
                ))}
              </div>
            )}

            <div className="text-center">
              <CTAButton href="/events" variant="primary">
                <span>View Full Events Calendar</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </CTAButton>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
