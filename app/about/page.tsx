import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import SectionHeading from '@/components/shared/SectionHeading';
import CommitteeGrid from '@/components/sections/CommitteeGrid';
import MilestonesTimeline from '@/components/sections/MilestonesTimeline';
import CTAButton from '@/components/shared/CTAButton';
import SEOSchema from '@/components/shared/SEOSchema';
import { getBreadcrumbSchema } from '@/lib/seo';
import { ShieldCheck, Heart, Award, Compass, BookOpen, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Scotland Tamils Raise',
  description:
    'Learn about Scotland Tamils Raise — our history, mission, leadership, and regional nodes in Edinburgh, Glasgow, Aberdeen, and Dundee.',
};

export default function AboutPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'About Us', item: '/about' },
  ]);

  return (
    <>
      <SEOSchema schema={breadcrumbs} />

      {/* Page Header */}
      <section className="relative py-16 bg-[#070D2B] tartan-pattern border-b border-[#1B3A6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-[#E8C468] bg-[#1B3A6B]/50 border border-[#C9A227]/30 rounded-full">
            Our Organization
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-white">
            Preserving Heritage, <span className="gold-gradient-text">Empowering Communities</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Scotland Tamils Raise (STR) bridges the rich traditions of ancient Tamil language and culture with the warm, multicultural spirit of modern Scotland.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-[#0A1440]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-white">
                Our Core Mission & Vision
              </h2>
              <p className="text-base text-slate-200 leading-relaxed">
                Founded over 15 years ago, Scotland Tamils Raise serves as the unified platform for the Tamil diaspora living across Edinburgh, Glasgow, Aberdeen, Dundee, Stirling, and Inverness.
              </p>
              <p className="text-base text-slate-300 leading-relaxed">
                We are committed to providing educational resources for children, preserving Tamil literature and arts, organizing grand community galas, and providing mentorship for young professionals navigating dual heritage.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-[#121F54] border border-[#1B3A6B] p-4 rounded-xl flex items-start gap-3">
                  <Compass className="w-5 h-5 text-[#C9A227] shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Cultural Identity</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Passing down language & heritage to youth.</p>
                  </div>
                </div>
                <div className="bg-[#121F54] border border-[#1B3A6B] p-4 rounded-xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#C9A227] shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Civic Leadership</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Partnering with Scottish councils & charities.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[#C9A227]/40 shadow-2xl gold-glow">
              <div className="relative h-[380px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80"
                  alt="Scotland Tamils Raise Leadership and Community Gathering"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Committee Grid */}
      <CommitteeGrid />

      {/* Milestones Timeline */}
      <MilestonesTimeline />

      {/* CTA Section */}
      <section className="py-16 bg-[#070D2B] text-center border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Be Part of Our Journey in Scotland
          </h2>
          <p className="text-slate-300 text-base mb-8 max-w-xl mx-auto">
            Join hundreds of families across Scotland. Become a member today or participate in our upcoming events.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton href="/membership/join" variant="primary">
              Join STR Community
            </CTAButton>
            <CTAButton href="/contact" variant="secondary">
              Contact Leadership
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
