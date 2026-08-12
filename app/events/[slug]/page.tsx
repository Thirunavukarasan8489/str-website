import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Ticket, ArrowLeft, CheckCircle2, Share2 } from 'lucide-react';
import CTAButton from '@/components/shared/CTAButton';
import SEOSchema from '@/components/shared/SEOSchema';
import { getEventSchema, getBreadcrumbSchema } from '@/lib/seo';
import { EVENTS_DATA } from '@/lib/data';
import { formatDate } from '@/lib/utils';

export const revalidate = 60; // ISR revalidate every 60 seconds

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return EVENTS_DATA.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = EVENTS_DATA.find((e) => e.slug === slug);
  if (!event) return { title: 'Event Not Found' };

  return {
    title: `${event.title} | Scotland Tamils Raise`,
    description: event.description,
    openGraph: {
      title: `${event.title} | Scotland Tamils Raise`,
      description: event.description,
      images: [{ url: event.image }],
    },
  };
}

export default async function SingleEventPage({ params }: Props) {
  const { slug } = await params;
  const event = EVENTS_DATA.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const eventSchema = getEventSchema(event);
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Events', item: '/events' },
    { name: event.title, item: `/events/${event.slug}` },
  ]);

  return (
    <>
      <SEOSchema schema={eventSchema} />
      <SEOSchema schema={breadcrumbs} />

      {/* Header Banner */}
      <section className="relative py-12 bg-[#070D2B] tartan-pattern border-b border-[#1B3A6B]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs text-[#E8C468] hover:text-[#C9A227] mb-6 transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Events
          </Link>

          <div className="space-y-4">
            <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#0A1440] bg-gradient-to-r from-[#C9A227] to-[#E8C468] rounded-full shadow-md">
              {event.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white leading-tight">
              {event.title}
            </h1>
            <p className="text-base sm:text-lg text-[#E8C468] font-medium">
              {event.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Event Details Content */}
      <section className="py-16 bg-[#0A1440]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Event Cover Image */}
              <div className="relative h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border border-[#C9A227]/40 shadow-2xl gold-glow">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
              </div>

              {/* Description */}
              <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="text-2xl font-serif font-bold text-white">
                  About This Celebration
                </h2>
                <p className="text-base text-slate-200 leading-relaxed">
                  {event.fullDescription || event.description}
                </p>
              </div>

              {/* Agenda Schedule */}
              {event.agenda && event.agenda.length > 0 && (
                <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-6 sm:p-8 space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-white">
                    Event Day Schedule
                  </h2>
                  <div className="space-y-4">
                    {event.agenda.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 pb-3 border-b border-white/10 last:border-0 last:pb-0"
                      >
                        <span className="px-3 py-1 text-xs font-bold text-[#0A1440] bg-[#E8C468] rounded-md shrink-0">
                          {item.time}
                        </span>
                        <span className="text-sm text-slate-200 font-medium">
                          {item.activity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Sticky Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#121F54] border border-[#C9A227]/50 rounded-2xl p-6 shadow-xl sticky top-28 space-y-6 gold-glow">
                <h3 className="text-xl font-serif font-bold text-white border-b border-white/10 pb-3">
                  Event Info
                </h3>

                <div className="space-y-4 text-sm text-slate-200">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-white">Date</span>
                      <span>{formatDate(event.date)}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-white">Time</span>
                      <span>{event.time}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-white">Location</span>
                      <span>{event.venue}</span>
                      <span className="block text-xs text-slate-400">{event.city}, Scotland</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-white">Ticket Price</span>
                      <span className="text-[#E8C468] font-bold">{event.price || 'Free'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  {event.registrationOpen ? (
                    <CTAButton
                      href={event.ticketLink || '/membership/join'}
                      variant="primary"
                      className="w-full text-center"
                    >
                      Reserve / Get Tickets
                    </CTAButton>
                  ) : (
                    <div className="w-full text-center py-3 bg-slate-800 rounded-lg text-slate-400 font-semibold text-sm">
                      Registration Closed
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
