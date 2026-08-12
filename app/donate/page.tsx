import React from 'react';
import type { Metadata } from 'next';
import SectionHeading from '@/components/shared/SectionHeading';
import CTAButton from '@/components/shared/CTAButton';
import SEOSchema from '@/components/shared/SEOSchema';
import { getBreadcrumbSchema } from '@/lib/seo';
import { Heart, ShieldCheck, Award, BookOpen, Users, Sparkles } from 'lucide-react';

export const revalidate = 60; // Refresh live page data every 60 seconds

export const metadata: Metadata = {
  title: 'Support Us & Donate | Scotland Tamils Raise',
  description:
    'Support Scotland Tamils Raise charity programs, Tamil school scholarships, and community events across Scotland.',
};

export default function DonatePage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Donate', item: '/donate' },
  ]);

  const impactAreas = [
    {
      icon: BookOpen,
      amount: '£5',
      title: 'Tamil Language School Supplies',
      description: 'Provides textbooks, Thirukkural workbooks, and flashcards for two children in our weekend academy.',
    },
    {
      icon: Sparkles,
      amount: '£10',
      title: 'Youth Mentorship & STEM Grant',
      description: 'Sponsors university entrance mentorship and career guidance workshops for young Scottish Tamils.',
    },
    {
      icon: Heart,
      amount: '£15',
      title: 'Community Festival Subsidies',
      description: 'Helps keep ticket prices accessible for low-income families and seniors at Grand Pongal & Chithirai Vizha.',
    },
    {
      icon: Award,
      amount: '£20+',
      title: 'Patron Heritage Fund',
      description: 'Supports long-term cultural hub facilities, library archives, and Highland charity initiatives.',
    },
  ];

  return (
    <>
      <SEOSchema schema={breadcrumbs} />

      {/* Header Banner */}
      <section className="relative py-16 bg-[#070D2B] tartan-pattern border-b border-[#1B3A6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-[#E8C468] bg-[#8B1A2B]/80 border border-[#8B1A2B] rounded-full">
            Give Back to Community
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-white">
            Empower Tamil Heritage <span className="gold-gradient-text">in Scotland</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Your generous contributions directly fund weekend language schools, youth scholarships, seniors fellowship programs, and cultural galas.
          </p>
        </div>
      </section>

      {/* Impact Showcase */}
      <section className="py-20 bg-[#0A1440]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Your Impact"
            title="How Your Donations Make a Difference"
            subtitle="100% of community contributions go directly towards non-profit educational and cultural initiatives."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {impactAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227]/60 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between gold-glow-hover"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-[#8B1A2B] flex items-center justify-center text-white mb-4 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="inline-block text-2xl font-serif font-extrabold text-[#E8C468] mb-1">
                      {area.amount}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-white mb-2">
                      {area.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Donation Action Box */}
          <div className="max-w-3xl mx-auto bg-[#121F54] border border-[#C9A227]/40 rounded-2xl p-8 sm:p-10 text-center shadow-2xl gold-glow">
            <h3 className="text-2xl font-serif font-bold text-white mb-2">
              Make a Direct Contribution
            </h3>
            <p className="text-sm text-slate-300 mb-6 max-w-md mx-auto">
              For direct bank transfers, Gift Aid declarations, or corporate sponsorship, please get in touch with our treasurer.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton href="/contact?subject=Donation" variant="maroon">
                <Heart className="w-4 h-4 mr-2 fill-white" />
                <span>Donate Now</span>
              </CTAButton>
              <CTAButton href="/membership/join?tier=lifetime" variant="primary">
                Become a Member
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
